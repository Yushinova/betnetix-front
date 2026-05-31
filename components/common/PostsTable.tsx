"use client";

import { Table, Avatar, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { usePostStore } from "@/stores/postStore";
import styles from "./PostsTable.module.css";

interface PostsTableProps {
  searchQuery?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

type SortField = 'id' | 'views' | 'likes' | 'comments';
type SortOrder = 'asc' | 'desc';

export default function PostsTable({ 
  searchQuery = "",
  currentPage = 1,
  itemsPerPage = 10
}: PostsTableProps) {
  const router = useRouter();
  const { posts, isLoading, isHydrated } = usePostStore();
  const [isClient, setIsClient] = useState(false);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Компонент кнопки сортировки
  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <div className={styles.sortHeader}>
      <span>{label}</span>
      <button
        className={styles.sortButton}
        onClick={() => {
          if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          } else {
            setSortField(field);
            setSortOrder('desc');
          }
        }}
        aria-label={`Сортировать по ${label}`}
      >
        <img 
          src="https://storage.yandexcloud.net/backet-online-storage/test/sort.png"
          alt="Сортировка"
          width="16"
          height="16"
          className={styles.sortIcon}
          style={{
            transform: sortField === field && sortOrder === 'asc' ? 'rotate(180deg)' : 'none'
          }}
        />
      </button>
    </div>
  );

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getDisplayName = (fullName: string) => {
    if (!fullName) return 'Unknown';
    const parts = fullName.split(' ');
    if (parts.length === 1) return parts[0];
    const lastName = parts[parts.length - 1];
    const firstNameInitial = parts[0].charAt(0);
    return `${lastName} ${firstNameInitial}.`;
  };

  const handleViewComments = (postId: number) => {
   router.push(`/comments/${postId}`);
  };

  // Сортировка постов
  const sortedPosts = useMemo(() => {
    if (!posts.length) return [];
    
    const sorted = [...posts];
    
    sorted.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;
      
      switch (sortField) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'views':
          aValue = a.views || 0;
          bValue = b.views || 0;
          break;
        case 'likes':
          aValue = a.reactions?.likes || 0;
          bValue = b.reactions?.likes || 0;
          break;
        case 'comments':
          aValue = a.commentsCount || 0;
          bValue = b.commentsCount || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    return sorted;
  }, [posts, sortField, sortOrder]);

  // Фильтрация по поиску
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return sortedPosts;
    const query = searchQuery.toLowerCase();
    return sortedPosts.filter(post => 
      post.title?.toLowerCase().includes(query) ||
      post.body?.toLowerCase().includes(query) ||
      post.authorName?.toLowerCase().includes(query)
    );
  }, [sortedPosts, searchQuery]);

  // Пагинация
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  if (!isClient || !isHydrated) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCell}>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Table className={styles.table}>
        <Table.ScrollContainer>
          <Table.Content aria-label="Посты" className="min-w-[1000px]">
            <Table.Header className={styles.headerTable}>
              <Table.Column isRowHeader className={styles.columnId}>
                <SortButton field="id" label="ID" />
              </Table.Column>
              <Table.Column className={styles.columnPost}>Пост</Table.Column>
              <Table.Column className={styles.columnAuthor}>Автор</Table.Column>
              <Table.Column className={styles.columnViews}>
                <SortButton field="views" label="Просмотры" />
              </Table.Column>
              <Table.Column className={styles.columnLikes}>
                <SortButton field="likes" label="Лайки" />
              </Table.Column>
              <Table.Column className={styles.columnComments}>
                <SortButton field="comments" label="Комментарии" />
              </Table.Column>
              <Table.Column className={styles.columnActions}></Table.Column>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className={styles.loadingCell}>
                    Загрузка...
                  </Table.Cell>
                </Table.Row>
              ) : paginatedPosts.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={7} className={styles.emptyCell}>
                    Нет данных
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedPosts.map((post) => (
                  <Table.Row key={post.id}>
                    <Table.Cell className={styles.idCell}>
                      {post.id}
                    </Table.Cell>
                    <Table.Cell className={styles.postCell}>
                      <div className={styles.postInfo}>
                        <div className={styles.postTitle}>{truncateText(post.title, 40)}</div>
                        <div className={styles.postBody}>{truncateText(post.body, 60)}</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className={styles.authorCell}>
                      <div className={styles.authorInfo}>
                        <Avatar className={styles.avatar}>
                          <Avatar.Image 
                            src={post.authorImage || "https://storage.yandexcloud.net/backet-online-storage/test/avatar.png"}
                            alt={post.authorName}
                          />
                          <Avatar.Fallback>
                            {post.authorName?.charAt(0) || '?'}
                          </Avatar.Fallback>
                        </Avatar>
                        <span className={styles.authorName}>{getDisplayName(post.authorName)}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell className={styles.viewsCell}>
                      {post.views || 0}
                    </Table.Cell>
                    <Table.Cell className={styles.likesCell}>
                      {post.reactions?.likes || 0}
                    </Table.Cell>
                    <Table.Cell className={styles.commentsCell}>
                      {post.commentsCount || 0}
                    </Table.Cell>
                    <Table.Cell className={styles.actionsCell}>
                      <Button
                        isIconOnly
                        size="sm"
                        className={styles.commentButton}
                        onClick={() => handleViewComments(post.id)}
                      >
                        <img 
                          src="https://storage.yandexcloud.net/backet-online-storage/test/arrow-circle-right.png"
                          alt="Комментарии"
                          width={24}
                          height={24}
                          className={styles.commentIcon}
                        />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}