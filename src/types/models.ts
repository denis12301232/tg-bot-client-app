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

export interface IMeet {
  _id: string;
  invited: [];
  members: [];
  title: string;
  roles: { [name: string]: string[] };
}

export interface INotice {
  _id: string;
  user: string;
  text: string;
  title: string;
  show: boolean;
  createdAt: string;
}

export interface IAlert {
  _id: string;
  message: string;
  visible: boolean;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface ITask {
  _id: string;
  title: string;
  tags: string[];
  status: 'untaken' | 'performed' | 'canceled' | 'completed';
  subtasks: ISubtask[];
  user: IUser;
  createdAt: string;
}

export interface ISubtask {
  _id: string;
  title: string;
  description: string;
  status: ITask['status'];
  cause: string;
}

export interface IMessage {
  _id: string;
  chatId: string;
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

export interface Streams {
  screen: Map<string, MediaStream>;
  camera: Map<string, MediaStream>;
}
