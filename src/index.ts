// src/index.ts
import * as functions from "firebase-functions";
import { handler as crawlerHandler } from "./handlers/crawlerHandler";
import { Logger } from "./utils/logger";

// 매 정각마다 크롤링 작업을 실행 (cron 표현식은 필요에 따라 조정)
export const scheduledCrawl = functions.pubsub
  .schedule("0 * * * *")
  .timeZone("Asia/Seoul") // 타임존 설정 (필요한 경우)
  .onRun(async (context) => {
    Logger.info("Cloud Functions 스케줄러: 크롤링 작업 시작");
    try {
      await crawlerHandler();
      Logger.info("Cloud Functions 스케줄러: 크롤링 작업 완료");
    } catch (error) {
      Logger.error("Cloud Functions 스케줄러: 크롤링 작업 중 오류 발생", error);
    }
    return null;
  });
