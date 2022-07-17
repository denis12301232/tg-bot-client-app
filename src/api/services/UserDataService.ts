import $api from "../index";
import { AxiosResponse } from "axios";
import { HumansList, HumansFormList } from "@/intefaces/http";
import { AssistanceForm  } from "@/intefaces/AssistanceForm";


export default class UserDataService {
   static async catchHumansList({ limit, page }: any): Promise<AxiosResponse<HumansList>> {
      return $api.get<HumansList>('/assistance/list', {
         params: { limit, page },
      });
   }

   static async findHuman(fio: string): Promise<AxiosResponse<HumansFormList>> {
      return $api.post<HumansFormList>('/assistance/info', { fio });
   }

   static async sendForm(form: AssistanceForm ) {
      return $api.post('/assistance', { form });
   }
}