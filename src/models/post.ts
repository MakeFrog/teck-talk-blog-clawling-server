// src/models/post.ts
export interface Post {
  blogName: string;
  title: string;
  url: string;
  publishedDate: Date;
  author?: string;
  summary?: string;
  tags?: string[];
}
