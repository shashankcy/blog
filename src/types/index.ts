export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  blogId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
}