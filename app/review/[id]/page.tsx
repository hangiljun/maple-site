import { Metadata } from 'next';
import ReviewDetailClient from './ReviewDetailClient';

const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

async function getReview(id: string) {
  try {
    const res = await fetch(`${FS_BASE}/reviews/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields || {};
    return {
      title: f.title?.stringValue || '',
      content: f.content?.stringValue || '',
      nickname: f.nickname?.stringValue || '',
      imageUrl: f.imageUrl?.stringValue || '',
    };
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const review = await getReview(id);
  if (!review) {
    return { title: '이용후기 - 메이플 아이템' };
  }
  const description = review.content.slice(0, 120);
  return {
    title: `${review.title} - 이용후기`,
    description: description || '메이플 아이템 실제 거래 후기입니다.',
    alternates: {
      canonical: `https://www.maplestoryitem.com/review/${id}`,
    },
    openGraph: {
      title: review.title,
      description: description,
      url: `https://www.maplestoryitem.com/review/${id}`,
      ...(review.imageUrl && {
        images: [{ url: review.imageUrl, alt: review.title }],
      }),
    },
  };
}

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewDetailClient id={id} />;
}
