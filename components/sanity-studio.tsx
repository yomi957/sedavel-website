"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export function SanityStudio() {
  if (!config) {
    return <main style={{ maxWidth: 720, margin: "80px auto", padding: 24, fontFamily: "system-ui", lineHeight: 1.7 }}><h1>Sanity Studio setup required / 后台配置待完成</h1><p>Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local, then restart the server.</p><p>请配置项目 ID 与数据集并重启服务。不要在公开环境变量中填写 API Token 或密码。</p></main>;
  }
  return <NextStudio config={config} />;
}
