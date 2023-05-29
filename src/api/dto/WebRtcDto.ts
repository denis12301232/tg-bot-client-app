type WebRtcEvents = 'meet:msg' | 'set-toggle' | 'identify-stream' | 'track:end' | 'track:toggle' | 'track:toggle-init';


export default class WebRtcDto {
   readonly event: WebRtcEvents;
   readonly data: any;

   constructor(event: WebRtcEvents, data: any) {
      this.event = event;
      this.data = data;
   }

   toString() {
      return JSON.stringify({ event: this.event, data: this.data });
   }
}