export * from './http'

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export type ModalContent = 'create-group' | 'group-info' | 'add-user' | 'open-image' | 'group-settings';
export type TaskStatus = 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';
export interface Pagination {
   sortBy: string;
   descending: boolean;
   page: number;
   rowsPerPage: number;
}

export interface ITask {
   _id: string;
   title: string;
   tags: string[];
   status: TaskStatus;
   subtasks: ISubtask[];
   user: IUser;
   createdAt: string;
}

export interface ISubtask {
   _id: string;
   title: string;
   description: string;
   status: TaskStatus;
   cause: string;
}

export interface IGroup {
   _id: string;
   title: string;
   avatar: string;
   roles: { [name: string]: string[] };
}

export interface IChat {
   _id: string;
   users: IUser[];
   messages: IMessage[];
   updatedAt: string;
   group: IGroup;
}

export interface IAttachment {
   _id: string;
   name: string;
   ext: string;
   mime: string;
   type: string;
}

export interface IMessage {
   _id: string;
   chat_id: string;
   author: string;
   text: string;
   attachments: IAttachment[];
   read: string[];
   createdAt: string;
}

export interface IUser {
   _id: string;
   login: string;
   email: string;
   name: string;
   isActivated: boolean;
   roles: string[];
   avatar: string;
   status: 'online' | 'offline';
}

export interface AssistanceForm {
   _id?: string;
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