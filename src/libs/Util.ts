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
}


