'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BusinessLicensePage() {
  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#1E293B', fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* 네비게이션 */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 5%', backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #E2E8F0', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '10px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
            <Image src="/favicon-new.png" alt="메이플 아이템 최고가 매입 로고" width={30} height={30} style={{ objectFit: 'contain' }} priority />
          </div>
          <div style={{ fontSize: '20px', fontWeight: '900', color: '#FF9000', letterSpacing: '-0.5px' }}>메이플 아이템</div>
        </Link>
        <div style={{ display: 'flex', gap: '20px', fontSize: '15px', fontWeight: '600', color: '#64748B' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>홈</span></Link>
          <Link href="/notice" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>공지사항</span></Link>
          <Link href="/howto" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>거래방법</span></Link>
          <Link href="/review" style={{ textDecoration: 'none', color: '#64748B' }}><span style={{ cursor: 'pointer' }}>이용후기</span></Link>
        </div>
      </nav>

      {/* 사업자등록증 내용 */}
      <div style={{ maxWidth: '900px', margin: '50px auto', padding: '40px', backgroundColor: '#FFF', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9000', marginBottom: '30px', textAlign: 'center' }}>사업자 등록증</h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <Image
            src="/사업자 등록증.png"
            alt="메이플 아이템 사업자 등록증"
            width={700}
            height={900}
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '10px', border: '1px solid #E2E8F0' }}
          />
        </div>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#FF9000', fontWeight: 'bold', textDecoration: 'none' }}>← 홈으로 돌아가기</Link>
        </div>
      </div>

      <footer style={{ backgroundColor: '#F1F5F9', padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '12px', borderTop: '1px solid #E2E8F0', marginTop: '50px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>이용약관</Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>개인정보 처리방침</Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/business-license" style={{ color: '#FF9000', textDecoration: 'none', fontWeight: '600' }}>사업자 등록증</Link>
        </div>
        <div style={{ color: '#94A3B8' }}>© 2026 메이플 아이템. All rights reserved.</div>
      </footer>
    </div>
  );
}
