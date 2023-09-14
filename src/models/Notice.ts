interface Data {
  id?: string;
  title: string;
  time?: Date;
  text: string;
  show?: boolean;
}

export default class Notice {
  readonly id: string;
  readonly title: string;
  readonly time: Date;
  readonly text: string;
  show: boolean;

  constructor({ id, time, title, text, show }: Data) {
    this.id = id || Date.now().toString() + Math.random();
    this.title = title;
    this.time = time || new Date();
    this.text = text;
    this.show = show !== undefined ? show : true;
  }
}
