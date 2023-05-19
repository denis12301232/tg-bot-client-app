import $api from '@/api'


export default class MeetService {
   static getMeetInfo(meetId: string) {
      return $api.get<{ title: string }>('/meet/info', { params: { meetId } });
   }
}