export interface WsMessage<T = any> {
   event: WsEvent;
   payload: T;
}

export type WsEvent = 'message' | 'chats_list' | 'open_chat' | 'read' | 'update_status'
   | 'invite_to_group' | 'kick_from_group';

export interface ITask {
   _id: string;
   title: string;
   description: string;
   tags: string[];
   date: string;
   status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';
   user: IUser | string;
}

export interface IChat {
   _id: string;
   users: IUser[];
   messages: IMessage[];
   updatedAt: string;
}

export interface IAttachment {
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
   name: string;
   surname: string;
   patronymic: string;
   phone: string;
   birth: string;
   district: string;
   street: string;
   house: string;
   flat: string;
   people_num: string;
   people_fio: string[];
   invalids: string;
   kids: string;
   kids_age: string[];
   food: string;
   water: string;
   medicines: string;
   medicines_info: string;
   hygiene: string;
   hygiene_info: string;
   pampers: string;
   pampers_info: string;
   diet: string;
   pers_data_agreement: boolean;
   photo_agreement: boolean;
}