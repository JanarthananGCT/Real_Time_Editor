"use client"
import Main from "@/components/Main";
import LoginPage from '@/components/Login';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const {user, signIn, signUp } = useAuth();
  return (
    <div className="px-10 font-[family-name:var(--font-geist-sans)]">
      {user ? <Main user={user} /> : <LoginPage signIn={signIn} signUp={signUp} />}
    </div>
  );
}