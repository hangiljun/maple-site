import './globals.css';
import KakaoChatButton from './components/KakaoChatButton';

export const metadata = {
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
        {/* 구글 폰트 Noto Sans KR 완벽 유지 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        {/* 기존 페이지 콘텐츠 출력 */}
        {children}
        
        {/* 화면 우측 하단 고정 카카오톡 상담 버튼 */}
        <KakaoChatButton />
      </body>
    </html>
  );
}