import { getCollectionDocs, getDocument } from '@/lib/firestore-rest';
import { Item, Review, Notice, Howto, Banner } from '@/types';
import HomeClient from './HomeClient';

export const revalidate = 300; // ISR: 5분마다 재생성

export default async function Home() {
  // Fetch initial data on the server
  const [itemsDocs, reviewsDocs, noticesDocs, howtoDocs, bannerDoc, configDoc] = await Promise.all([
    getCollectionDocs('items', { orderBy: 'createdAt desc' }),
    getCollectionDocs('reviews', { orderBy: 'createdAt desc', limit: 10 }),
    getCollectionDocs('notices', { orderBy: 'createdAt desc', limit: 3 }),
    getCollectionDocs('howto', { orderBy: 'createdAt desc', limit: 3 }),
    getDocument('banners', 'home_main'),
    getDocument('site_config', 'main'),
  ]);

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

  const initialNotices: any[] = noticesDocs.map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    category: doc.category || '',
    isPinned: doc.isPinned || false,
    imageUrl: doc.imageUrl || '',
    createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : new Date().toISOString(),
  }));

  const initialHowto: any[] = howtoDocs.map(doc => ({
    id: doc.id,
    title: doc.title || '',
    content: doc.content || '',
    category: doc.category || '',
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
      initialHowto={initialHowto}
      initialBanner={initialBanner}
      initialStatusMessages={initialStatusMessages}
      initialQna={initialQna}
    />
  );
}
