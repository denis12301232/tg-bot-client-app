import { $api } from '@/api';

export default class MeetService {
  static index() {
    return $api.get('notices');
  }

  static store(json: { title: string; text: string; show?: boolean }) {
    return $api.post(`notices`, { json });
  }

  static update(id: string, json: { show: boolean }) {
    return $api.patch(`notices/${id}`, { json });
  }

  static clear() {
    return $api.delete('notices');
  }

  static destroy(id: string) {
    return $api.delete(`notices/${id}`);
  }
}
