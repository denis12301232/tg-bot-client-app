import type { QUploaderFactoryObject } from 'quasar';
import type { IComment, Responses } from '@/types';
import { $api } from '@/api';
import { ENV } from '@/util';

export default class ImageService {
  static index(params: { skip: number; limit: number; sort: string; descending: boolean }) {
    return $api.get('images', { searchParams: params }).json<Responses.Images>();
  }

  static uploadImages(): QUploaderFactoryObject {
    return {
      url: ENV.API_V1 + '/images',
      method: 'POST',
      headers: [{ name: 'Authorization', value: `Bearer ${localStorage.getItem('token')}` }],
      withCredentials: true,
    };
  }

  static destroy(ids: string[]) {
    return $api.delete('images', { json: ids, timeout: 6e5 }).json<string[]>();
  }

  static update(id: string, description: string) {
    return $api.patch(`images/${id}`, { json: { description } }).json<null>();
  }

  static getComments(mediaId: string, params: { skip: number; limit: number; sort: string; descending: boolean }) {
    return $api.get(`images/${mediaId}/comments`, { searchParams: params }).json<Responses.Comments>();
  }

  static saveComment(mediaId: string, text: string) {
    return $api.post(`images/${mediaId}/comments`, { json: { text } }).json<IComment>();
  }

  static updateComment(id: string, json: { reactions: string[] }) {
    return $api.patch(`images/comments/${id}`, { json }).json<null>();
  }
}
