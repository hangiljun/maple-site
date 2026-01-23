import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '실시간 거래 이용후기 - 메이플 아이템',
  description: '메이플 아이템과 메소 거래를 완료한 실제 유저들의 생생한 후기를 확인하세요.',
};

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}