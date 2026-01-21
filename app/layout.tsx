import './globals.css';
import KakaoChatButton from './components/KakaoChatButton';
import { Metadata } from 'next';

// 구글, 네이버, 엣지 검색 로봇이 읽어가는 사이트 정보입니다.
export const metadata: Metadata = {
  title: '메이플 아이템 - 전 서버 최고가 매입 및 실시간 시세 비교',
  description: '메이플스토리 아이템, 메소, 급처템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 거래하세요.',
  // 사용자님 요청 키워드 반영
  keywords: '메이플 급처템, 메이플 아이템, 메이플 메소, 메이플 거래, 메이플 최고가 매입, 메이플스토리 시세, 메이플 템값, 아이템 거래 사이트',
  openGraph: {
    title: '메이플 아이템 - 전 서버 최고가 매입 및 시세 비교',
    description: '검증된 매입 업체들을 한눈에 비교하고 안전하게 거래하세요.',
    url: 'https://www.maplestoryitem.com',
    siteName: '메이플 아이템',
    images: [
      {
        url: '/logo.png', 
        width: 800,
        height: 600,
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    // 포털 사이트 등록 후 받은 인증코드를 나중에 여기에 넣으시면 됩니다.
    google: 'google_verification_code',
    other: {
      'naver-site-verification': 'naver_verification_code',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        {/* 표준 URL 설정: 검색 엔진 최적화의 필수 요소입니다. */}
        <link rel="canonical" href="https://www.maplestoryitem.com" />
      </head>
      <body style={{ margin: 0 }}>
        {children}
        {/* 모든 페이지 우측 하단 고정 카카오톡 버튼 */}
        <KakaoChatButton />
      </body>
    </html>
  );
}