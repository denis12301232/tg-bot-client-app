import { ref } from "vue"
import { AlertType } from "@/intefaces/interfaces"

export function useAlert() {
   const type = ref<AlertType>('success');
   const message = ref('');
   const isVisible = ref(false);

   function showAlert() {
      isVisible.value = !isVisible.value;
   }

   function setAlert(alertType: AlertType, newMessage: string) {
      type.value = alertType;
      message.value = newMessage || 'Неизвестная ошибка!';
   }

   return { type, message, isVisible, showAlert, setAlert }
}