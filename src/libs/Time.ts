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

   public static getCurrentDay() {
      const date = new Date();
      return date.getDate();
   }

}