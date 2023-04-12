const { Octokit } = require("@octokit/core");
const { Command } = require("commander");
const { GraphQLClient } = require("graphql-request");

const program = new Command();
const client = new GraphQLClient("https://dashboard.cypress.io/graphql");

const repo = "saleor-cloud-deployments";
const owner = "saleor";

program
  .name("Add comment to release PR and create issues if test case failed")
  .description("Add comment to release PR and create issues if test case failed")
  .option("--version <version>", "version of a project")
  .option("--pull_request_number <pull_request_number>", "Pull Request number")
  .option("--dashboard_url <dashboard_url>", "Cypress dashboard url")
  .action(async (options) => {
    const githubToken = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({
      auth: githubToken,
    });

    const pullNumber = options.pull_request_number;

    const pullRequest = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      owner,
      repo,
      pull_number: pullNumber,
    });

    const commitId = pullRequest.data.merge_commit_sha;

    const data = await getTestsStatusAndId(options.dashboard_url);

    let testsStatus = data.status;

    let requestBody = `Cypress tests passed. See results at ${options.dashboard_url}`;

    if (testsStatus === "FAILED") {
      requestBody = await getCommentForPRIfTestsFailed(octokit, data, options);
    } else if (testsStatus === "ERRORED") {
      requestBody = `Tests ERRORED! Check log at ${options.dashboard_url}`;
    }

    const event = "COMMENT";
    await octokit.request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      owner,
      repo,
      pull_number: pullNumber,
      commit_id: commitId,
      body: requestBody,
      event,
      comments: [],
    });
  })
  .parse();

async function getCommentForPRIfTestsFailed(octokit, data, options) {
  const failedNewTests = [];
  const listOfTestIssues = await getListOfTestsIssues(octokit);
  const testCases = await getFailedTestCases(data.runId);
  testCases.forEach((testCase) => {
    if (testCase.titleParts) {
      const issue = issueOnGithub(listOfTestIssues, testCase.titleParts[1]);
      if (issue) {
        const knownBug = isIssueAKnownBug(issue);
        if (!knownBug) {
          failedNewTests.push({
            title: testCase.titleParts[1],
            url: issue.html_url,
            spec: testCase.titleParts[0],
          });
        }
      } else {
        failedNewTests.push({
          title: testCase.titleParts[1],
          spec: testCase.titleParts[0],
        });
      }
    }
  });

  if (failedNewTests.length === 0) {
    return `All failed tests are known bugs, can be merged. See results at ${options.dashboard_url}`;
  } else if (failedNewTests.length > 10) {
    //If there are more than 10 new bugs it's probably caused by something else. Server responses with 500, or test user was deleted, etc.

    return "There is more than 10 new bugs, check results manually and create issues for them if necessary";
  } else {
    let requestBody = `New bugs found, results at: ${options.dashboard_url}. List of issues to check: `;
    for (const newBug of failedNewTests) {
      if (!newBug.url) {
        const issueUrl = await createIssue(newBug, options.version, octokit);
        requestBody += `\n${newBug.title} - ${issueUrl}`;
      } else {
        requestBody += `\n${newBug.title} - ${newBug.url}`;
      }
    }
    requestBody += `\nIf this bugs won't be fixed in next patch release for this version mark them as known issues`;
  }
  return requestBody;
}

async function getTestsStatusAndId(dashboardUrl) {
  const getProjectRegex = /\/projects\/([^\/]*)/;
  const getRunRegex = /\/runs\/([^\/]*)/;

  const requestVariables = {
    projectId: dashboardUrl.match(getProjectRegex)[1],
    buildNumber: dashboardUrl.match(getRunRegex)[1],
  };

  const throwErrorAfterTimeout = setTimeout(function () {
    throw new Error("Run have still running status, after all tests executed");
  }, 1200000);

  const data = await waitForTestsToFinish(requestVariables);

  clearTimeout(throwErrorAfterTimeout);
  return { status: data.status, runId: data.id };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForTestsToFinish(requestVariables) {
  const response = await client.request(
    `query ($projectId: String!, $buildNumber: ID!) {
      runByBuildNumber(buildNumber: $buildNumber, projectId: $projectId) {
        status,
        id
      }
    }`,
    requestVariables
  );
  if (response.runByBuildNumber.status === "RUNNING") {
    await wait(10000);
    return waitForTestsToFinish(requestVariables);
  }
  return response.runByBuildNumber;
}

async function getFailedTestCases(runId) {
  const requestVariables = {
    input: {
      runId,
      testResultState: ["FAILED"],
    },
  };

  const response = await client.request(
    `query RunTestResults($input: TestResultsTableInput!) {
        testResults(input: $input) {
          ... on TestResult {
          ...RunTestResult
          }
        }
      }
      fragment RunTestResult on TestResult {  id  titleParts  state}`,
    requestVariables
  );
  return response.testResults;
}

async function getListOfTestsIssues(octokit) {
  const result = await octokit.request("GET /repos/{owner}/react-storefront/issues?labels=tests", {
    owner,
  });
  return result.data;
}

function issueOnGithub(listOfTestIssues, testCaseTitle) {
  if (listOfTestIssues.length > 0) {
    return listOfTestIssues.find((issue) => {
      return issue.title.includes(testCaseTitle);
    });
  }
}

function isIssueAKnownBug(issue) {
  const issueBody = issue.body;
  const regex = /Is a known bug\?:\s{0,}true/;
  return regex.test(issueBody);
}

function getFormattedVersion(version) {
  const regex = /^\d+\.\d+\./;
  return version.match(regex)[0].replace(/\./g, "");
}

async function createIssue(newBug, version, octokit) {
  const issue = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner,
    repo: "react-storefront",
    title: `Cypress test fail: ${newBug.title}`,
    body: `**Cypress test fail: ${newBug.title}**\nFirst occurred on version:v${getFormattedVersion(
      version
    )}\n\n Is a known bug?: false\n**Additional Info:**\nSpec: ${newBug.spec}`,
    labels: ["tests"],
  });
  return issue.data.html_url;
}
