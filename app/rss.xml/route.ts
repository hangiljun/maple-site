import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.maplestoryitem.com';
const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

export const revalidate = 3600;

interface DocItem {
  id: string;
  title: string;
  content: string;
  pubDate: Date;
}

async function getRecentDocs(collection: string, limit = 10): Promise<DocItem[]> {
  try {
    const res = await fetch(
      `${FS_BASE}/${collection}?pageSize=${limit}&orderBy=createdAt%20desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map((doc: any) => {
      const id = (doc.name as string).split('/').pop() as string;
      const ts = doc.fields?.createdAt?.timestampValue;
      return {
        id,
        title: doc.fields?.title?.stringValue || '',
        content: doc.fields?.content?.stringValue || '',
        pubDate: ts ? new Date(ts) : new Date(),
      };
    });
  } catch {
    return [];
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim().slice(0, 300);
}

export async function GET() {
  const [notices, reviews, howtos] = await Promise.all([
    getRecentDocs('notices', 10),
    getRecentDocs('reviews', 10),
    getRecentDocs('howto', 10),
  ]);

  const allItems = [
    ...notices.map(d => ({ ...d, path: 'notice', label: '공지사항' })),
    ...reviews.map(d => ({ ...d, path: 'review', label: '이용후기' })),
    ...howtos.map(d => ({ ...d, path: 'howto', label: '거래방법' })),
  ]
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 30);

  const items = allItems
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${BASE_URL}/${item.path}/${item.id}</link>
      <description>${escapeXml(stripHtml(item.content))}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/${item.path}/${item.id}</guid>
      <category>${escapeXml(item.label)}</category>
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>메이플 아이템 - 메이플급처 &amp; 메이플스토리 아이템</title>
    <link>${BASE_URL}</link>
    <description>메이플급처, 메이플스토리 아이템 전 서버 최고가 매입. 공지사항, 이용후기, 거래방법 최신 글.</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
