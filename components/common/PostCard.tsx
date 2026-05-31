"use client";

import { Avatar, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: any;
  onViewComments?: (postId: number) => void;
}

export default function PostCard({ post, onViewComments }: PostCardProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const truncateText = (text: string, maxLength: number = 100) => {
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

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleViewComments = () => {
    if (onViewComments) {
      onViewComments(post.id);
    } else {
      router.push(`/comments/${post.id}`);
    }
  };

  return (
    <div className={styles.card}>
      {/* Левая часть */}
      <div className={styles.leftSection}>
        {/* ID поста */}
        <div className={styles.postId}>{post.id}</div>
        
        {/* Автор */}
        <div className={styles.authorWrapper}>
          <Avatar className={styles.avatar}>
            <Avatar.Image 
              alt={post.authorName}
              src={post.authorImage || "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"}
            />
            <Avatar.Fallback>
              {post.authorName?.charAt(0) || '?'}
            </Avatar.Fallback>
          </Avatar>
          <div className={styles.name}>{getDisplayName(post.authorName)}</div>
        </div>

        {/* Заголовок поста */}
        <div className={styles.postTitle}>{truncateText(post.title, 60)}</div>

        {/* Текст поста */}
        <div className={styles.postBody}>{truncateText(post.body, 100)}</div>

        {/* Нижний див со статистикой */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <img src="https://storage.yandexcloud.net/backet-online-storage/test/eye.png"
            alt="Просмотры" className={styles.statIcon} />
            <span className={styles.statValue}>{post.views || 0}</span>
          </div>
          <div className={styles.statItem}>
            <img src="https://storage.yandexcloud.net/backet-online-storage/test/heart.png" alt="Лайки" className={styles.statIcon} />
            <span className={styles.statValue}>{post.reactions?.likes || 0}</span>
          </div>
          <div className={styles.statItem}>
            <img src="https://storage.yandexcloud.net/backet-online-storage/test/comment.png" alt="Комментарии" className={styles.statIcon} />
            <span className={styles.statValue}>{post.commentsCount || 0}</span>
          </div>
        </div>
      </div>

      {/* Правая часть - кнопка комментариев */}
      <div className={styles.rightSection}>
        <div className={styles.menuContainer}>
          <Button
            isIconOnly
            size="sm"
            className={styles.menuButton}
            onClick={handleViewComments}
          >
            <img 
              src="/arrow-circle-right.png"
              alt="Комментарии"
              width={20}
              height={20}
              className={styles.commentIcon}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}