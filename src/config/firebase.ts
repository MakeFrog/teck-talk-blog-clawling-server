import * as admin from "firebase-admin";

export function initializeFirebase() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: "blog-crawling-server", // 프로젝트 ID를 여기에 입력
      });
    } catch (error) {
      console.error("Firebase 초기화 중 오류 발생:", error);
    }
  }
  return admin.firestore();
}
