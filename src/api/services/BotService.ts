import { $backend } from '@/api';

export default class BotService {
  static assistance(queryId: string, message: string) {
    $backend.post('bot/assistance', { json: { queryId, message } });
  }
}
