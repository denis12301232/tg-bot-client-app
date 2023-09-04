import { $api } from '@/api';

export default class UserService {
  static getUser(id: string) {
    return $api.get(`users/${id}`);
  }

  static getUsers({ page, limit, filter }: { page: number; limit: number; filter: string }) {
    return $api.get('users', { searchParams: { limit, page, filter } });
  }
}
