module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
  generateRobotsTxt: true,
  exclude: ["/checkout", "/account/preferences", "/[sitemap]"],
  robotsTxtOptions: {
    additionalSitemaps: [process.env.NEXT_PUBLIC_VERCEL_URL + "/[sitemap]"],
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
