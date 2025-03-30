// src/services/firestoreService.ts
import { Post } from "../models/post";
import { initializeFirebase } from "../config/firebase";

const db = initializeFirebase();

export async function getExistingPosts(blogName: string): Promise<Post[]> {
  try {
    const snapshot = await db
      .collection("posts")
      .where("blogName", "==", blogName)
      .get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      publishedDate: doc.data().publishedDate.toDate(),
    })) as Post[];
  } catch (error) {
    console.error("기존 포스트 조회 중 오류 발생:", error);
    return [];
  }
}

export async function savePosts(posts: Post[]): Promise<void> {
  try {
    const batch = db.batch();
    posts.forEach((post) => {
      const docRef = db.collection("posts").doc();
      batch.set(docRef, post);
    });
    await batch.commit();
    console.log(`${posts.length}개의 포스트 저장 완료`);
  } catch (error) {
    console.error("포스트 저장 중 오류 발생:", error);
    throw error;
  }
}
