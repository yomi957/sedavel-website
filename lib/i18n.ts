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
    features: string;
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
};

export const PLACEHOLDER_SIGNUP = "#placeholder-signup";
export const PLACEHOLDER_DOWNLOAD = "#placeholder-download";

export const dictionaries = {
  en: {
    brand: "Sedavel",
    tagline: "SCRM for cross-border teams",
    nav: {
      features: "Features",
      pricing: "Pricing",
      download: "Download",
      contact: "Contact",
      getStarted: "Get Started Free",
      language: "Language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Customer communication for cross-border commerce",
      title: "One Workspace. Every Conversation.",
      subtitle:
        "Manage multiple accounts, communicate across languages, and simplify customer communication with Sedavel.",
      cta: "Get Started Free",
      ctaNote: "Placeholder link — signup URL coming soon",
      secondary: "View features",
    },
    features: {
      eyebrow: "Core Features",
      title: "Built for high-volume customer conversations",
      subtitle:
        "Sedavel helps cross-border sellers and foreign-trade teams keep accounts, languages, and replies in one workspace.",
      items: [
        {
          title: "Multi-Account Management",
          body: "Bring multiple customer-communication accounts into a single workspace so your team can switch context without losing the thread.",
        },
        {
          title: "Real-Time Translation",
          body: "Translate incoming and outgoing messages as you work, so language differences slow the conversation less.",
        },
        {
          title: "AI Quick Replies",
          badge: "Coming Soon",
          body: "AI-assisted greetings and smart replies are in development. This capability is not generally available yet.",
        },
      ],
    },
    benefits: {
      eyebrow: "Benefits",
      title: "Communicate faster, with fewer moving parts",
      items: [
        {
          title: "Raise communication efficiency",
          body: "Keep conversations, accounts, and follow-ups in one place so your team spends less time switching tools.",
        },
        {
          title: "Lower the language barrier",
          body: "Use real-time translation to understand customers and reply clearly across languages.",
        },
        {
          title: "Simplify multi-account work",
          body: "Operate several accounts from one workspace instead of juggling separate inboxes.",
        },
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
    conceptual: "Conceptual illustration — not a product screenshot",
  },
  zh: {
    brand: "Sedavel",
    tagline: "面向跨境团队的 SCRM",
    nav: {
      features: "功能",
      pricing: "价格",
      download: "下载",
      contact: "联系",
      getStarted: "免费开始",
      language: "语言",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
    },
    hero: {
      eyebrow: "面向跨境电商与外贸的客户沟通管理",
      title: "One Workspace. Every Conversation.",
      subtitle:
        "通过 Sedavel 管理多个账号、跨语言沟通，并简化客户沟通流程。",
      cta: "免费开始",
      ctaNote: "占位链接 — 注册地址即将公布",
      secondary: "查看功能",
    },
    features: {
      eyebrow: "核心功能",
      title: "为高频客户沟通而设计",
      subtitle:
        "Sedavel 帮助跨境电商卖家和外贸企业，在同一工作区中管理账号、语言与回复。",
      items: [
        {
          title: "多账号管理",
          body: "将多个客户沟通账号集中到同一工作区，减少来回切换，避免对话上下文丢失。",
        },
        {
          title: "实时翻译",
          body: "在沟通过程中实时翻译收发消息，降低语言差异对回复效率的影响。",
        },
        {
          title: "AI 快捷问候与智能回复",
          badge: "即将推出",
          body: "AI 快捷问候与智能回复仍在开发中，目前尚未正式上线。",
        },
      ],
    },
    benefits: {
      eyebrow: "产品价值",
      title: "提升沟通效率，减少工具切换",
      items: [
        {
          title: "提升沟通效率",
          body: "将对话、账号与跟进集中在一处，减少在多个工具间来回切换的时间。",
        },
        {
          title: "降低语言障碍",
          body: "借助实时翻译理解客户诉求，并用客户使用的语言更清晰地回复。",
        },
        {
          title: "简化多账号管理",
          body: "在同一工作区操作多个账号，而不必分别维护多个收件箱。",
        },
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
      contact: "联系",
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
    conceptual: "概念示意，并非产品截图",
  },
} satisfies Record<Locale, Dictionary>;
