import Time from '@/libs/Time'

export function useCalendar(elem: HTMLElement, year: number, month: number) {

   let day: number = 1;
   const lastDay = Time.getLastDayOfMonth(year, month);
   const lastDayPrevMonth = Time.getLastDayOfPrevMonth(year, month);
   const firstWeekDay = Time.getDayOfWeek(year, month, 1);
   let nextWeekDay: number = 1;
   let prevWeekDay: number = lastDayPrevMonth + 1 - (firstWeekDay - 1);

   elem.querySelectorAll<HTMLElement>('.day_item').forEach((item, index): void => {

      if (index < firstWeekDay - 1) {
         (<HTMLDivElement>item).innerText = prevWeekDay.toString();
         prevWeekDay++;
         item.dataset.month = 'prev';
      } else if (day <= lastDay) {
         (<HTMLDivElement>item).innerText = day.toString();
         day++;
         item.dataset.month = 'current';
      } else {
         (<HTMLDivElement>item).innerText = nextWeekDay.toString();
         nextWeekDay++;
         item.dataset.month = 'next';
      }
   });
}