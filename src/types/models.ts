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

type TaskStatus = 'untaken' | 'performed' | 'canceled' | 'completed';

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

export interface IMessage {
  _id: string;
  chat_id: string;
  author: string;
  text: string;
  attachments: IAttachment[];
  read: string[];
  createdAt: string;
  reactions: { [name: string]: string[] };
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
