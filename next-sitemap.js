const excludedPaths = ["/cart", "/checkout", "/account/*"];

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  generateRobotsTxt: true,
  exclude: excludedPaths + ["/[sitemap]"],
  robotsTxtOptions: {
    additionalSitemaps: [process.env.NEXT_PUBLIC_VERCEL_URL + "/[sitemap]"],
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
