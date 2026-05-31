"use client";

import { Card, Input, Button, Label, FieldError, TextField, Form } from "@heroui/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/stores/adminStore";
import styles from "./CreateAdminForm.module.css";

interface CreateAdminFormProps {
  onSuccess?: () => void;
  title?: string; //ропс для заголовка
}

export default function CreateAdminForm({ onSuccess, title = "Добавление администратора" }: CreateAdminFormProps) {
  const router = useRouter();
  const { createAdmin, isLoading } = useAdminStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const birthDate = formData.get('birthDate') as string;
    
    const success = await createAdmin({
      firstName,
      lastName,
      email,
      password: 'default123',
      birthDate,
      gender: 'male',
    });
    
    if (success) {
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admins');
      }
    } else {
      setError('Ошибка при создании администратора');
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <Image 
              src="https://storage.yandexcloud.net/backet-online-storage/test/avatar.png"
              alt="Avatar"
              width={120}
              height={120}
              className={styles.avatarImage}
            />
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        <Form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            name="firstName"
            type="text"
            isRequired
            className="[&_label]:after:content-none"
          >
            <Label className={styles.inputLabel}>ФИО</Label>
            <Input 
              className={styles.inputField}
              placeholder="Введите имя и фамилию"
              disabled={isLoading}
            />
            <FieldError className={styles.fieldError}/>
          </TextField>

          <TextField
            name="email"
            type="email"
            isRequired
            className="[&_label]:after:content-none"
          >
            <Label className={styles.inputLabel}>Email</Label>
            <Input 
              className={styles.inputField}
              placeholder="example@mail.com"
              disabled={isLoading}
            />
            <FieldError className={styles.fieldError}/>
          </TextField>

          <TextField
            name="birthDate"
            type="date"
            isRequired
            className="[&_label]:after:content-none"
          >
            <Label className={styles.inputLabel}>Дата рождения</Label>
            <Input 
              className={styles.inputField}
              placeholder="ДД.ММ.ГГГГ"
              disabled={isLoading}
            />
            <FieldError className={styles.fieldError}/>
          </TextField>

          <Button 
            type="submit"
            isDisabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </Form>
      </div>
    </Card>
  );
}