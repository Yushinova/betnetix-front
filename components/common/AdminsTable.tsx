"use client";

import { Table, Avatar, Button } from "@heroui/react";
import { useAdminStore } from "@/stores/adminStore";
import { useEffect, useState, useMemo } from "react";
import EditProfileModal from "@/components/forms/EditProfileModal";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import styles from "./AdminsTable.module.css";

interface AdminsTableProps {
  searchQuery?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function AdminsTable({ 
  searchQuery = "", 
  currentPage = 1, 
  itemsPerPage = 10 
}: AdminsTableProps) {
  const { admins, isLoading, deleteAdmin } = useAdminStore();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const filteredAdmins = useMemo(() => {
    if (!searchQuery.trim()) return admins;
    const query = searchQuery.toLowerCase();
    return admins.filter(admin => 
      admin.firstName.toLowerCase().includes(query) ||
      admin.lastName.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  }, [admins, searchQuery]);

  // Пагинация
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);

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

  //Обработчик редактирования
  const handleEdit = (admin: any) => {
    setSelectedAdminId(admin.id);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (admin: any) => {
    if (confirm(`Удалить администратора ${admin.firstName} ${admin.lastName}?`)) {
      await deleteAdmin(admin.id);
    }
    setOpenMenuId(null);
  };
// Обработчик открытия модалки удаления
  const handleDeleteClick = (admin: any) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  //Обработчик подтверждения удаления
  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;
    
    setIsDeleting(true);
    await deleteAdmin(selectedAdmin.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setSelectedAdmin(null);
  };
  const toggleMenu = (adminId: number) => {
    setOpenMenuId(openMenuId === adminId ? null : adminId);
  };

  return (
    <>
      <div className={styles.container}>
        <Table className={styles.table}>
          <Table.ScrollContainer>
            <Table.Content aria-label="Администраторы" className="min-w-[800px]">
              <Table.Header className={styles.headerTable}>
                <Table.Column isRowHeader className={styles.columnAdmin}>
                  Администратор
                </Table.Column>
                <Table.Column className={styles.columnEmail}>Email</Table.Column>
                <Table.Column className={styles.columnBirth}>Дата рождения</Table.Column>
                <Table.Column className={styles.columnGender}>Пол</Table.Column>
                <Table.Column className={styles.columnActions}></Table.Column>
              </Table.Header>
              <Table.Body>
                {isLoading ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className={styles.loadingCell}>
                      Загрузка...
                    </Table.Cell>
                  </Table.Row>
                ) : paginatedAdmins.length === 0 ? (
                  <Table.Row>
                    <Table.Cell colSpan={5} className={styles.emptyCell}>
                      Нет данных
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  paginatedAdmins.map((admin) => (
                    <Table.Row key={admin.id}>
                      <Table.Cell className={styles.adminCell}>
                        <div className={styles.adminInfo}>
                          <Avatar className={styles.avatar}>
                            <Avatar.Image 
                              alt={`${admin.firstName} ${admin.lastName}`}
                              src={admin.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
                            />
                            <Avatar.Fallback>
                              {admin.firstName?.[0]}{admin.lastName?.[0]}
                            </Avatar.Fallback>
                          </Avatar>
                          <span className={styles.adminName}>
                            {admin.firstName} {admin.lastName}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className={styles.emailCell}>
                        {admin.email}
                      </Table.Cell>
                      <Table.Cell className={styles.birthCell}>
                        {formatDate(admin.birthDate)} 
                        {admin.birthDate && (
                          <span className={styles.age}>({calculateAge(admin.birthDate)} лет)</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className={styles.genderCell}>
                        {getGenderText(admin.gender)}
                      </Table.Cell>
                      <Table.Cell className={styles.actionsCell}>
                        <div className={styles.menuContainer}>
                          <Button
                            isIconOnly
                            size="sm"
                            className={styles.menuButton}
                            onClick={() => toggleMenu(admin.id)}
                          >
                            <img 
                              src="/point.png"
                              alt="Меню"
                              width={24}
                              height={24}
                              className={styles.menuIcon}
                            />
                          </Button>
                          
                          {openMenuId === admin.id && (
                            <div className={styles.dropdownMenu}>
                              <div className={styles.menuButtons}>
                                <button 
                                  className={styles.editButton}
                                  onClick={() => handleEdit(admin)}
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                                    <path d="M4 20h16" />
                                  </svg>
                                  Редактировать
                                </button>
                                <div className={styles.separator} />
                                <button 
                                  className={styles.deleteButton}
                                  onClick={() => handleDeleteClick(admin)}
                                >
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
                      </Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>

      {/* Модальное окно редактирования администратора */}
      {selectedAdminId && (
        <EditProfileModal 
          isOpen={isEditModalOpen} 
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAdminId(null);
          }}
          type="admin"
          adminId={selectedAdminId}
        />
      )}

      {/*Модальное окно подтверждения удаления */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAdmin(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Удаление администратора"
        message="Вы уверены, что хотите удалить администратора"
        itemName={selectedAdmin ? `${selectedAdmin.firstName} ${selectedAdmin.lastName}?` : ""}
        isLoading={isDeleting}
      />
    </>
  );
}