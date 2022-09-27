<template lang="pug">
div.container
   .calendar
      div.menu(:hidden="isMenuHidden")
         div(v-if="!isNextMenu")
            div.head
               button(@click="prevYear") &#8592
               div(@click="setNextMenu") {{ year }}
               button(@click="nextYear") &#8594
            div.monthes
               div.month(v-for="(month, index) in monthes", @click="setMonth", :data-index="index") {{ month.slice(0, 3) }}
         div(v-if="isNextMenu")
            div.head
               button(@click="") &#8592
               div(@click="setNextMenu") {{ year }}
               button(@click="") &#8594
            div.monthes
               div.month(v-for="item in 12") {{yearsList[item]}}
      div.head
         button(@click="prevMonth") &#8592
         div(@click="showMenu") {{ monthes[month] }} {{ year }}
         button(@click="nextMonth") &#8594
      div.days(ref="calendar")
         div.day_name(v-for="day in days") {{ day }}
         div.day_item(v-for="item in 42", @click="setDate", tabindex="0") {{ item }}
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCalendar } from "@/hooks/useCalendar";

const props = defineProps({
   min: {
      type: Date,
      default: new Date(1920, 0, 1),
   },
   max: {
      type: Date,
      default: new Date,
   }
});

const yearsList = ref();

function setYearsList() {
   const mas = [];
   const min = props.min.getFullYear();
   const max = props.max.getFullYear();
   let current = min;
   console.log(current);
   

   while (current !== max) {
      mas.push(current);
      current++;
      
   }

   return mas;
}


const monthes: Array<string> = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
   'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const days: Array<string> = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const calendar = ref<HTMLElement | null>(null);
const date = new Date;
const year = ref(date.getFullYear());
const month = ref(date.getMonth());
const isMenuHidden = ref(true);
const isNextMenu = ref(false);

onMounted((): void => {
   useCalendar(calendar.value!, year.value, month.value);
   yearsList.value = setYearsList();
});

const nextMonth = (): void => {
   if (month.value + 1 === 12 && year.value === props.max.getFullYear()) {
      return;
   }
   month.value++;
   if (month.value == 12) {
      year.value++;
      month.value = 0;
   }
   useCalendar(calendar.value!, year.value, month.value);
}

const prevMonth = (): void => {
   if (month.value - 1 === -1 && year.value === props.min.getFullYear()) {
      return;
   }
   month.value--;
   if (month.value == -1) {
      year.value--;
      month.value = 11;
   }
   useCalendar(calendar.value!, year.value, month.value);
}

const showMenu = (): void => {
   console.log('test');
   isMenuHidden.value = !isMenuHidden.value;
}

const setDate = (event: Event): void => {
   const div = <HTMLElement>event.target;
   const currentDay = div.textContent!;
   if (div.dataset.month === 'prev') {
      prevMonth();
   } else if (div.dataset.month === 'next') {
      nextMonth();
   }
   console.log(`${year.value}-${month.value}-${currentDay}`);
}

const setMonth = (event: Event): void => {
   const selected = <HTMLElement>event.target;
   month.value = +selected.dataset.index!;
   useCalendar(calendar.value!, year.value, month.value);
}

const nextYear = (): void => {
   if (year.value === props.max.getFullYear()) {
      return;
   }
   year.value++;
   useCalendar(calendar.value!, year.value, month.value);
}

const prevYear = (): void => {
   if (year.value === props.min.getFullYear()) {
      return;
   }
   year.value--;
   useCalendar(calendar.value!, year.value, month.value);
}


const setNextMenu = (): void => {
   isNextMenu.value = !isNextMenu.value;
}
</script>

<style lang="scss" scoped>
.container {
   padding: 10px;
}

.calendar {
   width: 200px;
   background-color: white;
   position: relative;
   border: 1px solid black;
   border-radius: 5px;
   padding: 5px;

   & .menu {
      position: absolute;
      background-color: #2d3748;
      margin: 0;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
      padding: 5px;
      border-radius: 5px;
      width: 80%;
      height: 78%;
      color: white;

      & .monthes {
         display: grid;
         grid-template-columns: repeat(3, 1fr);
         text-align: center;

         & .month {
            padding: 5px;

            &:hover {
               background-color: #242c3a;
               cursor: pointer;
            }
         }
      }
   }

   & .head {
      display: flex;
      justify-content: space-around;
      cursor: pointer;

      & button {
         cursor: pointer;
      }
   }

   & .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);

      & .day_item {
         text-align: center;
         border-radius: 100%;
         width: 27px;
         height: 27px;
         line-height: 27px;
         display: table-cell;
         padding: 2px;

         &:hover,
         &:focus {
            cursor: pointer;
            background-color: white;
         }
      }

      & .day_name {
         text-align: center;
         cursor: default;
      }
   }
}

div[data-month="prev"],
div[data-month="next"] {
   color: darkgrey;
}
</style>