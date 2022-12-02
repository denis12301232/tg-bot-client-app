import Time from '@/libs/Time';


type CalendarParams = {
   elem: HTMLElement;
   elemClass?: string;
   year: number;
   month: number;
}

export function useCalendar({ elem, elemClass, year, month }: CalendarParams) {
   const date = new Date();
   const daysList = elem.querySelectorAll<HTMLElement>(elemClass ? `.${elemClass}` : 'div');
   const lastDay = Time.getLastDayOfMonth(year, month);
   const lastDayPrevMonth = Time.getLastDayOfPrevMonth(year, month);
   const firstWeekDay = Time.getDayOfWeek(year, month, 1);
   const currentDay = date.getDate();
   const currentMonth = date.getMonth();
   const currentYear = date.getFullYear();
   let day = 1;
   let nextWeekDay = 1;
   let prevWeekDay = lastDayPrevMonth - firstWeekDay + 2;

   daysList.forEach((item, index): void => {
      if (day === currentDay && month === currentMonth && year === currentYear) {
         item.innerText = day.toString();
         day++;
         item.dataset.month = 'now';
      } else if (index < firstWeekDay - 1) {
         item.innerText = prevWeekDay.toString();
         prevWeekDay++;
         item.dataset.month = 'prev';
      } else if (day <= lastDay) {
         item.innerText = day.toString();
         day++;
         item.dataset.month = 'current';
      } else {
         item.innerText = nextWeekDay.toString();
         nextWeekDay++;
         item.dataset.month = 'next';
      }
   });
}