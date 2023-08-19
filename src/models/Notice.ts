export default class Notice<T = null> {
  readonly id: string;
  readonly title: string;
  readonly data: T | null;
  readonly time: Date | string;
  readonly text: string;

  constructor(title: string, text: string, opts?: { data?: T }) {
    this.id = Date.now().toString();
    this.title = title;
    this.data = opts?.data || null;
    this.time = new Date();
    this.text = text;
  }
}
