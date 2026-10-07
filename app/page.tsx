import { getCollectionDocs, getDocument } from '@/lib/firestore-rest';
import HomeClient from './HomeClient';
import { selectPinnedNotices } from '@/lib/pinned-notices';

export const revalidate = 300; // ISR: 5분마다 재생성

export default async function Home() {
  // Fetch initial data on the server
  const [itemsDocs, reviewsDocs, noticesDocs, bannerDoc, configDoc] = await Promise.all([
    getCollectionDocs('items', { orderBy: 'createdAt desc' }),
    getCollectionDocs('reviews', { orderBy: 'createdAt desc', limit: 10 }),
    getCollectionDocs('notices', { pinnedOnly: true }),
    getDocument('banners', 'home_main'),
    getDocument('site_config', 'main'),
  ]);

  // Generate server-side date string to avoid hydration mismatch
  const now = new Date();
  const initialToday = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;

  // Transform to match client types (convert Timestamp to ISO string for serialization)
  const initialItems: any[] = itemsDocs.map(doc => ({
    id: doc.id,
    name: doc.name || '',
    desc: doc.desc || '',
    price: doc.price || '',
    imageUrl: doc.imageUrl || '',
    kakaoUrl: doc.kakaoUrl || '',
    isPremium: doc.isPremium || false,
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  const initialReviews: any[] = reviewsDocs.map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    author: doc.author || '',
    nickname: doc.nickname || '',
    password: doc.password || '',
    views: doc.views || 0,
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  const initialNotices: any[] = selectPinnedNotices(noticesDocs).map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    category: doc.category || '',
    content_raw: doc.content_raw || '',
    isPinned: doc.isPinned || false,
    imageUrl: doc.imageUrl || '',
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  const initialBanner: any = bannerDoc ? {
    imageUrl: bannerDoc.imageUrl || '',
    kakaoUrl: bannerDoc.kakaoUrl || '',
    type: bannerDoc.type || '',
    createdAt: bannerDoc.createdAt ? bannerDoc.createdAt.toDate().toISOString() : new Date().toISOString(),
  } : null;

  const initialStatusMessages = configDoc?.statusMessages || [];
  const initialQna = configDoc?.qna || [];

  return (
    <HomeClient
      initialItems={initialItems}
      initialReviews={initialReviews}
      initialNotices={initialNotices}
      initialBanner={initialBanner}
      initialStatusMessages={initialStatusMessages}
      initialQna={initialQna}
      initialToday={initialToday}
    />
  );
}
