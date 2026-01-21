import './globals.css';
import KakaoChatButton from './components/KakaoChatButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '메이플 아이템 - 최고가 매입 업체 비교',
  description: '검증된 매입 업체들을 한눈에 비교하고 안전하게 거래하세요.',
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
      </head>
      <body style={{ margin: 0 }}>
        {children}
        <KakaoChatButton />
      </body>
    </html>
  );
}