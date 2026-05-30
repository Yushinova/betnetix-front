"use client";

import { Avatar, Button, ButtonGroup } from "@heroui/react";
import { useState } from "react";
import EditProfileModal from "@/components/forms/EditProfileModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import styles from "./AdminCard.module.css";

interface AdminCardProps {
  admin: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
    image?: string;
  };
  onEdit: (admin: any) => void;
  onDelete: (admin: any) => void;
}

export default function AdminCard({ admin, onEdit, onDelete }: AdminCardProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "—";
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getGenderText = (gender: string) => {
    return gender === 'male' ? 'Мужской' : 'Женский';
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  // Обработчик редактирования
  const handleEdit = () => {
    setOpenMenu(false);
    setIsEditModalOpen(true);
  };

  // Обработчик открытия модалки удаления
  const handleDeleteClick = () => {
    setOpenMenu(false);
    setIsDeleteModalOpen(true);
  };

  // Обработчик подтверждения удаления
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await onDelete(admin);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className={styles.card}>
        {/* Левая часть */}
        <div className={styles.leftSection}>
          <Avatar className={styles.avatar}>
            <Avatar.Image 
              alt={`${admin.firstName} ${admin.lastName}`}
              src={admin.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
            />
            <Avatar.Fallback>
              {admin.firstName?.[0]}{admin.lastName?.[0]}
            </Avatar.Fallback>
          </Avatar>
          
          <div className={styles.name}>{admin.firstName} {admin.lastName}</div>
          <div className={styles.email}>{admin.email}</div>
          
          <div className={styles.infoRow}>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Дата рождения</div>
              <div className={styles.infoValue}>
                {formatDate(admin.birthDate)} ({calculateAge(admin.birthDate)} лет)
              </div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Пол</div>
              <div className={styles.infoValue}>{getGenderText(admin.gender)}</div>
            </div>
          </div>
        </div>

        {/* Правая часть - кнопка меню */}
        <div className={styles.rightSection}>
          <div className={styles.menuContainer}>
            <Button
              isIconOnly
              size="sm"
              className={styles.menuButton}
              onClick={toggleMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="4" cy="12" r="2.5" />
                <circle cx="12" cy="12" r="2.5" />
                <circle cx="20" cy="12" r="2.5" />
              </svg>
            </Button>

            {openMenu && (
              <div className={styles.dropdownMenu}>
                <ButtonGroup variant="secondary" orientation="vertical" className={styles.verticalButtons}>
                  <Button className={styles.editButton} onPress={handleEdit}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                      <path d="M4 20h16" />
                    </svg>
                    Редактировать
                  </Button>
                  <ButtonGroup.Separator />
                  <Button className={styles.deleteButton} onPress={handleDeleteClick}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13" />
                      <path d="M9 4h6v3H9z" />
                    </svg>
                    Удалить
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования администратора */}
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        type="admin"
        adminId={admin.id}
      />

      {/*Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление администратора"
        message="Вы уверены, что хотите удалить администратора"
        itemName={`${admin.firstName} ${admin.lastName}?`}
        isLoading={isDeleting}
      />
    </>
  );
}