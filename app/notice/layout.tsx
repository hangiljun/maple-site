import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '공지사항 - 메이플 아이템',
  description: '메이플스토리 아이템 매입 관련 중요 공지사항과 이벤트 소식을 확인하세요.',
};

export default function NoticeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}