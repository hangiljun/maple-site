import { Timestamp } from 'firebase/firestore';

// 리뷰 타입
export interface Review {
  id: string;
  title: string;
  content: string;
  content_raw?: string;
  nickname: string;
  author?: string; // 폴백용 (구 데이터)
  password: string;
  imageUrl?: string;
  createdAt: Timestamp;
  views: number;
  likes?: number;
}

// 공지사항 타입
export interface Notice {
  id: string;
  title: string;
  content: string;
  content_raw?: string;
  category: '공지사항' | '메이플 패치' | '이벤트' | '시세측정 기준';
  isPinned?: boolean;
  imageUrl?: string;
  createdAt: Timestamp;
}

// 거래방법 타입
export interface Howto {
  id: string;
  title: string;
  content: string;
  content_raw?: string;
  category: '거래 방법' | '거래 주의 사항';
  imageUrl?: string;
  createdAt: Timestamp;
}

// 아이템/업체 타입
export interface Item {
  id: string;
  name: string;
  desc: string;
  price: string;
  kakaoUrl: string;
  imageUrl: string;
  isPremium: boolean;
  createdAt: Timestamp;
}

// 댓글 타입
export interface Comment {
  id: string;
  postId: string;
  nickname: string;
  password: string;
  content: string;
  createdAt: Timestamp;
}

// 배너 타입
export interface Banner {
  type: string;
  imageUrl: string;
  kakaoUrl?: string;
  createdAt: Timestamp;
}

// 사이트 설정 타입
export interface SiteConfig {
  statusMessages: string[];
  qna: Array<{
    question: string;
    answer: string;
  }>;
}
