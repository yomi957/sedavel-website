export type Locale = "en" | "zh";

type FeatureItem = {
  title: string;
  body: string;
  badge?: string;
};

type Plan = {
  name: string;
  quota: string;
  price: string;
  description: string;
  points: string[];
};

type FaqItem = {
  q: string;
  a: string;
};

export type Dictionary = {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    features: string;
    solutions: string;
    referral: string;
    help: string;
    blog: string;
    pricing: string;
    download: string;
    contact: string;
    getStarted: string;
    language: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    ctaNote: string;
    secondary: string;
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    items: { title: string; body: string }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    billed: string;
    characters: string;
    cta: string;
    placeholderNote: string;
    featured: string;
    plans: Plan[];
  };
  faq: {
    eyebrow: string;
    title: string;
    items: FaqItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    signup: string;
    download: string;
    signupNote: string;
    downloadNote: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    action: string;
    note: string;
  };
  footer: {
    blurb: string;
    product: string;
    company: string;
    legal: string;
    contact: string;
    privacy: string;
    terms: string;
    rights: string;
    placeholderLegal: string;
  };
  legal: {
    privacyTitle: string;
    termsTitle: string;
    placeholder: string;
    back: string;
  };
  conceptual: string;
  preview: { label: string; title: string; note: string; featureNote: string };
  solutions: { eyebrow: string; title: string; subtitle: string; items: FeatureItem[] };
};

export const PLACEHOLDER_SIGNUP = "#placeholder-signup";
export const PLACEHOLDER_DOWNLOAD = "#placeholder-download";

