"use client";

import { Avatar, Button, ButtonGroup } from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import EditUserModal from "@/components/forms/EditProfileModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import styles from "./UserCard.module.css";

interface UserCardProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
    role: string;
    postsCount?: number;
    likesCount?: number;
    commentsCount?: number;
    image?: string;
  };
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
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

  const getRoleText = (role: string) => {
    return role === 'admin' ? 'Администратор' : 'Пользователь';
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  // Обработчик редактирования
  const handleEdit = () => {
    setOpenMenu(false);
    setIsEditModalOpen(true);
  };

  //
  const handleDeleteClick = () => {
    setOpenMenu(false);
    setIsDeleteModalOpen(true);
  };

  //Обработчик подтверждения удаления
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await onDelete(user);
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
              alt={`${user.firstName} ${user.lastName}`}
              src={user.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
            />
            <Avatar.Fallback>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Avatar.Fallback>
          </Avatar>
          
          <div className={styles.name}>{user.firstName} {user.lastName}</div>
          <div className={`${styles.roleBadge} ${
          user.role === 'admin' ? styles.roleAdmin : styles.roleUser
          }`}>
          {getRoleText(user.role)}
          </div>
          <div className={styles.email}>{user.email}</div>
          
          <div className={styles.infoRow}>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Дата рождения</div>
              <div className={styles.infoValue}>
                {formatDate(user.birthDate)} ({calculateAge(user.birthDate)} лет)
              </div>
            </div>
            <div className={styles.infoColumn}>
              <div className={styles.infoLabel}>Пол</div>
              <div className={styles.infoValue}>{getGenderText(user.gender)}</div>
            </div>
          </div>

          {/* Нижний див со статистикой */}
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <img src="/eye.png" alt="Посты" className={styles.statIcon} />
              <span className={styles.statValue}>{user.postsCount || 0}</span>
            </div>
            <div className={styles.statItem}>
              <img src="/heart.png" alt="Лайки" className={styles.statIcon} />
              <span className={styles.statValue}>{user.likesCount || 0}</span>
            </div>
            <div className={styles.statItem}>
              <img src="/comment.png" alt="Комментарии" className={styles.statIcon} />
              <span className={styles.statValue}>{user.commentsCount || 0}</span>
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
                <div className={styles.menuButtons}>
                  <button className={styles.editButton} onClick={handleEdit}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                      <path d="M4 20h16" />
                    </svg>
                    Редактировать
                  </button>
                  <button className={styles.deleteButton} onClick={handleDeleteClick}> {/* 👈 Меняем на handleDeleteClick */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 002 2h8a2 2 0 002-2l1-13" />
                      <path d="M9 4h6v3H9z" />
                    </svg>
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        type="user"
        userId={user.id}
      />

      {/* Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление пользователя"
        message="Вы уверены, что хотите удалить пользователя"
        itemName={`${user.firstName} ${user.lastName}?`}
        isLoading={isDeleting}
      />
    </>
  );
}