'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
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

      {/* 이용약관 내용 */}
      <div style={{ maxWidth: '900px', margin: '50px auto', padding: '40px', backgroundColor: '#FFF', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9000', marginBottom: '30px', textAlign: 'center' }}>이용약관</h1>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제1조 (목적)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            본 약관은 메이플 아이템(이하 "사이트")이 제공하는 메이플스토리 아이템 거래 중개 서비스의 이용과 관련하여 사이트와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제2조 (용어의 정의)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            1. "사이트"란 메이플 아이템 웹사이트를 말합니다.<br/>
            2. "이용자"란 사이트에 접속하여 본 약관에 따라 사이트가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.<br/>
            3. "거래"란 이용자가 사이트를 통해 메이플스토리 게임 아이템을 매입 또는 매각하는 행위를 말합니다.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제3조 (서비스의 제공 및 변경)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            1. 사이트는 메이플스토리 아이템 거래 중개 서비스를 제공합니다.<br/>
            2. 사이트는 필요한 경우 서비스의 내용을 변경할 수 있으며, 변경 시 사전 공지합니다.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제4조 (이용자의 의무)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            1. 이용자는 거래 시 정확한 정보를 제공해야 합니다.<br/>
            2. 이용자는 타인의 명의나 정보를 도용하여 거래해서는 안 됩니다.<br/>
            3. 이용자는 사이트의 운영을 방해하거나 불법적인 행위를 해서는 안 됩니다.
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제5조 (책임의 제한)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            1. 사이트는 천재지변 또는 이에 준하는 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임이 면제됩니다.<br/>
            2. 사이트는 이용자 간의 거래에서 발생하는 분쟁에 대해 중재 역할만을 수행하며, 직접적인 책임을 지지 않습니다.
          </p>
        </section>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#FF9000', fontWeight: 'bold', textDecoration: 'none' }}>← 홈으로 돌아가기</Link>
        </div>
      </div>

      <footer style={{ backgroundColor: '#F1F5F9', padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '12px', borderTop: '1px solid #E2E8F0', marginTop: '50px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#FF9000', textDecoration: 'none', fontWeight: '600' }}>이용약관</Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>개인정보 처리방침</Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/business-license" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>사업자 등록증</Link>
        </div>
        <div style={{ color: '#94A3B8' }}>© 2026 메이플 아이템. All rights reserved.</div>
      </footer>
    </div>
  );
}
