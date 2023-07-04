type WebRtcEvents = 'meet:msg' | 'set-toggle' | 'identify-stream' | 'track:end' | 'track:toggle' | 'track:toggle-init';

export default class WebRtcDto<T = any> {
  readonly event: WebRtcEvents;
  readonly data: T;

  constructor(event: WebRtcEvents, data: T) {
    this.event = event;
    this.data = data;
  }

  toString() {
    return JSON.stringify({ event: this.event, data: this.data });
  }
}
