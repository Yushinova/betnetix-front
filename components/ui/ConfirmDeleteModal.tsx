"use client";

import ConfirmModal from "@/components/ui/ConfirmModal";
import styles from "./ConfirmDeleteModal.module.css";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <ConfirmModal isOpen={isOpen} onClose={onClose}>
        <div className={styles.central}>
          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.message}>
            {message}
            {itemName && <strong> {itemName}</strong>}
            </p>
            <p className={styles.warning}>Данное действие отменить невозможно</p>
            <div className={styles.buttonGroup}>
            <button 
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
                disabled={isLoading}
            >
                Не удалять
            </button>
            <button 
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={styles.deleteButton}
            >
                {isLoading ? "Удаление..." : "Да, удалить"}
            </button>
            </div>
          </div>
        </div>
     
    </ConfirmModal>
  );
}