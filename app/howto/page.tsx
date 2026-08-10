import { Metadata } from 'next';
import { getCollectionDocs } from '@/lib/firestore-rest';
import HowtoListClient from './HowtoListClient';

export const revalidate = 300; // ISR: 5분마다 재생성

export const metadata: Metadata = {
  title: '거래방법',
  description: '메이플 아이템 거래방법, 안전하고 투명한 거래 가이드를 확인하세요. 메이플스토리 급처 거래 절차와 주의사항을 안내합니다.',
  alternates: {
    canonical: 'https://www.maplestoryitem.com/howto',
  },
  openGraph: {
    title: '거래방법 - 메이플 아이템',
    description: '안전하고 투명한 거래 가이드를 확인하세요.',
    url: 'https://www.maplestoryitem.com/howto',
  },
};

export default async function HowtoPage() {
  const [howtosDocs, bannersDocs] = await Promise.all([
    getCollectionDocs('howto', { orderBy: 'createdAt desc' }),
    getCollectionDocs('banners', { orderBy: 'createdAt desc', limit: 50 }),
  ]);

  const initialHowtos = howtosDocs.map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    category: doc.category || '',
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  const initialBanner = bannersDocs.find(b => b.type === '거래방법') || null;
  const banner = initialBanner ? {
    id: initialBanner.id,
    imageUrl: initialBanner.imageUrl || '',
    type: initialBanner.type || '',
    createdAt: initialBanner.createdAt ? initialBanner.createdAt.toDate().toISOString() : new Date().toISOString(),
  } : null;

  return <HowtoListClient initialHowtos={initialHowtos} initialBanner={banner} />;
}
