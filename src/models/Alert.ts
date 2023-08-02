import type { IAlertType } from '@/types';

export default class Alert {
  readonly id: string;
  readonly message: string;
  readonly type: IAlertType;

  constructor(type: IAlertType, message: string) {
    this.id = Date.now().toLocaleString();
    this.type = type;
    this.message = message;
  }
}
