import { create } from 'zustand';
import { CommentWithUser } from '@/types/comment';
import { getCommentsWithUsers, getPaginatedComments } from '@/services/mockComments';

interface CommentStore {
  comments: CommentWithUser[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPostId: number | null;
  itemsPerPage: number;
  
  setItemsPerPage: (itemsPerPage: number) => void;
  fetchComments: (postId: number, limit?: number, skip?: number) => Promise<void>;
  clearComments: () => void;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  comments: [],
  total: 0,
  isLoading: false,
  error: null,
  currentPostId: null,
  itemsPerPage: 10,

  setItemsPerPage: (itemsPerPage: number) => {
    set({ itemsPerPage });
  },

  fetchComments: async (postId: number, limit = 100, skip = 0) => {
    console.log('🔍 fetchComments called', { postId, limit, skip });
    set({ isLoading: true, error: null, currentPostId: postId });
    
    try {
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Получаем комментарии из мока
      const allComments = getCommentsWithUsers(postId);
      const paginatedComments = allComments.slice(skip, skip + limit);
      
      console.log('📡 fetchComments result:', paginatedComments.length);
      
      set({
        comments: paginatedComments,
        total: allComments.length,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('❌ fetchComments error:', error);
      set({
        error: error.message || 'Ошибка загрузки комментариев',
        isLoading: false,
      });
    }
  },

  clearComments: () => {
    set({
      comments: [],
      total: 0,
      currentPostId: null,
    });
  },
}));