import { websitePage, pageHero, pageModules, cmsAction, cmsIcon, localizedText } from "./page-content";
import { homePage } from "./home-page";
import { feature } from "./feature";
import { blogCategory } from "./blog-category";
import { blogPost } from "./blog-post";
import { helpArticle } from "./help-article";
import { siteSettings } from "./site-settings";
import { localizedString, contentImage, portableText, seoMetadata } from "./objects";

export const schemaTypes = [websitePage, pageHero, ...pageModules, cmsAction, cmsIcon, localizedText, homePage, feature, blogCategory, blogPost, helpArticle, siteSettings, localizedString, contentImage, portableText, seoMetadata];
