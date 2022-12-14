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

   static fillArrayWithNumbers(from: number, to: number) {
      const arr: number[] = [];
      for (let i = 0; i <= to - from; i++) {
         arr.push(i);
      }
      return arr;
   }

   static async copyToClipboard(text: string): Promise<string> {
      if (navigator.clipboard && window.isSecureContext) {
         await navigator.clipboard.writeText(text)
            .catch(e => { throw e });
         return 'Скопировано в буфер обмена';
      }
      else {
         const textArea = document.createElement('textarea');
         textArea.value = text;
         textArea.style.cssText = 'position:fixed; left: -999999px; top: -999999px';
         document.body.appendChild(textArea);
         textArea.focus();
         textArea.select();
         return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
               resolve('Скопировано в буфер обмена')
            } else {
               reject('Ошибка! Значение не скопировано');
               textArea.remove();
            }
         });
      }
   }
}


