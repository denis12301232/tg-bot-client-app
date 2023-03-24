import type { AssistanceForm, HumansList } from '@/types'
import $api from '@/api'


export default class AssistanceService {
   static async catchHumansList({ limit, page, filter, sort, descending }: { limit: number, page: number, filter: string, sort: string, descending: boolean }) {
      return $api.get<HumansList[]>('/assistance/list', { params: { limit, page, filter, sort, descending } });
   }

   static async getForms(nameOrSurname: string, limit: number, page: number) {
      return $api.get<{ form: AssistanceForm, _id: string }[]>('/assistance',
         { params: { nameOrSurname, limit, page },  });
   }

   static async getFormById(form_id: string) {
      return $api.get<AssistanceForm>('/assistance/id', { params: { id: form_id } });
   }

   static async sendForm(form: any) {
      return $api.post<{ message: string }>('/assistance', form);
   }

   static async deleteFormById(id: string) {
      return $api.delete('/assistance', { data: { id } });
   }

   static async modifyAssistanceForm(form: any, id: string) {
      return $api.patch('/assistance', { form, id });
   }

   static async saveFormsToSheet(filters: { district: string, birth: { from: number, to: number } }) {
      return $api.post<{ message: string, link: string }>('/assistance/sheet', filters);
   }
}