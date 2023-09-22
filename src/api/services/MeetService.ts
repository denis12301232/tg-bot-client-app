import type { IMeet } from '@/types';
import { $api } from '@/api';

export default class MeetService {
  static create(json: { title: string; invited: string[] }) {
    return $api.post('meets/create', { json }).json<IMeet>();
  }

  static show(meetId: string) {
    return $api.get(`meets/${meetId}`).json<IMeet>();
  }

  static update(meetId: string, json: { title?: string; invited?: string[] }) {
    return $api.patch(`meets/${meetId}`, { json }).json<null>();
  }

  static join(meetId: string) {
    return $api.get(`meets/${meetId}/join`).json<null>();
  }

  static leave(meetId: string) {
    return $api.get(`meets/${meetId}/leave`).json<null>();
  }

  static invite(meetId: string, json: string[]) {
    return $api.post(`meets/${meetId}/invite`, { json }).json<null>();
  }
}
