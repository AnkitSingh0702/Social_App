export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface FriendRequest {
  _id: string;
  from: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Post {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  image: string;
  imageUrl?: string;
  caption: string;
  likes: string[];
  createdAt: string;
} 