import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { postApi } from '@/services/apiSwitcher';
import type { PostWithAuthor } from '@/types/post';

interface PostStore {
  posts: PostWithAuthor[];
  allPosts: PostWithAuthor[];
  total: number;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  itemsPerPage: number;
  isInitialized: boolean;
  isHydrated: boolean; // Добавляем флаг гидратации
  
  setItemsPerPage: (itemsPerPage: number) => void;
  fetchPosts: (limit?: number, skip?: number) => Promise<void>;
  searchPosts: (query: string) => void;
  clearSearch: () => void;
  initialize: () => Promise<void>;
  reset: () => void;
  setHydrated: (state: boolean) => void;
}

export const usePostStore = create<PostStore>()(
  persist(
    (set, get) => ({
      posts: [],
      allPosts: [],
      total: 0,
      isLoading: false,
      error: null,
      searchQuery: '',
      itemsPerPage: 10,
      isInitialized: false,
      isHydrated: false,

      setHydrated: (state: boolean) => {
        set({ isHydrated: state });
      },

      initialize: async () => {
        const { isInitialized, fetchPosts, allPosts, isHydrated } = get();
        
        console.log('🔍 initialize called', { 
          isInitialized, 
          allPostsLength: allPosts.length, 
          isHydrated 
        });
        
        // Если данные уже есть в store и store гидратирован, не загружаем
        if (allPosts.length > 0 && isHydrated) {
          console.log('✅ Данные уже есть в store, не загружаем', allPosts.length);
          return;
        }
        
        if (!isInitialized || allPosts.length === 0) {
          console.log('🔄 Загружаем данные...');
          await fetchPosts(100, 0);
          set({ isInitialized: true });
        }
      },

      reset: () => {
        set({
          posts: [],
          allPosts: [],
          total: 0,
          searchQuery: '',
          isInitialized: false,
        });
        localStorage.removeItem('post-storage');
      },

      setItemsPerPage: (itemsPerPage: number) => {
        set({ itemsPerPage });
      },

      fetchPosts: async (limit = 100, skip = 0) => {
        console.log('🔍 fetchPosts called', { limit, skip });
        set({ isLoading: true, error: null });
        try {
          const result = await postApi.getPostsWithDetails(limit, skip);
          console.log('📡 fetchPosts result:', result.posts.length);
          set({
            allPosts: result.posts,
            posts: result.posts,
            total: result.total,
            isLoading: false,
            isInitialized: true,
          });
        } catch (error: any) {
          console.error('❌ fetchPosts error:', error);
          set({
            error: error.message || 'Ошибка загрузки постов',
            isLoading: false,
          });
        }
      },

      searchPosts: (query: string) => {
        const { allPosts } = get();
        
        if (!query.trim()) {
          set({ 
            posts: allPosts,
            searchQuery: '',
            total: allPosts.length
          });
          return;
        }
        
        console.log('🔍 searchPosts called', { query });
        const filteredPosts = allPosts.filter(post =>
          post.title?.toLowerCase().includes(query.toLowerCase()) ||
          post.body?.toLowerCase().includes(query.toLowerCase()) ||
          post.authorName?.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log('📡 searchPosts filtered:', filteredPosts.length);
        set({
          posts: filteredPosts,
          searchQuery: query,
          total: filteredPosts.length,
        });
      },

      clearSearch: () => {
        const { allPosts } = get();
        set({ 
          searchQuery: '',
          posts: allPosts,
          total: allPosts.length
        });
      },
    }),
    {
      name: 'post-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        allPosts: state.allPosts,
        posts: state.posts,
        total: state.total,
        itemsPerPage: state.itemsPerPage,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('🔄 Гидратация store...', state);
        state?.setHydrated(true);
      },
    }
  )
);