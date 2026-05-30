"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useAdminStore } from "@/stores/adminStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import styles from "./EditProfileModal.module.css";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;      // для пользователя
  adminId?: number;     // для админа
  type: "user" | "admin";
}

export default function EditProfileModal({ isOpen, onClose, userId, adminId, type }: EditProfileModalProps) {
  // Подключаем нужные сторы
  const { users, updateUser, isLoading: isUserLoading } = useUserStore();
  const { admins, updateAdmin, isLoading: isAdminLoading } = useAdminStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fullName, setFullName] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    birthDate: "",
    role: "user" as "admin" | "user",
  });
  const [avatarImage, setAvatarImage] = useState<string>("");

  // Находим пользователя или админа по id
  const user = type === "user" && userId ? users.find(u => u.id === userId) : null;
  const admin = type === "admin" && adminId ? admins.find(a => a.id === adminId) : null;
  const currentItem = type === "user" ? user : admin;

  useEffect(() => {
    if (currentItem) {
      setFullName(`${currentItem.firstName || ""} ${currentItem.lastName || ""}`.trim());
      setFormData({
        email: currentItem.email || "",
        birthDate: currentItem.birthDate || "",
        role: currentItem.role as "admin" | "user",
      });
      setAvatarImage(currentItem.image || ""); //существующее изображение
    }
  }, [currentItem]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";
    
    if (!firstName) {
      setError('Введите ФИО');
      return;
    }
    
    if (!formData.email) {
      setError('Введите email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let success = false;
      
      if (type === "user" && userId) {
        success = await updateUser(userId, {
          id: userId,
          firstName: firstName,
          lastName: lastName,
          email: formData.email,
          birthDate: formData.birthDate,
          role: formData.role,
        });
      } else if (type === "admin" && adminId) {
        success = await updateAdmin(adminId, {
          id: adminId,
          firstName: firstName,
          lastName: lastName,
          email: formData.email,
          birthDate: formData.birthDate,
          role: formData.role,
        });
      }
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(`Ошибка при обновлении ${type === "user" ? "пользователя" : "администратора"}`);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || `Ошибка при обновлении ${type === "user" ? "пользователя" : "администратора"}`);
      setIsLoading(false);
    }
  };

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

  const age = calculateAge(formData.birthDate);
  const isLoadingStore = type === "user" ? isUserLoading : isAdminLoading;
  
  if (!currentItem) return null;

  return (
    <ConfirmModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>
            Редактирование профиля
          </h2>
        </div>

        <div className={styles.avatar}>
        <img 
            src={avatarImage || "/avatar.png"} 
            alt={fullName}
            className={styles.avatarImage}
        />
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <p className={styles.successText}>✓ Профиль успешно обновлен!</p>
            <p className={styles.successSubtext}>Закрытие...</p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formFields}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>ФИО</label>
              <input
                type="text"
                className={styles.inputField}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading || success || isLoadingStore}
                placeholder="Иван Иванов"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.inputLabel}>Email</label>
              <input
                type="email"
                className={styles.inputField}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={isLoading || success || isLoadingStore}
                placeholder="example@mail.com"
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Дата рождения {age && <span className={styles.age}>({age} лет)</span>}
              </label>
              <input
                type="date"
                className={styles.inputField}
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                disabled={isLoading || success || isLoadingStore}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.inputLabel}>Роль</label>
              <select
                className={styles.inputField}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'user'})}
                disabled={isLoading || success || isLoadingStore}
              >
                <option value="admin">Администратор</option>
                <option value="user">Пользователь</option>
              </select>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit"
              disabled={isLoading || success || isLoadingStore}
              className={styles.submitButton}
            >
              {isLoading ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>
    </ConfirmModal>
  );
}