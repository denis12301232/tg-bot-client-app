import type { Responses, Q } from '@/types';
import { $api } from '@/api';

export default class AssistanceService {
  static saveForm(form: Omit<Responses.Assistance, '_id' | 'sector'>) {
    return $api.post('assistance', { json: form });
  }
  static getForms(data: Q.PaginationRequest) {
    return $api.post('assistance/forms', { json: data });
  }

  static deleteForms(ids: string[]) {
    return $api.delete('assistance', { json: ids });
  }

  static search(nameOrSurname: string, limit: number, page: number) {
    return $api.get('assistance/search', { searchParams: { nameOrSurname, limit, page } });
  }

  static getFormById(formId: string) {
    return $api.get(`assistance/${formId}`);
  }

  static saveFormsToSheet(locale: string, ids: string[]) {
    return $api.post('assistance/sheet', { json: { locale, ids } });
  }

  static getStats(filters: { by: 'month' | 'year'; timestamp: number }) {
    return $api.get('assistance/stats', { searchParams: filters });
  }

  static updateForm(form: Omit<Responses.Assistance, '_id'>, id: string) {
    return $api.patch('assistance', { json: { form, id } });
  }

  static createReport(locale: string, type: 'xlsx' | 'csv' | 'google-sheets', ids: string[]) {
    return $api.post('assistance/report', { json: { locale, type, ids } });
  }

  static uploadFormsListCSV(formData: FormData, locale: string) {
    return $api.post('assistance/list', { body: formData, searchParams: { locale } });
  }
}
