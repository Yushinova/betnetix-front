"use client";

import { useState, useEffect } from "react";
import { Button, InputGroup, TextField } from "@heroui/react";
import { useAdminStore } from "@/stores/adminStore";
import AdminsTable from "@/components/common/AdminsTable";
import AdminCard from "@/components/common/AdminCard";
import Pagination from "@/components/ui/Pagination";
import SelectDropdown from "@/components/ui/SelectDropdown";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CreateAdminForm from "@/components/forms/CreateAdminForm";
import styles from "./AdminsPage.module.css";

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { itemsPerPage, setItemsPerPage, total, fetchAdmins, admins } = useAdminStore();
  
  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 566);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загружаем всех админов один раз
  useEffect(() => {
    fetchAdmins(100, 0);
  }, []);

  // Сбрасываем на первую страницу при изменении поиска
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Фильтрация по поиску
  const filteredAdmins = admins.filter(admin => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      admin.firstName.toLowerCase().includes(query) ||
      admin.lastName.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  });

  const handleEdit = (admin: any) => {
    console.log("Редактировать:", admin);
  };

  const handleDelete = async (admin: any) => {
    const { deleteAdmin } = useAdminStore.getState();
    if (confirm(`Удалить администратора ${admin.firstName} ${admin.lastName}?`)) {
      await deleteAdmin(admin.id);
      fetchAdmins(100, 0);
    }
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    fetchAdmins(100, 0);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerDiv}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Администраторы</h1>
            <p className={styles.subtitle}>Управление администраторами системы</p>
          </div>
          <Button 
            className={styles.addButton}
            onPress={() => setIsModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Добавить администратора
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
                placeholder="Поиск по администраторам"
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
          {filteredAdmins.map((admin) => (
            <AdminCard
              key={admin.id}
              admin={admin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <AdminsTable 
          searchQuery={searchQuery}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      )}

      {!isMobile && (
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
      )}

      <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CreateAdminForm 
          onSuccess={handleAddSuccess} 
          title="Добавление администратора"
        />
      </ConfirmModal>
    </div>
  );
}