import type { INotice } from '@/types';
import { $api } from '@/api';

export default class MeetService {
  static index() {
    return $api.get('notices').json<INotice[]>();
  }

  static store(json: { title: string; text: string; show?: boolean }) {
    return $api.post(`notices`, { json }).json<INotice>();
  }

  static update(id: string, json: { show: boolean }) {
    return $api.patch(`notices/${id}`, { json }).json<null>();
  }

  static clear() {
    return $api.delete('notices').json<null>();
  }

  static destroy(id: string) {
    return $api.delete(`notices/${id}`).json<null>();
  }
}
