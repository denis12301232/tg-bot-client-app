import type { IUser, IChat } from '@/types';

export namespace Responses {
  export interface List {
    _id: string;
    fio: string;
  }

  export interface Login {
    accessToken: string;
    refreshToken: string;
    user: IUser;
  }
  export interface Assistance {
    _id: string;
    name: string;
    surname: string;
    patronymic: string;
    phone: string;
    birth: string;
    district: number | null;
    street: number | null;
    house: string;
    flat: number | null;
    peopleCount: number;
    peopleFio: string[];
    invalids: boolean;
    kids: boolean;
    kidsAge: string[];
    food: boolean;
    water: boolean;
    medicines: boolean;
    medicinesInfo: string;
    hygiene: boolean;
    hygieneInfo: string;
    pampers: boolean;
    pampersInfo: string;
    extraInfo: string;
    personalDataAgreement: boolean;
    photoAgreement: boolean;
    sector: string;
  }

  export type UploadImages = { link: string; fileId: string; description: string }[];

  export interface Images {
    images: {
      _id: string;
      fileName: string;
      description: string;
      mimetype: string;
      ext: string;
    }[];
    count: number;
  }

  export interface Chat extends IChat {
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
}
