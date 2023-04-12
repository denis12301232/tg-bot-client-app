type WebRtcEvents = 'meet:msg' | 'toggle-track';


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