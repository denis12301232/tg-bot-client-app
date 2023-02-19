import type { IUser, IChat } from '@/types/interfaces'

export interface ChatResponse extends IChat {
   companion: IUser;
   unread: number;
   total: number;
   type: 'dialog' | 'group';
   members_count: number;
   group: {
      _id: string;
      title: string;
      avatar: string;
      roles: { [name: string]: string[] };
   }
}

export interface AuthResponse {
   accessToken: string;
   refreshToken: string;
   user: IUser;
}

export interface HumansList {
   _id: string;
   fio: string;
}

export interface ImagesResponse {
   images: { link: string }[];
   pageToken?: string;
}
