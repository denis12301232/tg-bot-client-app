import { AssistanceForm, IUser } from './interfaces'

export interface HumansList {
   humansList: Array<{ fio: string, _id: string }>
}

export interface AssistanceFormsList {
   humansFormList: Array<{ form: AssistanceForm, _id: string }>
}

export interface AuthResponse {
   accessToken: string,
   refreshToken: string,
   user: IUser,
}

export interface SendFormResponse {
   message: string,
   saved: AssistanceForm & { _id: string }
}