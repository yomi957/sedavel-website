import type { BlogPost } from "./blog-cms";
/** Conservative exclusion until demo content has been replaced and reviewed. */
export function editorialPost(post: BlogPost) {
  return !post.seo.noIndex && !/(^|-)(test|sample|demo)(-|$)/i.test(post.slug) && !/\b(test|sample|demo)\b|测试|示例|演示/i.test(`${post.title.en || ''} ${post.title.zh || ''}`);
}
