export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  views: number;
  reactions: {
    likes: number;
    dislikes: number;
  };
}

// Расширенный тип с данными автора
export interface PostWithAuthor extends Post {
  authorName: string;
  authorEmail: string;
  authorImage?: string;
  commentsCount: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}