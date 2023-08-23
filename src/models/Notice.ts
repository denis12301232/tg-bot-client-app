export default class Notice<T = null> {
  readonly id: string;
  readonly title: string;
  readonly data: T | null;
  readonly time: Date | string;
  readonly text: string;
  show: boolean;

  constructor(title: string, text: string, opts?: { data?: T; show?: boolean }) {
    this.id = Date.now().toString() + Math.random();
    this.title = title;
    this.data = opts?.data || null;
    this.time = new Date();
    this.text = text;
    this.show = opts?.show || true;
  }
}
