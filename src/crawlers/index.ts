// src/crawlers/index.ts
import { BlogConfig } from "../config/blogConfigs";
import { crawlRss } from "./rssCrawler";
import { Post } from "../models/post";

export async function crawlBlog(
  config: BlogConfig,
  compareWithFirebase: boolean = true
): Promise<Post[]> {
  return crawlRss(config, compareWithFirebase);
}
