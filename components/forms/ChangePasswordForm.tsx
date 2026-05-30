"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import ConfirmModal from "@/components/ui/ConfirmModal";
import styles from "./ChangePasswordForm.module.css";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { admin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    
    // Валидация
    if (!currentPassword) {
      setError('Введите текущий пароль');
      return;
    }
    
    if (!newPassword) {
      setError('Введите новый пароль');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }
    
    setIsLoading(true);
    
    // Моковое сохранение
    setTimeout(() => {
      if (currentPassword === '123456') {
        setSuccess(true);
        const form = e.target as HTMLFormElement;
        form.reset();
        
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Неверный текущий пароль');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <ConfirmModal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Изменение пароля</h2>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <p className={styles.successText}>✓ Пароль успешно изменен!</p>
            <p className={styles.successSubtext}>Закрытие...</p>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.passwordRow}>
            <div className={styles.passwordField}>
              <label className={styles.inputLabel}>Текущий пароль</label>
              <input
                type="password"
                name="currentPassword"
                className={styles.inputField}
                placeholder="Введите текущий пароль"
                disabled={isLoading || success}
              />
            </div>

            <div className={styles.passwordField}>
              <label className={styles.inputLabel}>Новый пароль</label>
              <input
                type="password"
                name="newPassword"
                className={styles.inputField}
                placeholder="Введите новый пароль"
                disabled={isLoading || success}
              />
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="submit"
              disabled={isLoading || success}
              className={styles.submitButton}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </ConfirmModal>
  );
}