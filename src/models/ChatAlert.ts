import type { Responses, IAttachment, IMessage, IUser } from '@/types';
import Alert from './Alert';

export default class ChatAlert extends Alert {
  readonly chatId: string;
  readonly author: IUser;
  readonly attachments: IAttachment[];
  readonly group: Responses.Chat['group'] | null = null;

  constructor(msg: IMessage, author: IUser, chat: Responses.Chat) {
    super('info', msg.text);
    this.attachments = msg.attachments;
    this.chatId = msg.chat_id;
    this.author = author;
    this.group = chat.group;
  }

  set Message(text: string) {
    this.message = text;
  }
}
