'use client';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '60px 20px' }}>
      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '40px', textAlign: 'center' }}>
          개인정보 처리방침
        </h1>

        <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '12px', lineHeight: '1.8', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>사이트 이용과 댓글 삭제</h2>
            <p style={{ color: '#4B5563' }}>
              댓글 내용과 닉네임은 공개될 수 있으니 개인정보는 댓글에 적지 말아 주세요.
            </p>
            <p style={{ color: '#4B5563', marginTop: '12px' }}>
              작성한 댓글의 삭제를 원하시면 카카오톡 ID han8246으로 게시글 주소와 댓글을 찾을 수 있는 정보를 보내주세요.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>처리하는 정보</h2>
            <p style={{ color: '#4B5563' }}>
              댓글 운영을 위해 닉네임, 댓글 내용, 작성 시각, 삭제용 비밀번호를 저장하며, Firebase 익명 인증 식별자를 사용합니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>보유 및 삭제</h2>
            <p style={{ color: '#4B5563' }}>
              댓글 정보는 댓글이 게시되어 있는 동안 보관합니다. 댓글을 삭제하면 해당 정보를 게시판 데이터베이스에서 삭제합니다.
            </p>
            <p style={{ color: '#4B5563', marginTop: '12px' }}>
              거래 문의로 받은 개인정보는 이용 목적이 달성되면 운영자가 관리하는 기록에서 삭제합니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>개인정보 관련 요청</h2>
            <p style={{ color: '#4B5563' }}>
              이용자는 운영자에게 개인정보 열람, 정정·삭제 또는 처리정지를 요청할 수 있습니다. 개인정보 문의와 권리 행사 요청은 사이트 운영자에게 카카오톡 ID han8246으로 접수해 주세요.
            </p>
          </section>

          <p style={{ marginTop: '32px', color: '#9CA3AF', fontSize: '14px', textAlign: 'center' }}>
            개정일: 2026년 11월 17일
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>← 홈으로 돌아가기</a>
        </div>
      </main>
    </div>
  );
}
