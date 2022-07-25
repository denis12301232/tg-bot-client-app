import { AssistanceFormValidators } from "@/intefaces/interfaces";
import { defaultValues } from "@/libs/constants";

export function useDefaultValues(form: AssistanceFormValidators) {
   Object.entries(defaultValues).forEach(([key, value]) => {
      (<any>form)[key].value = value;
      (<any>form)[key].touched = false;
   });
}