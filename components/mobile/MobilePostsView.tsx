"use client";

import { useState, useMemo } from "react";
import PostCard from "../common/PostCard";
import styles from "./MobilePostsView.module.css";

interface MobilePostsViewProps {
  posts: any[];
  onViewComments?: (postId: number) => void;
}

type SortField = 'id' | 'views' | 'likes' | 'comments';
type SortOrder = 'asc' | 'desc';

export default function MobilePostsView({ posts, onViewComments }: MobilePostsViewProps) {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'views', label: 'Просмотры' },
    { value: 'likes', label: 'Лайки' },
    { value: 'comments', label: 'Комментарии' }
  ];

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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newField = e.target.value as SortField;
    if (sortField === newField) {
      // Меняем порядок при повторном выборе
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(newField);
      setSortOrder('desc');
    }
  };

  return (
    <div className={styles.mobileTable}>
      {/* Панель сортировки */}
      <div className={styles.sortPanel}>
        <span className={styles.sortLabel}>Сортировать по</span>
        <select 
          className={styles.sortSelect}
          value={sortField}
          onChange={handleSortChange}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Список карточек */}
      <div className={styles.cardsList}>
        {sortedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onViewComments={onViewComments}
          />
        ))}
      </div>
    </div>
  );
}