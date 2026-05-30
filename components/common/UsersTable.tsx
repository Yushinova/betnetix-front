"use client";

import { Table, Avatar, Button, ButtonGroup } from "@heroui/react";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState, useMemo } from "react";
import EditProfileModal from "@/components/forms/EditProfileModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import styles from "./UsersTable.module.css";

interface UsersTableProps {
  searchQuery?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function UsersTable({ 
  searchQuery = "", 
  currentPage = 1, 
  itemsPerPage = 10 
}: UsersTableProps) {
  const { users, isLoading, fetchUsers, deleteUser } = useUserStore();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
   const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null) {
        const target = event.target as HTMLElement;
        if (!target.closest(`.${styles.menuContainer}`)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Фильтрация по поиску
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Пагинация
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

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

  // Обновленная функция редактирования
  const handleEdit = (user: any) => {
    setSelectedUserId(user.id);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  // Обработчик подтверждения удаления
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    setIsDeleting(true);
    await deleteUser(selectedUser.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };


  const toggleMenu = (userId: number) => {
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  return (
    <>
      <div className={styles.container}>
        <Table className={styles.table}>
          <Table.ScrollContainer>
            <Table.Content aria-label="Пользователи" className="min-w-[1000px]">
              <Table.Header className={styles.headerTable}>
                <Table.Column isRowHeader className={styles.columnAdmin}>
                  Пользователь
                </Table.Column>
                <Table.Column className={styles.columnEmail}>Email</Table.Column>
                <Table.Column className={styles.columnBirth}>Дата рождения</Table.Column>
                <Table.Column className={styles.columnGender}>Пол</Table.Column>
                <Table.Column className={styles.columnPosts}>Посты</Table.Column>
                <Table.Column className={styles.columnLikes}>Лайки</Table.Column>
                <Table.Column className={styles.columnComments}>Комментарии</Table.Column>
                <Table.Column className={styles.columnRole}>Роль</Table.Column>
                <Table.Column className={styles.columnActions}></Table.Column>
              </Table.Header>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={9} className={styles.loadingCell}>
                      Загрузка...
                    </Table.Cell>
                  </Table.Row>
                ) : paginatedUsers.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={9} className={styles.emptyCell}>
                      Нет данных
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedUsers.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell className={styles.adminCell}>
                        <div className={styles.adminInfo}>
                          <Avatar className={styles.avatar}>
                            <Avatar.Image 
                              alt={`${user.firstName} ${user.lastName}`}
                              src={user.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
                            />
                            <Avatar.Fallback>
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </Avatar.Fallback>
                          </Avatar>
                          <span className={styles.adminName}>
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className={styles.emailCell}>
                        {user.email}
                      </Table.Cell>
                      <Table.Cell className={styles.birthCell}>
                        {formatDate(user.birthDate)} 
                        {user.birthDate && (
                          <span className={styles.age}>({calculateAge(user.birthDate)} лет)</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className={styles.genderCell}>
                        {getGenderText(user.gender)}
                      </Table.Cell>
                      <Table.Cell className={styles.postsCell}>
                        {user.postsCount || 0}
                      </Table.Cell>
                      <Table.Cell className={styles.likesCell}>
                        {user.likesCount || 0}
                      </Table.Cell>
                      <Table.Cell className={styles.commentsCell}>
                        {user.commentsCount || 0}
                      </Table.Cell>
                      <Table.Cell className={styles.roleCell}>
                        <div className={`${styles.roleBadge} ${
                            user.role === 'admin' ? styles.roleAdmin : styles.roleUser
                        }`}>
                          {getRoleText(user.role)}
                        </div>
                      </Table.Cell>
                      <Table.Cell className={styles.actionsCell}>
                        <div className={styles.menuContainer}>
                          <Button
                            isIconOnly
                            size="sm"
                            className={styles.menuButton}
                            onClick={() => toggleMenu(user.id)}
                          >
                            <img 
                              src="/point.png"
                              alt="Меню"
                              width={24}
                              height={24}
                              className={styles.menuIcon}
                            />
                          </Button>
                          
                          {openMenuId === user.id && (
                            <div className={styles.dropdownMenu}>
                              <ButtonGroup variant="secondary"
                                orientation="vertical"
                                className={styles.verticalButtons}
                              >
                                <Button 
                                  className={styles.editButton}
                                  onPress={() => handleEdit(user)}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                                    <path d="M4 20h16" />
                                  </svg>
                                  Редактировать
                                </Button>
                                <ButtonGroup.Separator />
                                <Button 
                                  className={styles.deleteButton}
                                  onPress={() => handleDeleteClick(user)}
                                >
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
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/*Модальное окно редактирования */}
      {selectedUserId && (
        <EditProfileModal 
      isOpen={isEditModalOpen} 
      onClose={() => setIsEditModalOpen(false)}
      type="user"
      userId={selectedUserId}
    />
      )}
      {/*Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Удаление пользователя"
        message="Вы уверены, что хотите удалить пользователя"
        itemName={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}?` : ""}
        isLoading={isDeleting}
      />
    </>
  );
}