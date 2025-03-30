import { blogConfigs } from "./config/blogConfigs";
import { crawlBlog } from "./crawlers";
import { Logger } from "./utils/logger";
import { initializeFirebase } from "./config/firebase";

async function testCrawling(compareWithFirebase: boolean = true) {
  try {
    if (compareWithFirebase) {
      // Firebase 초기화
      Logger.info("Firebase 초기화 중...");
      initializeFirebase();
      Logger.info("Firebase 초기화 완료");
      Logger.info("최신 게시물만 크롤링 모드로 시작");
    } else {
      Logger.info("전체 게시물 크롤링 모드로 시작");
    }

    Logger.info("크롤링 테스트 시작");

    // for...of를 사용하여 순차적으로 처리
    for (const blog of blogConfigs) {
      try {
        Logger.info(`\n=== ${blog.name} 테스트 시작 ===`);

        const posts = await crawlBlog(blog, compareWithFirebase);

        // 결과 출력
        console.log(`\n=== ${blog.name} 크롤링 결과 ===`);
        console.log(`크롤링된 게시물 수: ${posts.length}`);

        if (posts.length > 0) {
          posts.forEach((post, index) => {
            console.log(`\n[${index + 1}] ${post.blogName}`);
            console.log(`제목: ${post.title}`);
            console.log(`URL: ${post.url}`);
            console.log(`발행일: ${post.publishedDate}`);
            if (post.author) console.log(`작성자: ${post.author}`);
            if (post.summary)
              console.log(`요약: ${post.summary.substring(0, 100)}...`);
            if (post.tags) console.log(`태그: ${post.tags.join(", ")}`);
          });
        } else {
          console.log("크롤링된 게시물이 없습니다.");
        }

        Logger.info(`=== ${blog.name} 테스트 완료 ===\n`);
      } catch (error) {
        Logger.error(`${blog.name} 크롤링 중 오류 발생:`, error);
      }
    }

    Logger.info("모든 블로그 크롤링 테스트 완료");
  } catch (error) {
    Logger.error("크롤링 테스트 중 오류 발생:", error);
  }
}

// 명령줄 인자 처리
const args = process.argv.slice(2);
const compareWithFirebase = !args.includes("--all");

// 스크립트 실행
testCrawling(compareWithFirebase).catch((error) => {
  Logger.error("테스트 실행 중 오류 발생:", error);
  process.exit(1);
});
