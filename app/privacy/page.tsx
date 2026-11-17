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
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>1. 사이트에서 처리하는 정보</h2>
            <p style={{ color: '#4B5563' }}>
              사이트 내에서는 아이템 거래대금 지급을 위한 전화번호나 계좌정보를 입력받지 않습니다. 후기와 댓글을 작성하면 닉네임, 본문, 작성 시각과 수정·삭제용 비밀번호를 저장합니다. 후기에는 이용자가 첨부한 이미지도 저장됩니다. 게시판 운영을 위해 Firebase 익명 인증 식별자를 사용합니다.
            </p>
            <p style={{ color: '#4B5563', marginTop: '12px' }}>
              닉네임, 본문과 후기 첨부 이미지는 공개될 수 있습니다. 전화번호, 계좌번호 등 개인정보는 공개 글이나 이미지에 넣지 마시고, 수정·삭제용 비밀번호는 다른 서비스에서 사용하는 비밀번호와 다르게 설정해 주세요.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>2. 카카오톡 거래 문의와 송금</h2>
            <p style={{ color: '#4B5563' }}>
              이용자가 카카오톡으로 아이템 판매를 문의하면, 운영자는 거래 협의와 대금 지급에 필요한 정보를 해당 목적으로 처리합니다. 전화번호를 이용해 송금하는 경우 카카오톡에서 받은 전화번호를 송금에 사용합니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>3. 보유 기간 및 파기</h2>
            <p style={{ color: '#4B5563' }}>
              후기와 댓글 정보는 게시물이 유지되는 동안 보관합니다. 게시물을 삭제하거나 운영자가 삭제 요청을 처리할 때 해당 정보를 게시판 데이터베이스에서 삭제합니다.
            </p>
            <p style={{ color: '#4B5563', marginTop: '12px' }}>
              카카오톡으로 받은 송금 정보는 거래 및 송금 확인에 필요한 기간 동안 보관하고, 처리 목적이 달성되면 운영자가 관리하는 기록에서 지체 없이 삭제합니다. 법령에 따라 보존해야 하는 거래 증빙은 해당 법령에서 정한 기간 동안 보관합니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>4. 외부 서비스 이용</h2>
            <p style={{ color: '#4B5563' }}>
              후기·댓글 저장 및 게시판 인증에 Google의 Firebase를 사용합니다. 카카오톡 문의와 송금은 각각 해당 서비스의 개인정보 처리방침이 적용되는 외부 서비스에서 진행됩니다.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>5. 이용자의 권리와 문의 방법</h2>
            <p style={{ color: '#4B5563' }}>
              이용자는 운영자에게 개인정보 열람, 정정·삭제 또는 처리정지를 요청할 수 있습니다. 개인정보 문의와 권리 행사 요청은 사이트 운영자에게 카카오톡 ID han8246으로 접수해 주세요. 게시물에 관한 요청에는 게시글 주소와 해당 글 또는 댓글을 찾을 수 있는 정보를 함께 알려주세요.
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
