import type { IUser } from '@/types/interfaces'


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
