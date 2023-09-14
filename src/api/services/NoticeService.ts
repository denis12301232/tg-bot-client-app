import type { Notice } from '@/models';
import { $api } from '@/api';

export default class MeetService {
  static index() {
    return $api.get('notices');
  }

  static store(json: Notice) {
    return $api.post(`notices`, { json });
  }

  static clear() {
    return $api.delete('notices');
  }

  static destroy(id: string) {
    return $api.delete(`notices/${id}`);
  }
}
