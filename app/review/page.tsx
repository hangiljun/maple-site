import { Metadata } from 'next';
import { getCollectionDocs } from '@/lib/firestore-rest';
import ReviewListClient from './ReviewListClient';

export const revalidate = 300; // ISR: 5분마다 재생성

export const metadata: Metadata = {
  title: '이용후기',
  description: '메이플 아이템 이용후기, 고객님들의 실제 거래 후기를 확인하세요. 메이플스토리 급처 거래 경험담과 평가를 제공합니다.',
  alternates: {
    canonical: 'https://www.maplestoryitem.com/review',
  },
  openGraph: {
    title: '이용후기 - 메이플 아이템',
    description: '고객님들의 실제 거래 후기를 확인하세요.',
    url: 'https://www.maplestoryitem.com/review',
  },
};

export default async function ReviewPage() {
  const [reviewsDocs, bannersDocs] = await Promise.all([
    getCollectionDocs('reviews', { orderBy: 'createdAt desc' }),
    getCollectionDocs('banners', { orderBy: 'createdAt desc', limit: 50 }),
  ]);

  const initialReviews = reviewsDocs.map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    nickname: doc.nickname || '',
    imageUrl: doc.imageUrl || '',
    views: doc.views || 0,
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  const initialBanner = bannersDocs.find(b => b.type === '이용후기') || null;
  const banner = initialBanner ? {
    id: initialBanner.id,
    imageUrl: initialBanner.imageUrl || '',
    type: initialBanner.type || '',
    createdAt: initialBanner.createdAt ? initialBanner.createdAt.toDate().toISOString() : new Date().toISOString(),
  } : null;

  return <ReviewListClient initialReviews={initialReviews} initialBanner={banner} />;
}
