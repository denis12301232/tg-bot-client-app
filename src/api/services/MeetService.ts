import { $api } from '@/api';

export default class MeetService {
  static getMeetInfo(meetId: string) {
    return $api.get('meet/info', { searchParams: { meetId } });
  }
}
