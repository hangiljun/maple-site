import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ★ 로그인 기능 필수 라이브러리

const firebaseConfig = {
  apiKey: "AIzaSyABvyebJmW2GlaiLNvbWxuOSXbntkk21mA",
  authDomain: "maple-trading-admin.firebaseapp.com",
  projectId: "maple-trading-admin",
  storageBucket: "maple-trading-admin.firebasestorage.app",
  messagingSenderId: "702801044350",
  appId: "1:702801044350:web:8d2fd48196319ddee6892f",
  measurementId: "G-8T7P54ZCN0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // ★ 인증 객체 내보내기