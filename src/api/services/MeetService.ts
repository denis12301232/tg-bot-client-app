import { $api } from '@/api';

export default class MeetService {
  static show(meetId: string) {
    return $api.get(`meet/${meetId}`);
  }
}
