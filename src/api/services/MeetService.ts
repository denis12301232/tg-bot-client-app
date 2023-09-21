import { $api } from '@/api';

export default class MeetService {
  static create(json: { title: string; invited: string[] }) {
    return $api.post('meets/create', { json });
  }

  static show(meetId: string) {
    return $api.get(`meets/${meetId}`);
  }

  static update(meetId: string, json: { title?: string; invited?: string[] }) {
    return $api.patch(`meets/${meetId}`, { json });
  }

  static join(meetId: string) {
    return $api.get(`meets/${meetId}/join`);
  }

  static leave(meetId: string) {
    return $api.get(`meets/${meetId}/leave`);
  }

  static invite(meetId: string, json: string[]) {
    return $api.post(`meets/${meetId}/invite`, { json });
  }
}
