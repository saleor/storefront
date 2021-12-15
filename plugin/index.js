const { promises: fs } = require("fs");
const path = require("path");

exports.onPostBuild = async ({ constants }) => {
  const handlerSrc = path.join(
    constants.FUNCTIONS_DIST,
    "___netlify-handler.zip"
  );
  const handlerDest = path.join(
    constants.PUBLISH_DIR,
    "___netlify-handler.zip"
  );
  await fs.copyFile(handlerSrc, handlerDest);
};
