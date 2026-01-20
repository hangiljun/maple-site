"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase'; // 방금 만드신 파일 연결
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export default function Home() {
  const [activeTab, setActiveTab] = useState('메인사이트');
  const [isAdmin, setIsAdmin] = useState(false); 
  const [ads, setAds] = useState([]); 
  const [file, setFile] = useState(null);
  const [adName, setAdName] = useState("");

  // DB에서 등록된 업체들 가져오기
  const fetchAds = async () => {
    try {
      const q = query(collection(db, "ads"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const adList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAds(adList);
    } catch (e) { console.error("데이터 로딩 실패:", e); }
  };

  useEffect(() => { fetchAds(); }, []);

  // 업체 등록 (사진 업로드 + DB 저장)
  const handleUpload = async () => {
    if (!file || !adName) return alert("사진과 업체명을 입력해주세요!");
    try {
      const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "ads"), {
        name: adName,
        imageUrl: url,
        createdAt: new Date()
      });
      alert("등록 완료!");
      setAdName(""); setFile(null); fetchAds();
    } catch (e) { alert("등록 실패! Firebase 설정을 확인하세요."); }
  };

  // 업체 삭제
  const handleDelete = async (id, imageUrl) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "ads", id));
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      fetchAds();
    } catch (e) { alert("삭제 실패!"); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-orange-500 text-white py-12 text-center shadow-lg">
        <h1 className="text-4xl font-black">🍁 메이플 급처템</h1>
        <button onClick={() => setIsAdmin(!isAdmin)} className="mt-4 text-xs opacity-50 underline">
          {isAdmin ? "[관리자 모드 끄기]" : "[관리자 전용 로그인]"}
        </button>
      </header>

      <nav className="bg-gray-800 sticky top-0 flex justify-center text-white font-bold shadow-md">
        {['메인사이트', '공지사항', '거래방법', '후기'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`p-5 hover:bg-orange-600 ${activeTab === t ? 'bg-orange-500' : ''}`}>{t}</button>
        ))}
      </nav>

      <main className="max-w-5xl mx-auto p-8">
        {activeTab === '메인사이트' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">⭐ 추천 협력 업체</h2>
            {isAdmin && (
              <div className="bg-white p-6 mb-8 rounded-xl shadow-inner border-2 border-orange-200">
                <h3 className="font-bold mb-3 text-orange-600 text-lg">새 업체 등록</h3>
                <div className="flex flex-col gap-3">
                  <input type="text" placeholder="업체명 입력" value={adName} onChange={(e) => setAdName(e.target.value)} className="border p-3 rounded" />
                  <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-sm border p-2 bg-gray-50 rounded" />
                  <button onClick={handleUpload} className="bg-orange-500 text-white font-bold py-3 rounded hover:bg-orange-600 transition">데이터베이스에 저장하기</button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {ads.map(ad => (
                <div key={ad.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition hover:scale-105">
                  <img src={ad.imageUrl} className="w-full h-48 object-cover border-b" />
                  <div className="p-5 text-center">
                    <h3 className="font-black text-xl text-gray-800">{ad.name}</h3>
                    {isAdmin && <button onClick={() => handleDelete(ad.id, ad.imageUrl)} className="text-red-500 text-sm mt-3 font-bold hover:underline">[삭제하기]</button>}
                  </div>
                </div>
              ))}
              {ads.length === 0 && <p className="text-gray-400 text-center col-span-3 py-20">등록된 업체가 없습니다.</p>}
            </div>
          </div>
        )}
        {activeTab === '공지사항' && <div className="p-20 text-center font-bold text-gray-400">내용을 준비 중입니다.</div>}
        {activeTab === '거래방법' && <div className="p-20 text-center font-bold text-gray-400">내용을 준비 중입니다.</div>}
        {activeTab === '후기' && <div className="p-20 text-center font-bold text-gray-400">내용을 준비 중입니다.</div>}
      </main>
      <a href="#" className="fixed bottom-10 right-10 bg-yellow-400 p-5 rounded-full font-black shadow-2xl hover:scale-110 transition">💬 카톡 문의</a>
    </div>
  );
}