"use client";

import { useState, useEffect } from "react";
import { Button, InputGroup, TextField } from "@heroui/react";
import { useUserStore } from "@/stores/userStore";
import UsersTable from "@/components/common/UsersTable";
import Pagination from "@/components/ui/Pagination";
import SelectDropdown from "@/components/ui/SelectDropdown";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CreateAdminForm from "@/components/forms/CreateAdminForm";
import UserCard from "@/components/common/UserCard";
import styles from "./UsersPage.module.css";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { itemsPerPage, setItemsPerPage, total, fetchUsers, users } = useUserStore();
  
  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 566);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchUsers();
    setCurrentPage(1);
  };

  const handleEdit = (user: any) => {
    console.log("Редактировать:", user);
  };

  const handleDelete = async (user: any) => {
    const { deleteUser } = useUserStore.getState();
    if (confirm(`Удалить пользователя ${user.firstName} ${user.lastName}?`)) {
      await deleteUser(user.id);
    }
  };

  return (
    <div className={styles.page}>
      <div className="px-4 w-full">
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Пользователи</h1>
            <p className={styles.subtitle}>Управление пользователями системы</p>
          </div>
          <Button 
            className={styles.addButton}
            onPress={() => setIsModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Добавить пользователя
          </Button>
        </div>

        <div className={styles.searchSection}>
          <TextField className={styles.searchTextField}>
            <InputGroup>
              <InputGroup.Prefix>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </InputGroup.Prefix>
              <InputGroup.Input 
                placeholder="Поиск по пользователям"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </InputGroup>
          </TextField>
        </div>
      </div>

      {isMobile ? (
        <div className={styles.mobileTable}>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <UsersTable 
          searchQuery={searchQuery}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )}

      <div className={styles.bottomPanel}>
        <SelectDropdown 
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateAdminForm 
          onSuccess={handleAddSuccess} 
          title="Добавление пользователя"
        />
      </ConfirmModal>
    </div>
  );
}