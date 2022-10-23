import Constants from "@/libs/Constants";
import { AssistanceFormValidators } from "@/intefaces/interfaces";

export default class AssistanseFormDto {

   [name: string]: any,

   constructor(form: AssistanceFormValidators) {
      const allFields = <Array<keyof typeof Constants.assistance>>Object.keys(Constants.assistance);

      for (const item of allFields) {
         if (item === 'children_age' || item === 'people_fio') {
            if (!form[item].value.length) continue;
            this[item] = [];
            form[item].value.map((elem) => this[item].push(elem));
            continue;
         }
         if (item === 'phone') {
            this[item] = '+380' + form[item].value;
            continue;
         }
         if (!form[item].value) continue;
         this[item] = form[item].value;
      }
   }
}