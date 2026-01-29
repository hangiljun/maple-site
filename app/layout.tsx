import './globals.css';
import KakaoChatButton from './components/KakaoChatButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  // ★ [수정 포인트] 제목 맨 앞에 '메이플스토리' 풀네임을 넣었습니다. (검색 노출 최적화)
  title: '메이플스토리 아이템 & 급처템 - 전 서버 최고가 매입 및 시세 비교',
  
  // 설명은 아주 좋습니다.
  description: '메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 급처 거래하세요.',
  
  // 키워드도 욕심부리지 않고 딱 핵심만 잘 남기셨습니다. (100점)
  keywords: '메이플스토리, 메이플, 메이플 급처, 메이플스토리 급처, 급처템, 아이템 매입, 메소 거래, 메이플 시세, 메이플 장사, 전서버 매입, 아이템 거래',
  
  // 1. 로고 설정
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },

  // 2. 카카오톡/SNS 공유 미리보기
  openGraph: {
    // 공유될 때 보이는 제목도 '메이플스토리'로 통일했습니다.
    title: '메이플스토리 아이템 & 급처템 - 전 서버 최고가 매입',
    description: '안전한 업체 검증, 실시간 시세 확인, 24시간 즉시 거래.',
    url: 'https://www.maplestoryitem.com',
    siteName: '메이플 아이템',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: '메이플 급처템 매입 공식 로고',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // 3. 소유권 확인 (이 코드가 있어야 네이버/구글이 주인임을 알아봅니다)
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