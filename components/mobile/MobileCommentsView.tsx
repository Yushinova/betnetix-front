"use client";

import { Avatar } from "@heroui/react";
import styles from "./MobileCommentsView.module.css";

interface MobileCommentsViewProps {
  comments: any[];
}

export default function MobileCommentsView({ comments }: MobileCommentsViewProps) {
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return 'Unknown';
    if (!lastName) return firstName;
    return `${lastName} ${firstName.charAt(0)}.`;
  };

  return (
    <div className={styles.mobileTable}>
      {/* Список карточек комментариев */}
      <div className={styles.cardsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            {/* Верхняя часть: аватар + автор */}
            <div className={styles.commentHeader}>
              <Avatar className={styles.avatar}>
                <Avatar.Image 
                  alt={`${comment.user?.firstName} ${comment.user?.lastName}`}
                  src={comment.user?.image || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
                />
                <Avatar.Fallback>
                  {comment.user?.firstName?.[0]}{comment.user?.lastName?.[0]}
                </Avatar.Fallback>
              </Avatar>
              <div className={styles.authorInfo}>
                <div className={styles.authorName}>
                  {getDisplayName(comment.user?.firstName || '', comment.user?.lastName || '')}
                </div>
                <div className={styles.authorEmail}>
                  {comment.user?.email}
                </div>
              </div>
            </div>

            {/* Нижняя часть: комментарий */}
            <div className={styles.commentBody}>
              <div className={styles.commentText}>{comment.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}