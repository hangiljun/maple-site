import { Metadata } from 'next';
import HowtoDetailClient from './HowtoDetailClient';

const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

async function getHowto(id: string) {
  try {
    const res = await fetch(`${FS_BASE}/howto/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields || {};
    return {
      title: f.title?.stringValue || '',
      content: f.content?.stringValue || '',
      category: f.category?.stringValue || '',
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
  const howto = await getHowto(id);
  if (!howto) {
    return { title: '거래 방법 - 메이플 아이템' };
  }
  const description = howto.content.replace(/<[^>]+>/g, '').slice(0, 120);
  return {
    title: `${howto.title} - 거래방법`,
    description: description || '메이플 아이템 거래 방법 및 주의사항입니다.',
    alternates: {
      canonical: `https://www.maplestoryitem.com/howto/${id}`,
    },
    openGraph: {
      title: howto.title,
      description: description,
      url: `https://www.maplestoryitem.com/howto/${id}`,
      ...(howto.imageUrl && {
        images: [{ url: howto.imageUrl, alt: howto.title }],
      }),
    },
  };
}

export default async function HowtoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HowtoDetailClient id={id} />;
}
