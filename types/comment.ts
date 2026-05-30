import type { User } from './user';

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
  createdAt: string;
}

export interface CommentWithUser extends Comment {
  user: User; // используем существующий тип User
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}