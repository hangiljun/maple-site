import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.maplestoryitem.com';
const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

export const revalidate = 3600;

async function getCollectionDocs(collection: string): Promise<{ id: string; lastModified: Date }[]> {
  try {
    const res = await fetch(`${FS_BASE}/${collection}?pageSize=200&orderBy=createdAt%20desc`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map((doc: any) => {
      const id = (doc.name as string).split('/').pop() as string;
      const ts = doc.fields?.createdAt?.timestampValue;
      return { id, lastModified: ts ? new Date(ts) : new Date() };
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                    lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${BASE_URL}/notice`,        lastModified: new Date(), changeFrequency: 'daily',  priority: 0.8 },
    { url: `${BASE_URL}/howto`,         lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/review`,        lastModified: new Date(), changeFrequency: 'daily',  priority: 0.8 },
  ];

  const [noticeDocs, howtoDocs, reviewDocs] = await Promise.all([
    getCollectionDocs('notices'),
    getCollectionDocs('howto'),
    getCollectionDocs('reviews'),
  ]);

  const noticePages: MetadataRoute.Sitemap = noticeDocs.map(({ id, lastModified }) => ({
    url: `${BASE_URL}/notice/${id}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const howtoPages: MetadataRoute.Sitemap = howtoDocs.map(({ id, lastModified }) => ({
    url: `${BASE_URL}/howto/${id}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const reviewPages: MetadataRoute.Sitemap = reviewDocs.map(({ id, lastModified }) => ({
    url: `${BASE_URL}/review/${id}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...noticePages, ...howtoPages, ...reviewPages];
}
