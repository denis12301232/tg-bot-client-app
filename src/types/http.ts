import { IUser, IChat } from '@/types';

export interface ListResponse {
  _id: string;
  fio: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface AssistanceResponse {
  _id: string;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  birth: string;
  district: string;
  street: string;
  house: string;
  flat: string;
  people_num: number;
  people_fio: string[];
  invalids: boolean;
  kids: boolean;
  kids_age: string[];
  food: boolean;
  water: boolean;
  medicines: boolean;
  medicines_info: string;
  hygiene: boolean;
  hygiene_info: string;
  pampers: boolean;
  pampers_info: string;
  diet: string;
  pers_data_agreement: boolean;
  photo_agreement: boolean;
}

export type UploadImagesResponse = { link: string; fileId: string }[];

export interface ImagesResponse {
  images: { link: string; fileId: string }[];
  pageToken?: string;
}

export interface ChatResponse extends IChat {
  companion: IUser;
  unread: number;
  total: number;
  type: 'dialog' | 'group';
  members_count: number;
  typing: { [name: string]: string };
  group: {
    _id: string;
    title: string;
    avatar: string;
    about: string;
    roles: { [name: string]: string[] };
  };
}
