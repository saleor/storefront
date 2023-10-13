const excludedPaths = ["/cart", "/checkout", "/account/*"];
const additionalExcludedPaths = ["/[sitemap]"];

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  generateRobotsTxt: true,
  exclude: [...excludedPaths, ...additionalExcludedPaths],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
};
