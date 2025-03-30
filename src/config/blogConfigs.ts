// src/config/blogConfigs.ts
export interface BlogConfig {
  name: string;
  rssUrl: string;
}

export const blogConfigs: BlogConfig[] = [
  { name: "네이버 D2", rssUrl: "https://d2.naver.com/d2.atom" },
  { name: "카카오 기술블로그", rssUrl: "https://tech.kakao.com/feed/" },
  {
    name: "LINE Engineering",
    rssUrl: "https://engineering.linecorp.com/ko/feed/index.html",
  },
  { name: "쿠팡 기술블로그", rssUrl: "https://medium.com/feed/coupang-tech" },
  { name: "당근마켓 기술블로그", rssUrl: "https://medium.com/feed/daangn" },
  {
    name: "우아한형제들 기술블로그",
    rssUrl: "https://techblog.woowahan.com/feed/",
  },
  { name: "토스 기술블로그", rssUrl: "https://toss.tech/rss.xml" },
  { name: "직방 기술블로그", rssUrl: "https://medium.com/feed/zigbang" },
  {
    name: "야놀자 기술블로그",
    rssUrl: "https://medium.com/feed/yanoljacloud-tech",
  },
];
