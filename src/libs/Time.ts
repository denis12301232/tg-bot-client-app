export default class Time {
   public static getLastDayOfMonth(year: number, month: number) {
      const date = new Date(year, month + 1, 0);
      return date.getDate();
   }

   public static getDayOfWeek(year: number, month: number, day: number) {
      const date = new Date(year, month, day);
      let weekDay = date.getDay();
      if (weekDay == 0) weekDay = 7;
      return weekDay;
   }

   public static getLastDayOfPrevMonth(year: number, month: number) {
      const date = new Date(year, month, 0);
      return date.getDate();
   }

   public static getCurrentDay(date?: Date) {
      if (!date) {
         const date = new Date();
         return date.getDate();
      }
      return date.getDate();
   }

   public static getCurrentMonth(date?: Date) {
      if (!date) {
         const date = new Date();
         return date.getMonth();
      }
      return date.getMonth();
   }

   public getCurrentYear(date?: Date) {
      if (!date) {
         const date = new Date();
         return date.getFullYear();
      }
      return date.getFullYear();
   }
}