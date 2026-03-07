import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.maplestoryitem.com';
const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

async function getCollectionIds(collection: string): Promise<string[]> {
  try {
    const res = await fetch(`${FS_BASE}/${collection}?pageSize=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents) return [];
    return data.documents.map((doc: { name: string }) =>
      doc.name.split('/').pop() as string
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/notice`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/howto`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/review`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  const [noticeIds, howtoIds, reviewIds] = await Promise.all([
    getCollectionIds('notices'),
    getCollectionIds('howto'),
    getCollectionIds('reviews'),
  ]);

  const noticePages: MetadataRoute.Sitemap = noticeIds.map((id) => ({
    url: `${BASE_URL}/notice/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const howtoPages: MetadataRoute.Sitemap = howtoIds.map((id) => ({
    url: `${BASE_URL}/howto/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const reviewPages: MetadataRoute.Sitemap = reviewIds.map((id) => ({
    url: `${BASE_URL}/review/${id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...noticePages, ...howtoPages, ...reviewPages];
}
