import $api from '../index'
import { AxiosResponse } from 'axios'
import AssistanceFormDto from '@/api/dtos/AssistanseFormDto'
import { HumansList, AssistanceFormsList, SendFormResponse } from '@/intefaces/http'


export default class AssistanceService {
   static async catchHumansList({ limit, page }: any): Promise<AxiosResponse<HumansList>> {
      return $api.get<HumansList>('/assistance/list', { params: { limit, page } });
   }

   static async findHuman(surname: string, name: string, patronymic: string,): Promise<AxiosResponse<AssistanceFormsList>> {
      return $api.post<AssistanceFormsList>('/assistance/info', { name, patronymic, surname });
   }

   static async sendForm(form: AssistanceFormDto): Promise<AxiosResponse<SendFormResponse>> {
      return $api.post<SendFormResponse>('/assistance', { form });
   }

   static async deleteHuman(id: string): Promise<void> {
      return $api.delete('/assistance/delete/human', { data: { id } });
   }

   static async modifyAssistanceForm(form: AssistanceFormDto, id: string): Promise<void> {
      return $api.patch('/assistance/modify/form', { form, id });
   }

   static async saveFormsToSheet(filter: string, query: string): Promise<AxiosResponse<{ message: string, link: string }>> {
      return $api.get('/assistance/sheet', { params: { filter, query } });
   }
}