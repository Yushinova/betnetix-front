"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Form, Button } from "@heroui/react";
import { useAuthStore } from "@/stores/authStore";
import { formatDate } from "@/utils/helpers";
import type { Admin } from "@/types/auth";
import ChangePasswordModal from "@/components/forms/ChangePasswordForm"; // 👈 Импорт
import styles from "./page.module.css";

interface FormData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: 'male' | 'female';
  role: 'admin' | 'user';
  image?: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { admin, updateAdmin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // 👈 Состояние
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: "male",
    role: "admin"
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (admin) {
      setFormData({
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        birthDate: admin.birthDate || "",
        gender: admin.gender,
        role: admin.role,
        image: admin.image || ""
      });
    } else {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        const adminData = JSON.parse(storedAdmin);
        setFormData({
          id: adminData.id,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          birthDate: adminData.birthDate || "",
          gender: adminData.gender,
          role: adminData.role || "admin",
          image: adminData.image || ""
        });
      }
    }
    setIsLoading(false);
  }, [admin]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updateData: Partial<Admin> & { role?: 'admin' | 'user' } = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      birthDate: formData.birthDate,
      gender: formData.gender,
      image: formData.image,
      role: formData.role,
    };
    
    updateAdmin(updateData);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    router.back();
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true); // 👈 Открываем модальное окно
  };

  const age = calculateAge(formData.birthDate);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.headerDiv}>
          <div className={styles.header}>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.profileHeader}>
            <div className={styles.headerLeft}>
              <Avatar className={styles.avatar}>
                <Avatar.Image 
                  alt={`${formData.firstName} ${formData.lastName}`}
                  src={formData.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
                />
                <Avatar.Fallback>
                  {formData.firstName?.[0]}{formData.lastName?.[0]}
                </Avatar.Fallback>
              </Avatar>
              <div className={styles.userInfo}>
                <div className={`${styles.roleBadge} ${formData.role === 'admin' ? styles.roleAdmin : styles.roleUser}`}>
                  {formData.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </div>
                <div className={styles.name}>
                  {formData.firstName} {formData.lastName}
                </div>
                <div className={styles.email}>{formData.email}</div>
                <div className={styles.birthDate}>
                  Дата рождения: {formatDate(formData.birthDate) || 'Не указана'} {age && `(${age} лет)`}
                </div>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.changePassword} onClick={handleChangePassword}>
                Изменить пароль
              </button>
            </div>
          </div>

          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Личные данные</h2>
            <Form className={styles.form} onSubmit={handleSubmit}>
              <div className={isMobile ? styles.mobileColumn : styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>Имя</label>
                  <input
                    type="text"
                    className={styles.nativeInput}
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    disabled={isSaving}
                    placeholder="Имя"
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.inputLabel}>Фамилия</label>
                  <input
                    type="text"
                    className={styles.nativeInput}
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    disabled={isSaving}
                    placeholder="Фамилия"
                  />
                </div>
              </div>

              <div className={isMobile ? styles.mobileColumn : styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>Email</label>
                  <input
                    type="email"
                    className={styles.nativeInput}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={isSaving}
                    placeholder="example@mail.com"
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.inputLabel}>Дата рождения</label>
                  <input
                    type="date"
                    className={styles.nativeInput}
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className={isMobile ? styles.mobileColumn : styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>Пол</label>
                  <select
                    className={styles.nativeSelect}
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
                    disabled={isSaving}
                  >
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.inputLabel}>Роль</label>
                  <select
                    className={styles.nativeSelect}
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                    disabled={isSaving}
                  >
                    <option value="admin">Администратор</option>
                    <option value="user">Пользователь</option>
                  </select>
                </div>
              </div>

              <Button 
                type="submit"
                isDisabled={isSaving}
                className={styles.submitButton}
              >
                {isSaving ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </Form>
          </div>
        </div>
      </div>

      {/* 👇 Модальное окно смены пароля */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}