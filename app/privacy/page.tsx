'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
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

      {/* 개인정보 처리방침 내용 */}
      <div style={{ maxWidth: '900px', margin: '50px auto', padding: '40px', backgroundColor: '#FFF', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9000', marginBottom: '30px', textAlign: 'center' }}>개인정보 처리방침</h1>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제1조 (개인정보의 수집 항목 및 이용 목적)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            메이플 아이템은 다음과 같은 개인정보를 수집하여 이용합니다.<br/><br/>
            <strong>수집 항목:</strong> 카카오톡 ID, 연락처, 거래 내역<br/>
            <strong>이용 목적:</strong> 아이템 거래 중개, 고객 문의 응대, 거래 내역 관리
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제2조 (개인정보의 보유 및 이용 기간)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            회사는 이용자의 개인정보를 수집 목적이 달성될 때까지 보유하며, 관련 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.<br/><br/>
            <strong>거래 내역:</strong> 5년 (전자상거래법)<br/>
            <strong>고객 문의 내역:</strong> 3년
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제3조 (개인정보의 제3자 제공)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다.<br/>
            1. 이용자가 사전에 동의한 경우<br/>
            2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제4조 (개인정보의 파기 절차 및 방법)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            회사는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 해당 개인정보를 파기합니다.<br/><br/>
            <strong>파기 절차:</strong> 목적 달성 후 별도의 DB로 옮겨져 내부 방침 및 관련 법령에 따라 일정 기간 보관 후 파기<br/>
            <strong>파기 방법:</strong> 전자적 파일 형태는 복구 불가능한 방법으로 영구 삭제
          </p>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E293B', marginBottom: '15px' }}>제5조 (이용자의 권리)</h2>
          <p style={{ lineHeight: '1.8', color: '#475569' }}>
            이용자는 언제든지 본인의 개인정보를 조회하거나 수정할 수 있으며, 삭제를 요청할 수 있습니다.<br/>
            개인정보 관련 문의는 카카오톡 문의를 통해 가능합니다.
          </p>
        </section>

        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#FF9000', fontWeight: 'bold', textDecoration: 'none' }}>← 홈으로 돌아가기</Link>
        </div>
      </div>

      <footer style={{ backgroundColor: '#F1F5F9', padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '12px', borderTop: '1px solid #E2E8F0', marginTop: '50px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>이용약관</Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/privacy" style={{ color: '#FF9000', textDecoration: 'none', fontWeight: '600' }}>개인정보 처리방침</Link>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <Link href="/business-license" style={{ color: '#64748B', textDecoration: 'none', fontWeight: '600' }}>사업자 등록증</Link>
        </div>
        <div style={{ color: '#94A3B8' }}>© 2026 메이플 아이템. All rights reserved.</div>
      </footer>
    </div>
  );
}
