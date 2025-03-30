import * as Parser from "rss-parser";
import axios from "axios";
import { BlogConfig } from "../config/blogConfigs";
import { Post } from "../models/post";
import { Logger } from "../utils/logger";
import { getExistingPosts, savePosts } from "../services/firestoreService";

const parser = new Parser({
  customFields: {
    feed: ["title", "description", "link", "language"],
    item: [
      "title",
      "link",
      "pubDate",
      "content",
      "contentSnippet",
      "creator",
      "author",
      "categories",
    ],
  },
});

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

export async function crawlRss(
  config: BlogConfig,
  compareWithFirebase: boolean = true
): Promise<Post[]> {
  try {
    Logger.info(`${config.name} RSS 크롤링 시작: ${config.rssUrl}`);

    // Firebase 비교 모드일 경우 기존 포스트 조회
    let existingPosts: Post[] = [];
    if (compareWithFirebase) {
      existingPosts = await getExistingPosts(config.name);
      Logger.info(`${config.name} 기존 포스트 수: ${existingPosts.length}`);
    }

    // 디버깅을 위한 요청 정보 출력
    Logger.info(`요청 헤더: ${JSON.stringify(headers, null, 2)}`);

    // axios로 RSS 피드 가져오기
    const response = await axios.get(config.rssUrl, { headers });
    Logger.info(`응답 상태 코드: ${response.status}`);
    Logger.info(`응답 헤더: ${JSON.stringify(response.headers, null, 2)}`);

    // RSS 파싱
    const feed = await parser.parseString(response.data);

    // 피드 정보 디버깅
    Logger.info(
      `피드 정보: ${JSON.stringify(
        {
          title: feed.title,
          description: feed.description,
          link: feed.link,
          language: feed.language,
          itemsCount: feed.items?.length,
        },
        null,
        2
      )}`
    );

    // 포스트 매핑
    const posts: Post[] = feed.items.map((item) => ({
      blogName: config.name,
      title: item.title || "",
      url: item.link || "",
      publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
      author: item.creator || item.author || undefined,
      summary: item.contentSnippet || item.content || undefined,
      tags: item.categories || undefined,
    }));

    // Firebase 비교 모드일 경우 새로운 포스트만 필터링
    const newPosts = compareWithFirebase
      ? posts.filter(
          (post) =>
            !existingPosts.some((existingPost) => existingPost.url === post.url)
        )
      : posts;

    // 새로운 포스트가 있는 경우에만 저장
    if (compareWithFirebase && newPosts.length > 0) {
      Logger.info(
        `${config.name} 새로운 포스트 ${newPosts.length}개 저장 시작`
      );
      await savePosts(newPosts);
      Logger.info(`${config.name} 새로운 포스트 저장 완료`);
    } else if (compareWithFirebase) {
      Logger.info(`${config.name} 새로운 포스트 없음`);
    }

    Logger.info(
      `${config.name} RSS 크롤링 완료: ${newPosts.length}개의 ${
        compareWithFirebase ? "새로운" : ""
      } 게시글 발견`
    );
    return newPosts;
  } catch (error) {
    Logger.error(`${config.name} RSS 크롤링 중 오류 발생:`, error);
    if (axios.isAxiosError(error)) {
      Logger.error(`응답 상태: ${error.response?.status}`);
      Logger.error(
        `응답 헤더: ${JSON.stringify(error.response?.headers, null, 2)}`
      );
      Logger.error(`응답 데이터: ${error.response?.data}`);
    }
    throw error;
  }
}
