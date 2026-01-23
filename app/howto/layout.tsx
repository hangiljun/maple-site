import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '거래 방법 및 주의사항 - 메이플 아이템',
  description: '안전한 메이플 아이템, 메소 거래 절차와 필독 주의사항을 안내해 드립니다.',
};

export default function HowtoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}