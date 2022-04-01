const excludedPaths = ["/cart", "/checkout", "/account/*"];

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3001",
  generateRobotsTxt: true,
  exclude: excludedPaths + ["/[sitemap]"],
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
