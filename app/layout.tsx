import './globals.css';
import KakaoChatButton from './components/KakaoChatButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '메이플 아이템 - 전 서버 최고가 매입 및 실시간 시세 비교',
  description: '메이플스토리 아이템, 메소, 급처템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 거래하세요.',
  keywords: '메이플 급처템, 메이플 아이템, 메이플 메소, 메이플 거래, 메이플 최고가 매입, 메이플스토리 시세, 메이플 템값, 아이템 거래 사이트',
  
  // ★ 1. 구글/네이버/브라우저 탭에 뜰 로고 설정 (public/logo.png 사용)
  icons: {
    icon: '/logo.png',
    apple: '/logo.png', // 아이폰 바탕화면 추가 시 아이콘
  },

  // ★ 2. 카카오톡/문자 공유 시 뜰 미리보기 설정 (오픈 그래프)
  openGraph: {
    title: '메이플 아이템 - 전 서버 최고가 매입',
    description: '안전한 업체 검증, 실시간 시세 확인, 24시간 즉시 거래.',
    url: 'https://www.maplestoryitem.com',
    siteName: '메이플 아이템',
    images: [
      {
        url: '/logo.png', // 공유 시 로고 이미지가 크게 뜸
        width: 800,
        height: 600,
        alt: '메이플 아이템 공식 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // 3. 소유권 확인 (기존 유지)
  verification: {
    google: 'eDPRCa4UVhEx5Fpyv0ExIXkhPfCgee206siYNLoE6vc',
    other: { 'naver-site-verification': '566edcb6849fbcd5fee7fad38c053720020e5052' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/> 
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://www.maplestoryitem.com" />
      </head>
      <body>
        {children}
        <KakaoChatButton />
      </body>
    </html>
  );
}