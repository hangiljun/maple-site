import './globals.css';
import KakaoChatButton from './components/KakaoChatButton';
import { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.maplestoryitem.com'),
  title: {
    template: '%s | 메이플 아이템',
    default: '메이플급처 & 메이플스토리 아이템 - 전 서버 최고가 매입 및 시세 비교',
  },
  description: '메이플급처, 메이플스토리 급처템, 메소, 아이템 전 서버 최고가 매입. 24시간 상담 및 검증된 업체 리스트를 통해 안전하게 메이플급처 거래하세요.',
  keywords: '메이플급처, 메이플스토리급처, 메이플 급처, 메이플스토리, 메이플, 메이플스토리 급처, 급처템, 아이템 매입, 메소 거래, 메이플 시세, 메이플 장사, 전서버 매입, 아이템 거래',

  alternates: {
    canonical: 'https://www.maplestoryitem.com',
    types: {
      'application/rss+xml': 'https://www.maplestoryitem.com/rss.xml',
    },
  },

  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title: '메이플급처 & 메이플스토리 아이템 - 전 서버 최고가 매입',
    description: '메이플급처, 안전한 업체 검증, 실시간 시세 확인, 24시간 즉시 거래.',
    url: 'https://www.maplestoryitem.com',
    siteName: '메이플 아이템',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '메이플스토리 급처템 최고가 매입 - 메이플 아이템',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: '메이플급처 & 메이플스토리 아이템 - 전 서버 최고가 매입',
    description: '메이플급처, 안전한 업체 검증, 실시간 시세 확인, 24시간 즉시 거래.',
    images: ['/og-image.png'],
  },

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
      </head>
      <body className={notoSansKr.className}>
        {children}
        <KakaoChatButton />
      </body>
    </html>
  );
}