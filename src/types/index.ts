export interface User {
  id: number,
  name: string,
  email: string,
}


export interface createRoom {
  name: string;
  description?: string;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  unreadCount?: number;
  slug: string;
  ownerId: number;
  users?: User[];
  _count?: {
    users: number;
  }
}

export interface createMessage {
  content?: string;
  file?: File;
}

export interface Message {
  id: number;
  content: string | null;
  fileUrl: string | null;
  fileType: 'image' | 'video' | 'audio' | 'document' | null;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  roomId: number;
  user?: User;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}