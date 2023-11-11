import type { Responses, IComment } from '@/types';
import { $api } from '@/api';

export default class CommentService {
  static index(params: { mediaId: string; skip: number; limit: number; sort: string; descending: boolean }) {
    return $api.get(`images/comments`, { searchParams: params }).json<Responses.Comments>();
  }

  static store(json: { mediaId: string; text: string }) {
    return $api.post(`images/comments`, { json }).json<IComment>();
  }

  static update(id: string, json: { reactions: string[] }) {
    return $api.patch(`images/comments/${id}`, { json }).json<null>();
  }
}
