import type { Responses, Q } from '@/types';
import { $api } from '@/api';

export default class AssistanceService {
  static store(json: Omit<Responses.Assistance, '_id' | 'sector'>) {
    return $api.post('assistance', { json }).json<Responses.Assistance>();
  }

  static destroy(json: string[]) {
    return $api.delete('assistance', { json }).json<{ acknowledged: boolean; deletedCount: number }>();
  }

  static catchQ(json: Q.PaginationRequest) {
    return $api.post('assistance/catch', { json });
  }

  static update(formId: string, json: Omit<Responses.Assistance, '_id'>) {
    return $api.patch(`assistance/${formId}`, { json }).json<null>();
  }

  static show(formId: string) {
    return $api.get(`assistance/${formId}`).json<Omit<Responses.Assistance, '_id'>>();
  }

  static saveFormsToSheet(ids: string[]) {
    return $api.post('assistance/sheet', { json: { ids } }).json<{ link: string }>();
  }

  static getStats(filters: { by: 'month' | 'year'; timestamp: number }) {
    return $api.get('assistance/stats', { searchParams: filters }).json<object>();
  }

  static getStatsPdf(formData: FormData) {
    return $api.post('assistance/stats/pdf', { body: formData }).blob();
  }

  static createReport(type: 'xlsx' | 'csv', ids: string[]) {
    return $api.post('assistance/report', { json: {  type, ids } }).blob();
  }

  static uploadFormsCSV(formData: FormData, locale: string) {
    return $api
      .post('assistance/list', { body: formData, searchParams: { locale } })
      .json<{ created: number; errors: { message: string; row: number }[] }>();
  }
}
