import type { Responses, Q } from '@/types';
import { $api } from '@/api';

export default class AssistanceService {
  static store(json: Omit<Responses.Assistance, '_id' | 'sector'>) {
    return $api.post('assistance', { json });
  }

  static destroy(json: string[]) {
    return $api.delete('assistance', { json });
  }

  static catch(json: Q.PaginationRequest) {
    return $api.post('assistance/catch', { json });
  }

  static update(formId: string, json: Omit<Responses.Assistance, '_id'>) {
    return $api.patch(`assistance/${formId}`, { json });
  }

  static show(formId: string) {
    return $api.get(`assistance/${formId}`);
  }

  static saveFormsToSheet(locale: string, ids: string[]) {
    return $api.post('assistance/sheet', { json: { locale, ids } });
  }

  static getStats(filters: { by: 'month' | 'year'; timestamp: number }) {
    return $api.get('assistance/stats', { searchParams: filters });
  }

  static getStatsPdf(formData: FormData) {
    return $api.post('assistance/stats/pdf', { body: formData });
  }

  static createReport(locale: string, type: 'xlsx' | 'csv' | 'google-sheets', ids: string[]) {
    return $api.post('assistance/report', { json: { locale, type, ids } });
  }

  static uploadFormsListCSV(formData: FormData, locale: string) {
    return $api.post('assistance/list', { body: formData, searchParams: { locale } });
  }
}
