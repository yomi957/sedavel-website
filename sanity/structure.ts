import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = S => S.list()
  .title("Sedavel Content / 内容管理")
  .items([
    S.listItem().title("Home Page / 首页").id("homePage").child(S.document().schemaType("homePage").documentId("homePage")),
    S.listItem().title("Features Page / 功能页内容").id("featuresPage").child(S.document().schemaType("websitePage").documentId("page-features").title("Features Page / 功能页内容").initialValueTemplate("features-page")),
    S.listItem().title("Pricing Page / 价格页内容").id("pricingPage").child(S.document().schemaType("websitePage").documentId("page-pricing").title("Pricing Page / 价格页内容").initialValueTemplate("pricing-page")),
    S.listItem().title("Download Page / 下载页内容").id("downloadPage").child(S.document().schemaType("websitePage").documentId("page-download").title("Download Page / 下载页内容").initialValueTemplate("download-page")),
    S.listItem().title("推广返现 / Referral Rewards").id("referralPage").child(S.document().schemaType("websitePage").documentId("page-referral").title("推广返现 / Referral Rewards").initialValueTemplate("referral-page")),
    S.documentTypeListItem("feature").title("Features / 产品功能"),
    S.documentTypeListItem("blogPost").title("Blog Posts / 博客文章"),
    S.documentTypeListItem("blogCategory").title("Blog Categories / 博客分类"),
    S.documentTypeListItem("helpArticle").title("Help Articles / 帮助文章"),
    S.divider(),
    S.listItem().title("Site Settings / 网站设置").id("siteSettings").child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings / 网站设置").initialValueTemplate("site-settings")),
  ]);
