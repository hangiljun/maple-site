import './globals.css';
// 빨간 줄 해결 포인트: ./components/... 경로를 다시 한번 확인하세요.
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
        {/* 모든 페이지의 본문 내용 */}
        {children}
        
        {/* 모든 페이지에 따라다니는 카톡 버튼 */}
        <KakaoChatButton />
      </body>
    </html>
  );
}