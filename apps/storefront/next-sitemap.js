module.exports = {
  siteUrl: process.env.SITE_URL || "https://localhost:3001",
  generateRobotsTxt: true,
  exclude: ["/checkout", "/account/preferences", "/[sitemap]"],
  robotsTxtOptions: {
    additionalSitemaps: [
      process.env.SITE_URL || "https://localhost:3001" + "/[sitemap]",
    ],
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/checkout", "/account/preferences"],
      },
    ],
  },
};
