"use client";

import { useState, useEffect } from "react";
import { InputGroup, TextField } from "@heroui/react";
import { usePostStore } from "@/stores/postStore";
import PostsTable from "@/components/common/PostsTable";
import MobilePostsView from "@/components/mobile/MobilePostsView";
import Pagination from "@/components/ui/Pagination";
import SelectDropdown from "@/components/ui/SelectDropdown";
import styles from "./PostsPage.module.css";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const { 
    itemsPerPage, 
    setItemsPerPage, 
    total, 
    fetchPosts,
    posts,
    isLoading 
  } = usePostStore();
  
  const totalPages = Math.ceil(total / itemsPerPage);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загружаем все посты один раз
  useEffect(() => {
    if (isClient) {
      fetchPosts(100, 0);
    }
  }, [isClient, fetchPosts]);

  // Сбрасываем на первую страницу при изменении поиска
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Фильтрация по поиску
  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title?.toLowerCase().includes(query) ||
      post.body?.toLowerCase().includes(query) ||
      post.authorName?.toLowerCase().includes(query)
    );
  });

  // Пагинация для мобильных
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  if (!isClient) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingContainer}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerDiv}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Публикации</h1>
            <p className={styles.subtitle}>Управление публикациями пользователей</p>
          </div>
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
                placeholder="Поиск по постам"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </InputGroup>
          </TextField>
        </div>
      </div>

      {isMobile ? (
        <div >
          <MobilePostsView 
            posts={paginatedPosts}
            onViewComments={(postId) => window.location.href = `/comments/${postId}`}
          />
        </div>
      ) : (
        <PostsTable 
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
    </div>
  );
}