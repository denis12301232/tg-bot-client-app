export default class Util {
   static debounceDecorator(f: Function, ms: number) {
      let isCooldown = false;

      return function (this: any) {
         if (isCooldown) return;
         f.apply(this, arguments);
         isCooldown = true;
         setTimeout(() => isCooldown = false, ms);
      };
   }

   static async copyTextToClipboard(text: string) {
      if (navigator.clipboard) {
         return navigator.clipboard.writeText(text)
            .then(() => 'Скопировано')
            .catch(e => 'Ошибка');
      } else {
         const textArea = document.createElement('textarea');
         textArea.style.cssText = `position: fixed;top: -9999px;left: -9999px;`
         textArea.value = text;
         document.appendChild(textArea);
         textArea.focus();
         textArea.select();
         const success = document.execCommand('copy');
         document.body.removeChild(textArea);
         return success ? Promise.resolve('Скопировано') : Promise.reject('Ошибка')
      }
   }
}