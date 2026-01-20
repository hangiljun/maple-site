// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBsmW33QhBPu7vcEFqvsM7KK0jeHLAuCNI",
  authDomain: "maple-item-site.firebaseapp.com",
  projectId: "maple-item-site",
  storageBucket: "maple-item-site.firebasestorage.app",
  messagingSenderId: "361844746472",
  appId: "1:361844746472:web:01014c4782118b4aa4815d",
  measurementId: "G-Z6DX58HXGM"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 우리가 사이트에서 쓸 기능들 내보내기
export const db = getFirestore(app);      // 글 저장용
export const storage = getStorage(app);  // 사진 저장용