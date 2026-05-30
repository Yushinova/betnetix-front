"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { InputGroup, TextField, Button } from "@heroui/react";
import { useCommentStore } from "@/stores/commentStore";
import { usePostStore } from "@/stores/postStore";
import CommentsTable from "@/components/common/CommentsTable";
import MobileCommentsView from "@/components/mobile/MobileCommentsView";
import Pagination from "@/components/ui/Pagination";
import SelectDropdown from "@/components/ui/SelectDropdown";
import styles from "../CommentsPage.module.css";

export default function CommentsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.postId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  
  const { 
    itemsPerPage, 
    setItemsPerPage, 
    total, 
    fetchComments,
    comments,
    isLoading 
  } = useCommentStore();
  
  const { posts, fetchPosts } = usePostStore();
  
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

  // Загружаем посты если их нет
  useEffect(() => {
    if (isClient && posts.length === 0) {
      fetchPosts(100, 0);
    }
  }, [isClient, posts.length, fetchPosts]);

  // Загружаем комментарии и получаем заголовок поста
  useEffect(() => {
    if (isClient && postId) {
      fetchComments(postId, 100, 0);
      
      // Находим пост по ID и берем заголовок
      const foundPost = posts.find(p => p.id === postId);
      if (foundPost) {
        setPostTitle(foundPost.title);
      } else {
        setPostTitle(`Пост #${postId}`);
      }
    }
  }, [isClient, postId, fetchComments, posts]);

  // Сбрасываем на первую страницу при изменении поиска
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Фильтрация по поиску
  const filteredComments = comments.filter(comment => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      comment.body?.toLowerCase().includes(query) ||
      comment.user?.firstName?.toLowerCase().includes(query) ||
      comment.user?.lastName?.toLowerCase().includes(query)
    );
  });

  // Пагинация для мобильных
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (newValue: number) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };

  const handleBack = () => {
    router.back();
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
           <div className={styles.backLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span onClick={handleBack}>Назад к публикациям</span>
            </div>
            <div>
              <h1 className={styles.title}>Комментарии к посту</h1>
              <p className={styles.subtitle}>{postTitle}</p>
            </div>
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
                placeholder="Поиск по комментариям"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </InputGroup>
          </TextField>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>Загрузка комментариев...</div>
      ) : (
        <>
          {isMobile ? (
            <MobileCommentsView comments={paginatedComments} />
          ) : (
            <CommentsTable 
              searchQuery={searchQuery}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          )}

          {!isMobile && comments.length > 0 && (
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
        </>
      )}
    </div>
  );
}