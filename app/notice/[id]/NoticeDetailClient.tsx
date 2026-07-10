'use client';

import { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function NoticeDetailClient({ id, initialNotice }: { id: string; initialNotice: any }) {
  const [notice, setNotice] = useState<any>(initialNotice);
  const [loading, setLoading] = useState(!initialNotice);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 서버에서 받은 초기 데이터가 없을 때만 클라이언트에서 fetch
    if (!initialNotice) {
      const fetchNotice = async () => {
        try {
          setLoading(true);
          setError(null);
          const docRef = doc(db, 'notices', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setNotice(docSnap.data());
          } else {
            setError('존재하지 않는 공지사항입니다.');
          }
        } catch (err) {
          console.error('공지사항 로드 실패:', err);
          setError('공지사항을 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
      };
      fetchNotice();
    }
  }, [id, initialNotice]);

  const convertUrlsToLinks = (text: string) => {
    if (!text) return text;

    // HTML 태그를 임시로 보호
    const tags: string[] = [];
    let tagIndex = 0;

    // HTML 태그를 플레이스홀더로 치환
    const withPlaceholders = text.replace(/<[^>]+>/g, (tag) => {
      tags.push(tag);
      return `__HTML_TAG_${tagIndex++}__`;
    });

    // 일반 텍스트의 URL만 변환
    const urlPattern = /(https?:\/\/[^\s<>"]+)/g;
    const withLinks = withPlaceholders.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #FF9000; text-decoration: underline; word-break: break-all;">${url}</a>`;
    });

    // 플레이스홀더를 원래 HTML 태그로 복원
    return withLinks.replace(/__HTML_TAG_(\d+)__/g, (match, index) => {
      return tags[parseInt(index)];
    });
  };

  // 에러 상태
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#1E293B' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#EF4444' }}>오류 발생</h2>
        <p style={{ color: '#64748B', marginBottom: '30px' }}>{error}</p>
        <button
          onClick={() => router.push('/notice')}
          style={{ padding: '12px 24px', backgroundColor: '#FF9000', color: '#FFF', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 로딩 상태
  if (loading || !notice) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#64748B' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 구조화된 데이터 (JSON-LD) for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": notice.title,
    "datePublished": notice.createdAt || new Date().toISOString(),
    "dateModified": notice.createdAt || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "메이플 아이템"
    },
    "publisher": {
      "@type": "Organization",
      "name": "메이플 아이템",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.maplestoryitem.com/favicon-new.png"
      }
    },
    "description": notice.content.replace(/<[^>]+>/g, '').slice(0, 160),
    "articleSection": notice.category,
    ...(notice.imageUrl && {
      "image": notice.imageUrl
    })
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#1E293B' }}>
      {/* 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', borderBottom: '1px solid #E2E8F0', backgroundColor: 'rgba(255,255,255,0.95)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', flexShrink: 0 }} onClick={() => router.push('/')}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <img src="/favicon-new.png" alt="메이플 아이템 로고" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </div>
          <div style={{ fontWeight: '900', color: '#FF9000', fontSize: 'clamp(16px, 4vw, 20px)', whiteSpace: 'nowrap' }}>메이플 아이템</div>
        </div>
        <button onClick={() => router.back()} style={{ border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#64748B', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', fontSize: 'clamp(12px, 3vw, 14px)', whiteSpace: 'nowrap' }}>← 뒤로가기</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
        <span style={{ color: '#FF9000', fontWeight: 'bold', fontSize: '14px', backgroundColor: '#FFF3E0', padding: '4px 12px', borderRadius: '20px', border: '1px solid #FFD0A0' }}>{notice.category}</span>
        <h1 style={{ fontSize: '30px', margin: '20px 0 15px 0', fontWeight: 'bold', lineHeight: '1.4', color: '#1E293B' }}>{notice.title}</h1>

        <div style={{ paddingBottom: '20px', borderBottom: '1px solid #E2E8F0', marginBottom: '40px', color: '#94A3B8', fontSize: '14px' }}>
          {notice.createdAt || (notice.createdAt?.toDate && notice.createdAt.toDate().toLocaleDateString())}
        </div>

        {notice.imageUrl && (
          <div style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px', border: '1px solid #E2E8F0' }}>
            <img src={notice.imageUrl} style={{ width: '100%', display: 'block' }} alt={notice.title} />
          </div>
        )}

        <div
          style={{ fontSize: '17px', lineHeight: '1.9', color: '#334155' }}
          className="notice-content"
          dangerouslySetInnerHTML={{ __html: convertUrlsToLinks(notice.content) }}
        />

        <button
          onClick={() => router.push('/notice')}
          style={{ marginTop: '60px', width: '100%', padding: '15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#64748B', fontSize: '15px' }}
        >
          목록으로 돌아가기
        </button>
      </div>

      <style jsx global>{`
        .notice-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 20px 0;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
        }
        .notice-content video {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 20px 0;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #000;
        }
        .notice-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          overflow: hidden;
        }
        .notice-content p + table {
          margin-top: 16px;
        }
        .notice-content table + p {
          margin-top: 16px;
        }
        .notice-content thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .notice-content th {
          padding: 14px 16px;
          text-align: left;
          font-weight: 700;
          color: white;
          font-size: 15px;
          border: none;
        }
        .notice-content td {
          padding: 12px 16px;
          border-bottom: 1px solid #E2E8F0;
          font-size: 15px;
        }
        .notice-content tbody tr:last-child td {
          border-bottom: none;
        }
        .notice-content tbody tr:hover {
          background: #F8FAFC;
        }
      `}</style>
    </div>
  );
}
