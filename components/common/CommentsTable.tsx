"use client";

import { Table, Avatar } from "@heroui/react";
import { useMemo, useEffect, useState } from "react";
import { useCommentStore } from "@/stores/commentStore";
import styles from "./CommentsTable.module.css";

interface CommentsTableProps {
  searchQuery?: string;
  currentPage?: number;
  itemsPerPage?: number;
}

export default function CommentsTable({ 
  searchQuery = "", 
  currentPage = 1, 
  itemsPerPage = 10 
}: CommentsTableProps) {
  const { comments, isLoading, fetchComments, currentPostId } = useCommentStore();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const getDisplayName = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return 'Unknown';
    if (!lastName) return firstName;
    return `${lastName} ${firstName.charAt(0)}.`;
  };

  // Фильтрация по поиску
  const filteredComments = useMemo(() => {
    if (!searchQuery.trim()) return comments;
    const query = searchQuery.toLowerCase();
    return comments.filter(comment => 
      comment.body?.toLowerCase().includes(query) ||
      comment.user?.firstName?.toLowerCase().includes(query) ||
      comment.user?.lastName?.toLowerCase().includes(query)
    );
  }, [comments, searchQuery]);

  // Пагинация
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, endIndex);

  if (!currentPostId) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCell}>Выберите пост для просмотра комментариев</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Table className={styles.table}>
        <Table.ScrollContainer>
          <Table.Content aria-label="Комментарии" className="min-w-[600px]">
            <Table.Header className={styles.headerTable}>
              <Table.Column isRowHeader className={styles.columnComment}>
                Комментарий
              </Table.Column>
              <Table.Column className={styles.columnAuthor}>
                Автор
              </Table.Column>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={2} className={styles.loadingCell}>
                    Загрузка...
                  </Table.Cell>
                </Table.Row>
              ) : paginatedComments.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={2} className={styles.emptyCell}>
                    Нет комментариев
                  </Table.Cell>
                </Table.Row>
              ) : (
                paginatedComments.map((comment) => (
                  <Table.Row key={comment.id}>
                    <Table.Cell className={styles.commentCell}>
                      <div className={styles.commentInfo}>
                        <div className={styles.commentText}>{comment.body}</div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className={styles.authorCell}>
                      <div className={styles.authorInfo}>
                        <Avatar className={styles.avatar}>
                          <Avatar.Image 
                            alt={`${comment.user?.firstName} ${comment.user?.lastName}`}
                            src={comment.user?.image || "https://storage.yandexcloud.net/backet-online-storage/test/avatar.png"}
                          />
                          <Avatar.Fallback>
                            {comment.user?.firstName?.[0]}{comment.user?.lastName?.[0]}
                          </Avatar.Fallback>
                        </Avatar>
                        <div>
                          <div className={styles.authorName}>
                            {getDisplayName(comment.user?.firstName || '', comment.user?.lastName || '')}
                          </div>
                        </div>
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
  );
}