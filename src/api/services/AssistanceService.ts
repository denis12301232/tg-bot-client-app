import $api from "../index";
import { AxiosResponse } from "axios";
import { HumansList, AssistanceFormsList } from "@/intefaces/http";
import { AssistanceForm } from "@/intefaces/interfaces";


export default class AssistanceService {
   static async catchHumansList({ limit, page }: any): Promise<AxiosResponse<HumansList>> {
      return $api.get<HumansList>('/assistance/list', {
         params: { limit, page },
      });
   }

   static async findHuman(fio: string): Promise<AxiosResponse<AssistanceFormsList>> {
      return $api.post<AssistanceFormsList>('/assistance/info', { fio });
   }

   static async sendForm(form: AssistanceForm) {
      return $api.post('/assistance', { form });
   }

   static async deleteHuman(id: string) {
      return $api.delete('/assistance/delete/human', {
         data: { id }
      });
   }

   static async modifyAssistanceForm(form: AssistanceForm, id: string) {
      return $api.patch('/assistance/modify/form', {
         form, id
      });
   }
}