'use client';
import { useRouter } from 'next/navigation';

export default function HowtoPage() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', color: '#F8FAFC', fontFamily: "'Noto Sans KR', sans-serif", padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => router.push('/')} style={{ marginBottom: '30px', padding: '10px 20px', backgroundColor: '#334155', borderRadius: '8px', border: 'none', color: '#FFF', cursor: 'pointer', fontWeight: 'bold' }}>← 홈으로</button>
        
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9000', marginBottom: '10px' }}>거래 방법</h1>
        <p style={{ color: '#94A3B8', marginBottom: '50px', fontSize: '16px' }}>안전하고 빠르게 아이템을 판매하는 절차를 안내해 드립니다.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* STEP 1 */}
          <div style={{ display: 'flex', gap: '20px', backgroundColor: '#1E293B', padding: '30px', borderRadius: '20px', border: '1px solid #334155', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FF9000', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: '#000', flexShrink: 0 }}>1</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#FFF' }}>카카오톡 문의 접수</h3>
              <p style={{ color: '#CBD5E1', lineHeight: '1.6' }}>홈페이지 내 업체 리스트에서 마음에 드는 업체의 [문의] 버튼을 눌러 카카오톡으로 연결합니다.</p>
            </div>
          </div>

          {/* STEP 2 */}
          <div style={{ display: 'flex', gap: '20px', backgroundColor: '#1E293B', padding: '30px', borderRadius: '20px', border: '1px solid #334155', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: '#FFF', flexShrink: 0 }}>2</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#FFF' }}>아이템 스샷 & 견적 확인</h3>
              <p style={{ color: '#CBD5E1', lineHeight: '1.6' }}>판매하실 아이템이나 메소의 스크린샷을 보내주시면, 즉시 최고가 매입 견적을 알려드립니다.</p>
            </div>
          </div>

          {/* STEP 3 */}
          <div style={{ display: 'flex', gap: '20px', backgroundColor: '#1E293B', padding: '30px', borderRadius: '20px', border: '1px solid #334155', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: '#FFF', flexShrink: 0 }}>3</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#FFF' }}>물품 전달 및 계좌 확인</h3>
              <p style={{ color: '#CBD5E1', lineHeight: '1.6' }}>게임 내에서 물품을 전달하고, 입금 받으실 계좌번호를 남겨주세요.</p>
            </div>
          </div>

          {/* STEP 4 */}
          <div style={{ display: 'flex', gap: '20px', backgroundColor: '#1E293B', padding: '30px', borderRadius: '20px', border: '1px solid #334155', alignItems: 'center' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#334155', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: '900', color: '#FFF', flexShrink: 0 }}>4</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#FFF' }}>즉시 입금 완료</h3>
              <p style={{ color: '#CBD5E1', lineHeight: '1.6' }}>물품 확인 후 3분 이내로 계좌로 현금이 입금됩니다. (24시간 즉시 입금)</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}