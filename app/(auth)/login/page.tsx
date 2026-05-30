'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import LoginCard from '@/components/forms/LoginForm';
import styles from '@/components/forms/LoginForm.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    const success = await login({ username, password });
    if (success) {
      router.push('/profile');
    }
  };

  return (
    <>
      {/* Мобильная шапка */}
      <div className={styles.mobileHeader}>
        <div className="w-[100px] h-[25px] relative">
          <Image 
            src="/BTX•.png" 
            alt="Logo" 
            width={100} 
            height={25}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Контент */}
      <div className={styles.pageContainer}>
        <LoginCard />
      </div>
    </>
  );
}