import './globals.css';
// 에러 해결: 현재 위치(app)에서 components 폴더를 찾아가도록 경로 수정
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
        {/* Noto Sans KR 폰트 및 스타일 완벽 유지 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        {/* 각 페이지 내용 출력 */}
        {children}
        
        {/* 모든 페이지 우측 하단 고정 카톡 버튼 */}
        <KakaoChatButton />
      </body>
    </html>
  );
}