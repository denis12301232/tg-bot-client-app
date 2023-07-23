import type { AssistanceResponse, Langs, PaginationRequest } from '@/types';
import { $api } from '@/api';

export default class AssistanceService {
  static saveForm(form: Omit<AssistanceResponse, '_id' | 'sector'>) {
    return $api.post('assistance', { json: form });
  }
  static getForms({ page, limit, sort, descending, filter }: PaginationRequest) {
    return $api.post('assistance/forms', { json: { page, limit, sort, descending, filter } });
  }

  static deleteForms(ids: string[]) {
    return $api.delete('assistance/forms', { json: ids });
  }

  static findForms(nameOrSurname: string, limit: number, page: number) {
    return $api.get('assistance', { searchParams: { nameOrSurname, limit, page } });
  }

  static getFormById(formId: string) {
    return $api.get('assistance/id', { searchParams: { id: formId } });
  }

  static saveFormsToSheet(locale: Langs, ids: string[]) {
    return $api.post('assistance/sheet', { json: { locale, ids } });
  }

  static getStats(filters: { by: 'month' | 'year'; timestamp: number }) {
    return $api.get('assistance/stats', { searchParams: filters });
  }

  static updateForm(form: Omit<AssistanceResponse, '_id'>, id: string) {
    return $api.patch('assistance', { json: { form, id } });
  }

  static createReport(locale: Langs, type: 'xlsx' | 'csv' | 'google-sheets', ids: string[]) {
    return $api.post('assistance/report', { json: { locale, type, ids } });
  }

  static uploadFormsListCSV(formData: FormData, locale: Langs) {
    return $api.post('assistance/list', { body: formData, searchParams: { locale } });
  }
}
