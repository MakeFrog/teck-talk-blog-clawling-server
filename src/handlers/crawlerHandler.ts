// src/handlers/crawlerHandler.ts
import { blogConfigs } from "../config/blogConfigs";
import { crawlBlog } from "../crawlers";
import { Post } from "../models/post";
import { Logger } from "../utils/logger";

export const handler = async (event: any = {}): Promise<any> => {
  try {
    let allPosts: Post[] = [];
    for (const config of blogConfigs) {
      Logger.info(`크롤링 시작: ${config.name}`);
      const posts = await crawlBlog(config);
      Logger.info(`${config.name}에서 ${posts.length}개의 게시글 발견`);
      Logger.info(`크롤링된 데이터: ${JSON.stringify(posts, null, 2)}`);
      allPosts = allPosts.concat(posts);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "크롤링이 완료되었습니다.",
        totalPosts: allPosts.length,
      }),
    };
  } catch (error) {
    Logger.error("크롤링 중 오류 발생", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "크롤링 작업 중 오류가 발생했습니다." }),
    };
  }
};
