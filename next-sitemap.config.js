/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://nvidia-llm-calculator.vercel.app",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  generateIndexSitemap: false,
  sitemapSize: 7000,
  exclude: ["/server-sitemap.xml"],
  alternateRefs: [
    {
      href: "https://nvidia-llm-calculator.vercel.app/en",
      hreflang: "en",
    },
    {
      href: "https://nvidia-llm-calculator.vercel.app/zh",
      hreflang: "zh",
    },
  ],
};
