'use client';

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '60px 20px' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', textAlign: 'center' }}>
          이용약관
        </h1>

        <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '12px', lineHeight: '1.8', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>제1조 (목적)</h2>
            <p style={{ color: '#4B5563' }}>
              본 약관은 본 사이트의 이용과 관련하여 운영자와 이용자 간의 권리 및 의무를 규정합니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>제2조 (서비스 내용)</h2>
            <p style={{ color: '#4B5563' }}>
              본 사이트는 거래 중개 플랫폼이며, 실제 거래는 판매자와 구매자 간 직접 진행됩니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>제3조 (이용자 의무)</h2>
            <p style={{ color: '#4B5563' }}>
              이용자는 허위 정보 제공, 사이트 운영 방해, 법령 위반 행위를 하여서는 안 됩니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>제4조 (면책)</h2>
            <p style={{ color: '#4B5563', marginBottom: '12px' }}>
              운영자는 다음의 경우 책임을 지지 않습니다:
            </p>
            <ul style={{ color: '#4B5563', paddingLeft: '24px' }}>
              <li>게임 운영사의 정책에 따른 제재</li>
              <li>천재지변, 시스템 장애 등 불가항력적 사유</li>
              <li>거래 당사자 간 분쟁</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>제5조 (중요 고지)</h2>
            <div style={{ background: '#FEF2F2', padding: '16px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
              <p style={{ color: '#991B1B', fontSize: '14px', margin: 0 }}>
                ※ 본 서비스는 게임 운영사와 무관한 개인 서비스입니다.<br/>
                ※ 게임 내 거래는 게임 정책에 따를 수 있으니 신중하게 이용하세요.<br/>
                ※ 거래 시 발생하는 모든 책임은 이용자에게 있습니다.
              </p>
            </div>
          </section>

          <p style={{ marginTop: '32px', color: '#9CA3AF', fontSize: '14px', textAlign: 'center' }}>
            시행일: 2026년 6월 24일
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>← 홈으로 돌아가기</a>
        </div>
      </main>
    </div>
  );
}
