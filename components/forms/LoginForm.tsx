"use client";

import { Card, Input, Button, Label, FieldError, TextField, Form } from "@heroui/react";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import styles from "./LoginForm.module.css";

export default function LoginCard() {
  const router = useRouter();
  const { login, isLoading, error, admin, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (admin) {
      router.push('/profile');
      //console.log('✅ Admin logged in:', admin.firstName, admin.lastName);
    }
  }, [admin, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = email.split('@')[0];
    
    // console.log('📧 Email:', email);
    // console.log('👤 Username для API:', username);
    
    await login({ username, password });
  };

  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        {/* Логотип - только на десктопе */}
        <div className={styles.desktopLogo}>
          <Image 
            src="https://storage.yandexcloud.net/backet-online-storage/test/BTX%E2%80%A2.png" 
            alt="Logo" 
            width={100} 
            height={25}
            className="object-contain"
            priority
          />
        </div>

        <div className={styles.titleSection}>
          <h1 className={styles.title}>Панель администратора</h1>
          <p className={styles.subtitle}>Войдите в систему для продолжения</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <Form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            name="email"
            type="email"
            isRequired
            className="[&_label]:after:content-none"
          >
            <Label className={styles.inputLabel}>Имя пользователя</Label>
            <Input 
              className={styles.inputField}
              placeholder="john@example.com"
              disabled={isLoading}
            />
            <FieldError className={styles.fieldError}/>
          </TextField>

          <TextField
            name="password"
            type="password"
            isRequired
            className="[&_label]:after:content-none"
          >
            <Label className={styles.inputLabel}>Пароль</Label>
            <Input 
              className={styles.inputField}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            <FieldError className={styles.fieldError}/>
          </TextField>

          <Button 
            type="submit"
            isDisabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </Form>
      </div>
    </Card>
  );
}