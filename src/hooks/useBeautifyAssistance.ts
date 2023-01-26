export function useBeautifyAssistance(value: any) {
   if (Array.isArray(value)) {
      return value.length ? value.join(',') : '-';
   }
   else if (value === true) {
      return 'Да';
   }
   else if (value === false) {
      return 'Нет';
   } else if (!value) {
      return '-'
   } else {
      return value;
   }
}