export const dictionaries = {
  en: {
    brand: "Sedavel",
    tagline: "SCRM for cross-border teams",
    nav: {
      home: "Home",
      features: "Features",
      solutions: "Solutions",
      referral: "Referral Center",
      help: "Help Center",
      blog: "Blog",
      pricing: "Pricing",
      download: "Download",
      contact: "Contact",
      getStarted: "Get Started Free",
      language: "Language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "One platform for global customer relationships",
      title: "One Workspace. Every Conversation.",
      subtitle:
        "Manage customer conversations across channels and languages, all from one workspace.",
      cta: "Get Started Free",
      ctaNote: "Placeholder link — signup URL coming soon",
      secondary: "Explore Features",
    },
    features: {
      eyebrow: "Connected by design",
      title: "Less switching. More meaningful conversations.",
      subtitle: "Translation, communication and customer context, brought together for teams working across borders.",
      items: [
        { title: "Smart Multilingual Translation", body: "Reduce language barriers with real-time translation, so your team can focus on the conversation." },
        { title: "AI Copilot", badge: "Coming Soon", body: "AI-assisted greetings and smart replies are in development. This capability is not available yet." },
        { title: "Unified Messaging", body: "A shared workspace direction for multi-account, cross-channel communication. Available channel coverage will be confirmed in the product." },
        { title: "Customer Management", body: "Keep customer relationships at the center of your workflow. Specific customer management capabilities will be confirmed in the product." },
      ],
    },
    benefits: {
      eyebrow: "A clearer way to work", title: "Built around your conversations",
      items: [
        { title: "Simplified Communication", body: "Spend less time moving between tools and more time understanding your customers." },
        { title: "Cross-Language Collaboration", body: "Bring clarity to international conversations with real-time translation." },
        { title: "Centralized Workflow", body: "Bring multi-account work into one workspace and keep your team focused." },
      ],
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Character quota plans",
      subtitle:
        "Sedavel usage is billed by character quota. Choose a monthly plan that matches your conversation volume.",
      billed: "Billed monthly",
      characters: "characters / month",
      cta: "Get Started Free",
      placeholderNote: "Placeholder link — checkout is not live yet",
      featured: "Most used",
      plans: [
        {
          name: "Starter",
          quota: "200,000",
          price: "$19",
          description: "For small teams starting with a focused set of accounts.",
          points: [
            "Multi-account workspace",
            "Real-time translation",
            "Email support",
          ],
        },
        {
          name: "Growth",
          quota: "1,000,000",
          price: "$59",
          description: "For growing sellers handling daily multilingual conversations.",
          points: [
            "Everything in Starter",
            "Higher character quota",
            "Priority support",
          ],
        },
        {
          name: "Scale",
          quota: "5,000,000",
          price: "$149",
          description: "For teams that need more quota across a larger account set.",
          points: [
            "Everything in Growth",
            "Highest listed quota",
            "Dedicated onboarding",
          ],
        },
      ],
    },
    faq: {
      eyebrow: "FAQ",
      title: "Common questions",
      items: [
        {
          q: "What is Sedavel?",
          a: "Sedavel is an SCRM customer communication tool for cross-border e-commerce sellers and foreign-trade companies. It helps teams manage conversations more efficiently across accounts and languages.",
        },
        {
          q: "Which features are available now?",
          a: "Multi-Account Management and Real-Time Translation are current core features. AI Quick Replies is marked Coming Soon and is not generally available.",
        },
        {
          q: "How do character quotas work?",
          a: "Plans are based on a monthly character quota used for translation and related message processing. Unused quota details will be confirmed at checkout when billing goes live.",
        },
        {
          q: "Can I start for free?",
          a: "A free getting-started path is planned. The Get Started Free button is a placeholder until the official signup URL is published.",
        },
        {
          q: "Where can I download Sedavel?",
          a: "The Download action is reserved for the official app link. Until that URL is ready, the button is a clearly marked placeholder.",
        },
      ],
    },
    cta: {
      title: "Ready to simplify customer communication?",
      subtitle:
        "Create a workspace or download Sedavel when official links are published. Until then, both actions are placeholders.",
      signup: "Get Started Free",
      download: "Download Sedavel",
      signupNote: "Placeholder — signup URL coming soon",
      downloadNote: "Placeholder — download URL coming soon",
    },
    contact: {
      eyebrow: "Contact",
      title: "Talk with the Sedavel team",
      body: "For product questions, partnerships, or support, use the placeholder contact action below until the official channel is published.",
      action: "Contact us",
      note: "Placeholder link — contact URL coming soon",
    },
    footer: {
      blurb:
        "Sedavel helps cross-border sellers and foreign-trade teams manage customer communication in one workspace.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      rights: "All rights reserved.",
      placeholderLegal: "Placeholder page",
    },
    legal: {
      privacyTitle: "Privacy Policy",
      termsTitle: "Terms of Service",
      placeholder:
        "This is a placeholder legal page. Official policy text will be published here before public launch.",
      back: "Back to home",
    },
    conceptual: "Product imagery pending",
    preview: { label: "THE SEDAVEL WORKSPACE", title: "Your product workspace, here.", note: "Awaiting an official product screenshot. This is an image placeholder, not a software interface.", featureNote: "Official feature visual pending" },
    solutions: { eyebrow: "Solutions", title: "Global business. A shared need to connect.", subtitle: "For cross-border sellers, international trade, social media operators and teams expanding overseas.", items: [
      { title: "Cross-Border E-commerce", body: "For marketplace and independent-store teams handling multilingual product questions and customer conversations." },
      { title: "B2B International Trade", body: "For international sales teams communicating about requirements, quotations and ongoing business relationships." },
      { title: "Social Commerce & DTC Brands", body: "For overseas social media and direct-to-consumer teams building customer relationships across languages." },
    ] },
  },
  zh: {
    brand: "Sedavel",
    tagline: "面向跨境团队的 SCRM",
    nav: {
      home: "首页",
      features: "功能",
      solutions: "解决方案",
      referral: "邀请中心",
      help: "帮助中心",
      blog: "博客",
      pricing: "价格",
      download: "下载",
      contact: "联系我们",
      getStarted: "免费开始",
      language: "语言",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
    },
    hero: {
      eyebrow: "一站式多语言沟通与客户管理平台",
      title: "One Workspace. Every Conversation.",
      subtitle:
        "在同一工作区管理跨渠道、跨语言的客户对话，让全球业务沟通更简单。",
      cta: "免费开始",
      ctaNote: "占位链接 — 注册地址即将公布",
      secondary: "探索功能",
    },
    features: {
      eyebrow: "四大核心能力",
      title: "减少工具切换，让每次沟通更有价值。",
      subtitle: "围绕翻译、沟通与客户关系，连接跨境业务的日常工作。",
      items: [
        { title: "智能多语言翻译", body: "借助实时翻译降低语言障碍，让团队更专注于客户对话本身。" },
        { title: "AI 助手 Copilot", badge: "即将推出", body: "AI 快捷问候与智能回复正在开发中，目前尚未正式上线。" },
        { title: "多渠道消息聚合", body: "以统一工作区承载多账号与跨渠道沟通。具体支持渠道以产品正式说明为准。" },
        { title: "客户管理", body: "围绕客户关系组织日常沟通与工作流程。具体客户管理能力以产品正式说明为准。" },
      ],
    },
    benefits: {
      eyebrow: "品牌优势", title: "围绕客户对话，建立更清晰的工作方式",
      items: [
        { title: "简化沟通", body: "减少在不同工具之间切换，把更多时间留给理解客户与回应需求。" },
        { title: "跨语言协作", body: "通过实时翻译，让跨语言客户沟通更清晰，让国际业务协作更顺畅。" },
        { title: "集中工作流程", body: "将多账号工作集中到一个工作区，让团队专注于当前对话。" },
      ],
    },
    pricing: {
      eyebrow: "价格",
      title: "字符额度套餐",
      subtitle:
        "Sedavel 按字符额度计费。请选择与沟通量匹配的月度套餐。",
      billed: "按月计费",
      characters: "字符 / 月",
      cta: "免费开始",
      placeholderNote: "占位链接 — 结账流程尚未上线",
      featured: "常用",
      plans: [
        {
          name: "Starter",
          quota: "200,000",
          price: "$19",
          description: "适合账号数量较少、正在起步的小团队。",
          points: ["多账号工作区", "实时翻译", "邮件支持"],
        },
        {
          name: "Growth",
          quota: "1,000,000",
          price: "$59",
          description: "适合日常需要多语言沟通的成长型卖家。",
          points: ["包含 Starter 全部能力", "更高字符额度", "优先支持"],
        },
        {
          name: "Scale",
          quota: "5,000,000",
          price: "$149",
          description: "适合账号更多、需要更大额度的团队。",
          points: ["包含 Growth 全部能力", "当前最高额度", "专属开通协助"],
        },
      ],
    },
    faq: {
      eyebrow: "常见问题",
      title: "FAQ",
      items: [
        {
          q: "Sedavel 是什么？",
          a: "Sedavel 是面向跨境电商卖家和外贸企业的 SCRM 客户沟通管理工具，帮助团队更高效地管理跨账号、跨语言的客户沟通。",
        },
        {
          q: "目前有哪些功能已经可用？",
          a: "多账号管理和实时翻译是当前核心功能。AI 快捷问候与智能回复标注为即将推出，尚未正式发布。",
        },
        {
          q: "字符额度如何计算？",
          a: "套餐按每月字符额度计费，额度用于翻译及相关消息处理。计费上线后，将在结账时确认未使用额度等细则。",
        },
        {
          q: "可以免费开始使用吗？",
          a: "我们计划提供免费开始路径。在正式注册地址公布前，「免费开始」按钮为占位链接。",
        },
        {
          q: "在哪里下载 Sedavel？",
          a: "下载入口将指向官方应用链接。在该地址准备好之前，下载按钮为明确标注的占位链接。",
        },
      ],
    },
    cta: {
      title: "准备好简化客户沟通了吗？",
      subtitle:
        "官方注册与下载地址公布后即可使用。在此之前，这两个操作均为占位链接。",
      signup: "免费开始",
      download: "下载 Sedavel",
      signupNote: "占位链接 — 注册地址即将公布",
      downloadNote: "占位链接 — 下载地址即将公布",
    },
    contact: {
      eyebrow: "联系",
      title: "联系 Sedavel 团队",
      body: "如需咨询产品、合作或支持，请先使用下方占位联系入口；正式渠道公布后将替换为真实地址。",
      action: "联系我们",
      note: "占位链接 — 联系地址即将公布",
    },
    footer: {
      blurb:
        "Sedavel 帮助跨境电商卖家和外贸企业，在同一工作区中管理客户沟通。",
      product: "产品",
      company: "公司",
      legal: "法律信息",
      contact: "联系我们",
      privacy: "隐私政策",
      terms: "服务条款",
      rights: "保留所有权利。",
      placeholderLegal: "占位页面",
    },
    legal: {
      privacyTitle: "隐私政策",
      termsTitle: "服务条款",
      placeholder: "这是法律信息占位页面。正式文本将在公开发布前更新于此。",
      back: "返回首页",
    },
    conceptual: "等待正式产品素材",
    preview: { label: "SEDAVEL 产品工作区", title: "在这里，直观了解产品。", note: "等待正式产品截图。此处为图片占位区域，并非软件界面。", featureNote: "等待正式功能展示素材" },
    solutions: { eyebrow: "客户应用场景", title: "不同的全球业务，共同的沟通需求。", subtitle: "服务跨境卖家、国际贸易、海外社媒运营及出海业务团队。", items: [
      { title: "跨境电商与独立站", body: "面向跨境平台及独立站团队，帮助理解不同语言的商品咨询与客户需求。" },
      { title: "外贸 B2B 企业", body: "面向国际销售团队，围绕需求、报价和长期客户关系开展跨语言商务沟通。" },
      { title: "海外社媒与 DTC 品牌", body: "面向海外社媒运营及直面消费者的品牌团队，通过跨语言沟通建立客户关系。" },
    ] },
  },
} satisfies Record<Locale, Dictionary>;
