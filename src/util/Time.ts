export default class Time {
   private static convertDay(day: number) {
      return day < 10 ? `0${day}` : day;
   }

   private static convertMonth(month: number) {
      return month + 1 < 10 ? `0${month + 1}` : month + 1;
   }

   private static convertYear(year: number) {
      return year;
   }

   private static convertHours(hours: number) {
      return hours < 10 ? `0${hours}` : hours;
   }

   private static convertMinutes(mins: number) {
      return mins < 10 ? `0${mins}` : mins;
   }

   private static timeStruct(date: Date) {
      return {
         year: date.getFullYear(),
         month: date.getMonth(),
         day: date.getDate(),
         hours: date.getHours(),
         minutes: date.getMinutes()
      }
   }

   static showFilteredDate(date: Date) {
      const now = new Date;
      const nowT = this.timeStruct(now);
      const dateT = this.timeStruct(date);

      if (nowT.year === dateT.year && nowT.month === dateT.month && nowT.day === dateT.day) {
         return `${this.convertHours(dateT.hours)}:${this.convertMinutes(dateT.minutes)}`
      } else if (nowT.year === dateT.year) {
         return `${this.convertDay(dateT.day)}.${this.convertMonth(dateT.month)}, в ${this.convertHours(dateT.hours)}:${this.convertMinutes(dateT.minutes)}`
      } else {
         return `${this.convertDay(dateT.day)}.${this.convertMonth(dateT.month)}.${this.convertYear(dateT.year)}, в ${this.convertHours(dateT.hours)}:${this.convertMinutes(dateT.minutes)} `
      }
   }

   static showDialogListDate(date: Date) {
      const now = new Date;
      const nowT = this.timeStruct(now);
      const dateT = this.timeStruct(date);

      if (nowT.year === dateT.year && nowT.month === dateT.month && nowT.day === dateT.day) {
         return `${this.convertHours(dateT.hours)}:${this.convertMinutes(dateT.minutes)}`
      } else if (nowT.year === dateT.year) {
         return `${this.convertDay(dateT.day)}.${this.convertMonth(dateT.month)}`
      } else {
         return `${this.convertDay(dateT.day)}.${this.convertMonth(dateT.month)}.${this.convertYear(dateT.year)}`
      }
   }
}