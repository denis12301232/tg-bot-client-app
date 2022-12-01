import { AssistanceForm, IUser } from './interfaces'

export interface ImagesResponse {
   images: { link: string }[];
   pageToken?: string;
}

export interface HumansListResponse {
   humansList:HumansList[];
}

export interface HumansList {
   _id: string;
   fio: string;
}

export interface FormsListResponse {
   humansFormList: FormsList[];
}

export interface FormsList {
   form: AssistanceForm;
   _id: string;
}

export interface AuthResponse {
   accessToken: string;
   refreshToken: string;
   user: IUser;
}

export interface SendFormResponse {
   message: string;
   saved: AssistanceForm & { _id: string };
}