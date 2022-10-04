// We import this function in `next.config.js`
// hence TypeScript cannot be used directly

/**
 * @param {string} url
 * @returns {string}
 */
module.exports.localhostHttp = (url) => {
  try {
    if (new URL(url).hostname === "localhost") {
      return url.replace(/^https:/, "http:");
    }
    return url;
  } catch (e) {
    console.warn(e, url);
    return url;
  }
};
