import type { AssistanceResponse, Langs, PaginationRequest } from '@/types';
import { $api } from '@/api';

export default class AssistanceService {
  static saveForm(form: Omit<AssistanceResponse, '_id'>) {
    return $api.post('assistance', { json: form });
  }
  static getForms({ page, limit, sort, descending }: PaginationRequest) {
    return $api.get('assistance/forms', { searchParams: { page, limit, sort, descending } });
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

  static saveFormsToSheet(
    locale: Langs,
    filters: {
      street?: string;
      district?: string;
      birth: { from: number; to: number };
    }
  ) {
    return $api.post('assistance/sheet', { json: { locale, filters } });
  }

  static getStats(filters: { by: 'month' | 'year'; timestamp: number }) {
    return $api.get('assistance/stats', { searchParams: filters });
  }

  static updateForm(form: Omit<AssistanceResponse, '_id'>, id: string) {
    return $api.patch('assistance', { json: { form, id } });
  }

  static createReport(
    locale: Langs,
    type: 'xlsx' | 'csv' | 'google-sheets',
    filters: { street?: string; district?: string; birth: { from: number; to: number } }
  ) {
    return $api.post('assistance/report', { json: { locale, type, filters: filters } });
  }

  static uploadFormsListCSV(formData: FormData) {
    return $api.post('assistance/list', { body: formData });
  }
}
