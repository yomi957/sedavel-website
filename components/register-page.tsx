"use client";

import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Logo } from "@/components/logo";
import { useLanguage } from "@/components/language-provider";

const content = {
  en: {
    title: "Welcome to Sedavel.", subtitle: "A clearer workspace for your customer conversations.",
    intro: "Explore multi-account management and real-time translation. Registered users can access all released features without a membership, with character packs available as needed.",
    status: "Registration is being connected", notice: "This is a form preview. Inputs and submission are disabled. No account is created, and no email address or password is collected, stored or sent.",
    form: "Create your account", name: "Your name", email: "Email address", password: "Password", submit: "Sign Up Free · Not available yet",
    account: "Already have an account?", login: "Login entry · Coming soon", back: "← Back to home",
    points: ["One workspace for multiple accounts", "Communicate across languages", "All released features, no membership required"],
  },
  zh: {
    title: "欢迎来到 Sedavel。", subtitle: "让客户沟通拥有更清晰的工作空间。",
    intro: "了解多账号管理与实时翻译。注册用户可使用全部已上线功能，无须购买会员，字符额度包按需购买。",
    status: "注册功能正在接入", notice: "此处仅展示表单设计，输入与提交均已禁用。不会创建账号，也不会收集、保存或发送邮箱及密码。",
    form: "创建你的账号", name: "你的姓名", email: "邮箱地址", password: "密码", submit: "免费注册 · 暂未开放",
    account: "已有账号？", login: "登录入口 · 即将开放", back: "← 返回首页",
    points: ["在同一工作区管理多个账号", "轻松开展跨语言客户沟通", "全部已上线功能，无须购买会员"],
  },
};

export function RegisterPage() {
  const { locale } = useLanguage();
  const t = content[locale];
  return (
    <main className="bg-[#F7F9F8] text-[#647067]">
      <PageHero en={content.en.title} zh={content.zh.title} description={{ en: content.en.subtitle, zh: content.zh.subtitle }} />
      <div className="px-5 py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <Link href="/" className="inline-flex"><Logo /></Link>
          <p className="mt-5 text-sm leading-7">{t.intro}</p>
          <ul className="mt-7 space-y-3 text-sm">{t.points.map(p => <li className="flex gap-3" key={p}><span aria-hidden="true" className="text-[#187B36]">✓</span>{p}</li>)}</ul>
          <Link className="mt-9 inline-flex min-h-11 items-center font-semibold text-[#187B36] hover:underline" href="/">{t.back}</Link>
        </div>
        <section aria-labelledby="registration-title" className="min-w-0 rounded-3xl border border-[#dce9df] bg-white p-6 shadow-sm sm:p-9">
          <h2 id="registration-title" className="text-2xl font-semibold tracking-tight text-[#17231B]">{t.form}</h2>
          <div id="registration-status" className="my-6 rounded-2xl border border-[#cce6d2] bg-[#E9F8ED] p-4"><p className="text-sm font-semibold text-[#187B36]">{t.status}</p><p className="mt-2 text-xs leading-6">{t.notice}</p></div>
          <form aria-describedby="registration-status" onSubmit={event => event.preventDefault()}>
            <fieldset disabled className="space-y-5">
              <legend className="sr-only">{t.form}</legend>
              {[{ id: "register-name", type: "text", label: t.name }, { id: "register-email", type: "email", label: t.email }, { id: "register-password", type: "password", label: t.password }].map(field => <div key={field.id}><label htmlFor={field.id} className="mb-2 block text-sm font-medium text-[#17231B]">{field.label}</label><input id={field.id} type={field.type} disabled autoComplete="off" className="h-12 w-full min-w-0 cursor-not-allowed rounded-xl border border-[#dce9df] bg-[#F7F9F8] px-4" /></div>)}
              <button disabled type="submit" className="min-h-12 w-full cursor-not-allowed rounded-xl bg-[#E9F8ED] px-4 py-3 text-sm font-semibold text-[#187B36]">{t.submit}</button>
            </fieldset>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs"><p>{t.account}</p><button type="button" disabled className="min-h-11 cursor-not-allowed text-[#187B36]">{t.login}</button></div>
        </section>
      </div>
      </div>
    </main>
  );
}
