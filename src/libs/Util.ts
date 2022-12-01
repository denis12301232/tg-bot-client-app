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
}


