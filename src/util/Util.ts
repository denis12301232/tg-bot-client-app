export default class Util {
   static debounceDecorator(f: Function, ms: number) {
      let isCooldown = false;

      return function (this: any, ...args: any) {
         if (isCooldown) return;
         f.apply(this, args);
         isCooldown = true;
         setTimeout(() => isCooldown = false, ms);
      };
   }

   static throttleDecorator(f: Function, ms: number) {
      let isThrottled = false;
      let savedArgs: any = null;
      let savedThis: any = null;

      async function wrapper(this: any, ...args: any) {
         if (isThrottled) {
            savedArgs = args;
            savedThis = this;
            return;
         }

         isThrottled = true;
         await f.apply(this, args);

         setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
               wrapper.apply(savedThis, savedArgs);
               savedArgs = savedThis = null;
            }
         }, ms);
      }
      return wrapper;
   }

   static async copyTextToClipboard(text: string) {
      if (navigator.clipboard) {
         return navigator.clipboard.writeText(text)
            .then(() => 'Скопировано')
            .catch(e => 'Ошибка');
      } else {
         const textArea = document.createElement('textarea');
         textArea.style.cssText = `position: fixed;top: -9999px;left: -9999px;`;
         textArea.value = text;
         document.documentElement.appendChild(textArea);
         textArea.focus();
         textArea.select();
         const success = document.execCommand('copy');
         document.documentElement.removeChild(textArea);
         return success ? Promise.resolve('Скопировано') : Promise.reject('Ошибка');
      }
   }
}