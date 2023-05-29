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

export interface ITask {
  _id: string;
  title: string;
  tags: string[];
  status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';
  subtasks: ISubtask[];
  user: IUser;
  createdAt: string;
}

export interface ISubtask {
  _id: string;
  title: string;
  description: string;
  status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена';
  cause: string;
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

export interface IAttachment {
  _id: string;
  name: string;
  ext: string;
  mime: string;
  type: string;
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

export interface IAbonent {
  peer?: RTCPeerConnection;
  channel?: RTCDataChannel;
  info?: IUser;
  polite?: boolean;
}

export type IAlert = 'success' | 'info' | 'warning' | 'error';

export interface Streams {
  screen: Map<string, MediaStream>;
  camera: Map<string, MediaStream>;
}
