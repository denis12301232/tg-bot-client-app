import { AssistanceFormValidators } from '@/interfaces/interfaces'
import Constants from '@/libs/Constants'

export function useDefaultValues(form: AssistanceFormValidators) {
   (<Array<keyof typeof Constants.assistance>>Object.keys(Constants.assistance))
      .forEach((key) => {
         form[key].value = Constants.assistance[key].default;
         form[key].touched = false;
      });
}