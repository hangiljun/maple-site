import { Metadata } from 'next';
import { getCollectionDocs } from '@/lib/firestore-rest';
import NoticeListClient from './NoticeListClient';

export const revalidate = 300; // ISR: 5분마다 재생성

export const metadata: Metadata = {
  title: '공지사항',
  description: '메이플 아이템 공지사항, 새로운 소식과 이벤트를 확인하세요. 메이플스토리 급처 관련 최신 정보를 제공합니다.',
  alternates: {
    canonical: 'https://www.maplestoryitem.com/notice',
  },
  openGraph: {
    title: '공지사항 - 메이플 아이템',
    description: '메이플 아이템 공지사항, 새로운 소식과 이벤트를 확인하세요.',
    url: 'https://www.maplestoryitem.com/notice',
  },
};

export default async function NoticePage() {
  // Fetch initial data on the server
  const [noticesDocs, bannersDocs] = await Promise.all([
    getCollectionDocs('notices', { orderBy: 'createdAt desc' }),
    getCollectionDocs('banners', { orderBy: 'createdAt desc', limit: 50 }),
  ]);

  // Transform notices (convert to serializable)
  const initialNotices = noticesDocs.map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    category: doc.category || '',
    isPinned: doc.isPinned || false,
    imageUrl: doc.imageUrl || '',
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  // Sort pinned first
  initialNotices.sort((a, b) => {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });

  // Find notice banner
  const initialBanner = bannersDocs.find(b => b.type === '공지사항') || null;
  const banner = initialBanner ? {
    id: initialBanner.id,
    imageUrl: initialBanner.imageUrl || '',
    type: initialBanner.type || '',
    createdAt: initialBanner.createdAt ? initialBanner.createdAt.toDate().toISOString() : new Date().toISOString(),
  } : null;

  return <NoticeListClient initialNotices={initialNotices} initialBanner={banner} />;
}
