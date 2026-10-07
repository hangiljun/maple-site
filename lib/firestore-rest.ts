// Firestore REST API utilities for server-side data fetching
// Extracted from sitemap.ts to share across server components

const FIREBASE_PROJECT = 'maple-trading-admin';
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

export interface FirestoreDocument {
  id: string;
  isPinned?: boolean;
  createdAt?: { toDate: () => Date };
  [key: string]: any;
}

/**
 * Fetch documents from a Firestore collection via REST API (server-side only)
 * @param collection - Collection name (e.g., 'notices', 'reviews')
 * @param options - Query options
 * @returns Array of documents with id and parsed fields
 */
export async function getCollectionDocs(
  collection: string,
  options: {
    orderBy?: string;
    limit?: number;
    revalidate?: number;
    pinnedOnly?: boolean;
  } = {}
): Promise<FirestoreDocument[]> {
  const { orderBy = 'createdAt desc', limit, revalidate = 300, pinnedOnly = false } = options;

  try {
    let url = `${FS_BASE}/${collection}`;
    const params = new URLSearchParams();

    if (limit) {
      params.append('pageSize', limit.toString());
    }
    if (orderBy) {
      params.append('orderBy', orderBy);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    // A single-field filter avoids a composite-index requirement. Sort pinned posts after parsing.
    const res = pinnedOnly
      ? await fetch(`${FS_BASE}:runQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ structuredQuery: {
            from: [{ collectionId: collection }],
            where: { fieldFilter: { field: { fieldPath: 'isPinned' }, op: 'EQUAL', value: { booleanValue: true } } },
          } }),
          next: { revalidate },
        })
      : await fetch(url, { next: { revalidate } });

    if (!res.ok) {
      console.error(`Failed to fetch ${collection}: ${res.status}`);
      return [];
    }

    const response = await res.json();
    const data = pinnedOnly
      ? { documents: response.flatMap((result: { document?: unknown }) => result.document ? [result.document] : []) }
      : response;
    if (!data.documents) return [];

    return data.documents.map((doc: any) => {
      const id = (doc.name as string).split('/').pop() as string;
      const fields = doc.fields || {};

      // Parse Firestore field types to plain values
      const parsed: FirestoreDocument = { id };

      for (const [key, value] of Object.entries(fields)) {
        const val = value as any;

        if (val.stringValue !== undefined) {
          parsed[key] = val.stringValue;
        } else if (val.integerValue !== undefined) {
          parsed[key] = parseInt(val.integerValue);
        } else if (val.doubleValue !== undefined) {
          parsed[key] = val.doubleValue;
        } else if (val.booleanValue !== undefined) {
          parsed[key] = val.booleanValue;
        } else if (val.timestampValue !== undefined) {
          parsed[key] = { toDate: () => new Date(val.timestampValue) };
        } else if (val.arrayValue?.values) {
          parsed[key] = val.arrayValue.values.map((v: any) => {
            if (v.stringValue !== undefined) return v.stringValue;
            if (v.integerValue !== undefined) return parseInt(v.integerValue);
            if (v.mapValue?.fields) {
              const obj: any = {};
              for (const [k, mapVal] of Object.entries(v.mapValue.fields)) {
                const mv = mapVal as any;
                if (mv.stringValue !== undefined) obj[k] = mv.stringValue;
                if (mv.integerValue !== undefined) obj[k] = parseInt(mv.integerValue);
                if (mv.booleanValue !== undefined) obj[k] = mv.booleanValue;
              }
              return obj;
            }
            return v;
          });
        } else if (val.mapValue?.fields) {
          const obj: any = {};
          for (const [k, mapVal] of Object.entries(val.mapValue.fields)) {
            const mv = mapVal as any;
            if (mv.stringValue !== undefined) obj[k] = mv.stringValue;
            if (mv.integerValue !== undefined) obj[k] = parseInt(mv.integerValue);
            if (mv.booleanValue !== undefined) obj[k] = mv.booleanValue;
          }
          parsed[key] = obj;
        }
      }

      return parsed;
    });
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return [];
  }
}

/**
 * Fetch a single document by ID via REST API
 */
export async function getDocument(
  collection: string,
  id: string,
  revalidate = 300
): Promise<FirestoreDocument | null> {
  try {
    const res = await fetch(`${FS_BASE}/${collection}/${id}`, {
      next: { revalidate },
      cache: revalidate === 0 ? 'no-store' : undefined,
    });

    if (!res.ok) return null;

    const doc = await res.json();
    const fields = doc.fields || {};

    const parsed: FirestoreDocument = { id };

    for (const [key, value] of Object.entries(fields)) {
      const val = value as any;

      if (val.stringValue !== undefined) {
        parsed[key] = val.stringValue;
      } else if (val.timestampValue !== undefined) {
        parsed[key] = { toDate: () => new Date(val.timestampValue) };
      } else if (val.booleanValue !== undefined) {
        parsed[key] = val.booleanValue;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}
