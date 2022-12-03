<template lang="pug">
div(:class="[$style.container, isActive ? $style.active: '']")
   div(
      :class="$style['select-btn']", 
      tabindex="0", 
      ref="select",
      @click.stop="onClick", 
      @blur="[emit('touch'), onBlur]",
      @focus="onFocus",
      )
      span(:class="$style.value") {{modelValue}}
   label(:class="[$style.label, checked || modelValue  ? $style.selected: '']") {{ label }}
   div(:class="[$style.content, position === 'top' ? $style.top: '']")
      div(:class="[$style.calendar, dark ? $style.calendar_dark : '']")
         div(:class="$style.nav")
            div
               v-icon(:class="$style.icon", @click.stop="changeMonth('back')") mdi-arrow-left
            h4(@click.stop="setMenu()", :class="$style.title") {{Constants.monthes[currentMonth] + ' ' + currentYear }}
            div
               v-icon(:class="$style.icon", @click.stop="changeMonth('forward')") mdi-arrow-right
         div(:class="$style.day_numbers")
            div(v-for="day in Constants.weekdays", :class="$style.day_name") {{day}}
         div(:class="$style.day_numbers", ref="days")
            div(v-for="i in 42", :class="$style.day_number", @click.stop="setDay")
         div(v-if="isMenuVisible", :class="$style.menu")
            div(:class="$style.nav")
               div
                  v-icon(:class="$style.icon", @click.stop="changeIndex('back')", v-if="isYearsVisible") mdi-arrow-left
               h4(@click.stop="openYears()", :class="$style.title") {{ currentYear }}
               div
                  v-icon(:class="$style.icon", @click.stop="changeIndex('forward')", v-if="isYearsVisible") mdi-arrow-right
            div(:class="$style.monthes", v-if="isYearsVisible")
               div(
                  v-for="year in years.slice(index * 12, 12 * (index + 1))", 
                  @click.stop="setYear(year + 1900)"
                  :class="year+1900 === currentYear ? $style.current_month : ''",
                  ) {{year + startYear}}
            div(:class="$style.monthes", v-else)
               div(
                  v-for="(month, index) in Constants.monthes", 
                  :class="index === currentMonth ? $style.current_month : ''",
                  @click.stop="setMonth(index)"
                  ) {{month}}
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCssModule } from 'vue'
import { useCalendar } from '@/hooks/useCalendar'
import Constants from '@/libs/Constants'
import Util from '@/libs/Util'
import { useTheme } from '@/hooks/useTheme'

const props = defineProps({
   modelValue: {
      type: String,
   },
   label: {
      type: String,
      required: true,
   },
   items: {
      type: Array,
      default: [],
   },
   startYear: {
      type: Number,
      default: 1900,
   },
   endYear: {
      type: Number,
      default: 2022,
   }
});

const emit = defineEmits(['update:modelValue', 'touch']);
const { dark } = useTheme();

const $style = useCssModule();
const checked = ref(false);
const isActive = ref(false);
const currentMonth = ref(11);
const currentYear = ref(2022);
const currentDay = ref(1);
const days = ref<HTMLDivElement>();
const isMenuVisible = ref(false);
const isYearsVisible = ref(false);
const years = ref(Util.fillArrayWithNumbers(props.startYear, props.endYear));
const index = ref(Math.floor((props.endYear - props.startYear) / 12));
const select = ref<HTMLDivElement>();
const position = ref('');

onMounted(() => {
   useCalendar({ elem: days.value!, elemClass: $style.day_number, year: currentYear.value, month: currentMonth.value });
   onScroll();
   document.addEventListener('click', onClose);
   document.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
   document.removeEventListener('scroll', onScroll);
   document.removeEventListener('click', onClose);
});

watch([currentDay, currentMonth, currentYear], (prev, current) => {
   if (prev[1] !== current[1]) {
      if (prev[1] > 11) {
         currentMonth.value = 0;
         currentYear.value++;
      } else if (prev[1] < 0) {
         currentMonth.value = 11;
         currentYear.value--;
      };
      useCalendar({ elem: days.value!, elemClass: $style.day_number, year: currentYear.value, month: currentMonth.value });
   }
   if (prev[2] !== current[2]) {
      useCalendar({ elem: days.value!, elemClass: $style.day_number, year: currentYear.value, month: currentMonth.value });
   }

   const day = currentDay.value + 1 < 10 ? '0' + (currentDay.value + 1) : currentDay.value + 1;
   const month = currentMonth.value + 1 < 10 ? '0' + (currentMonth.value + 1) : currentMonth.value + 1;
   const year = currentYear.value;
   emit('update:modelValue', `${year}.${month}.${day}`);
});

function onScroll() {
   const coords = select.value?.getBoundingClientRect()!;
   const top = coords.top;
   const bottom = document.documentElement.clientHeight - coords.bottom;
   top >= bottom ? position.value = 'top' : position.value = 'bottom';
}

