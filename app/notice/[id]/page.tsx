import { Metadata } from 'next';
import NoticeDetailClient from './NoticeDetailClient';

const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

async function getNotice(id: string) {
  try {
    const res = await fetch(`${FS_BASE}/notices/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data.fields || {};

    // createdAt을 Date 문자열로 변환
    let createdAtString = '';
    if (f.createdAt?.timestampValue) {
      const date = new Date(f.createdAt.timestampValue);
      createdAtString = date.toLocaleDateString('ko-KR');
    }

    return {
      title: f.title?.stringValue || '',
      content: f.content?.stringValue || '',
      category: f.category?.stringValue || '',
      imageUrl: f.imageUrl?.stringValue || '',
      createdAt: createdAtString,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const notice = await getNotice(id);
  if (!notice) {
    return { title: '공지사항 - 메이플 아이템' };
  }
  const description = notice.content.replace(/<[^>]+>/g, '').slice(0, 120);
  return {
    title: `${notice.title} - 공지사항`,
    description: description || '메이플 아이템 공지사항입니다.',
    alternates: {
      canonical: `https://www.maplestoryitem.com/notice/${id}`,
    },
    openGraph: {
      title: notice.title,
      description: description,
      url: `https://www.maplestoryitem.com/notice/${id}`,
      ...(notice.imageUrl && {
        images: [{ url: notice.imageUrl, alt: notice.title }],
      }),
    },
  };
}

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notice = await getNotice(id);
  return <NoticeDetailClient id={id} initialNotice={notice} />;
}
