export function useBeautifyValue(value: string | number | boolean | string[] | undefined) {
   if (Array.isArray(value)) {
      return value.join(", ");
   }
   else if (value === true) {
      return "Да";
   }
   else if (value === false) {
      return "Нет";
   }
   else {
      return value;
   }
}