function onFocus() {
   checked.value = true;
}

function onBlur() {
   checked.value = false;
}

function onClose() {
   isActive.value = false;
   checked.value = false;
   setMenu(false);
   openYears(false);
}

function openYears(value?: boolean) {
   if (typeof value === 'boolean')
      isYearsVisible.value = value;
   else
      isYearsVisible.value = !isYearsVisible.value;
}

function changeIndex(to: 'forward' | 'back') {
   switch (to) {
      case 'forward':
         index.value === Math.floor((props.endYear - props.startYear) / 12) ? 0 : index.value++;
         break;
      case 'back':
         index.value === 0 ? 0 : index.value--;
         break;
   }
}

function setDay(event: Event) {
   const target = event.target as HTMLDivElement;
   switch (target.dataset.month) {
      case 'prev':
         currentMonth.value--;
         onClick();
         break;
      case 'next':
         currentMonth.value++;
         onClick();
         break;
      case 'current':
      case 'now':
         onClick();
         break;
   }
   currentDay.value = +target.textContent! - 1;
}

function changeMonth(to: 'forward' | 'back') {
   switch (to) {
      case 'forward':
         currentMonth.value++;
         setMenu(false);
         break;
      case 'back':
         currentMonth.value--;
         setMenu(false);
         break;
   }
}

function setMonth(index: number) {
   currentMonth.value = index;
   setMenu(false);
}

function setYear(year: number) {
   currentYear.value = year;
   openYears(false);
}

function setMenu(value?: boolean) {
   if (typeof value === 'boolean')
      isMenuVisible.value = value;
   else
      isMenuVisible.value = !isMenuVisible.value;
}

function onClick() {
   isActive.value = !isActive.value;
}
</script>


<style lang="scss" module>
.container {
   width: 100%;
   position: relative;

   & .select-btn {
      border-bottom: 1px solid #e0e0e0;
      background-color: transparent;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      z-index: 2;

      &:focus {
         border-bottom: 1px solid #1a73a8;
      }
   }

   & .label {
      position: absolute;
      transition: 0.3s;
      color: #9e9e9e;
      top: 15px;
      z-index: 1;
      user-select: none;
   }

   & .content {
      padding: 5px;
      display: none;
      transition: 0.3s;
      position: absolute;
      width: 100%;
      z-index: 100;
   }
}

.active {
   & .content {
      display: block;
   }
}

.calendar {
   width: 230px;
   border-radius: 5px;
   position: relative;
   left: -5px;
   top: -5px;
   padding: 8px;
   background-color: #CCCCCC;

   & .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      & .title {
         border-radius: 5px;
         padding: 5px 10px;

         &:hover {
            cursor: pointer;
            background-color: #3d3e42;
            color: #f1f1f1;
         }
      }
   }

   & .day_numbers {
      display: grid;
      grid-template-columns: repeat(7, 1fr);

      & .day_name {
         text-align: center;
         border-radius: 50%;
         width: 25px;
         height: 25px;
         color: rgb(136, 138, 149);

         &:hover {
            cursor: default;
         }
      }

      & .day_number {
         text-align: center;
         border-radius: 50%;
         width: 30px;
         height: 30px;
         display: flex;
         justify-content: center;
         align-items: center;

         &:hover {
            background-color: #3d3e42;
            color: #f1f1f1;
            cursor: pointer;
         }

         &[data-month=now] {
            color: rgb(12, 126, 43);
            background-color: #494b53;
            font-weight: bold;
         }
      }
   }
}

.calendar_dark {
   background-color: #302E33;

   & .menu {
      background-color: rgb(25, 23, 23);
   }
}

.menu {
   position: absolute;
   top: 43px;
   z-index: 200;
   width: 185px;
   height: 170px;
   background-color: white;
   border-radius: 5px;
   padding: 2px;
   margin: 0;
   position: absolute;
   transform: translate(8%, 0);

   &::before {
      content: "";
      position: absolute;
      margin-left: -5px;
      top: -7px;
      right: 84px;
      width: 12px;
      height: 12px;
      border: solid rgb(103, 108, 115);
      border-width: 1px 0 0 1px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
   }

   & .monthes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      &>div {
         max-width: 55px;
         overflow: hidden;
         text-overflow: ellipsis;
         padding: 5px 3px;
         border-radius: 5px;

         &:hover {
            background-color: #3d3e42;
            color: #f1f1f1;
            cursor: pointer;
         }
      }

      & .current_month {
         background-color: #3d3e42;
         color: #f1f1f1;
      }
   }
}

.icon {
   &:hover {
      transform: scale(1.1);
      cursor: pointer;
   }
}

.selected {
   top: -5px !important;
   transition: 0.3s;
}

.value {
   position: absolute;
   top: 15px;
}

.top {
   top: -257px;
}
</style>