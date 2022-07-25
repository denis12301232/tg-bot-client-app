import { AssistanceForm } from "./interfaces"

export interface HumansList {
   humansList: Array<{ fio: string, _id: string }>
}

export interface AssistanceFormsList {
   humansFormList: Array<{ form: AssistanceForm, _id: string }>
}