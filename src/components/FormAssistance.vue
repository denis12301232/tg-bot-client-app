<template lang="pug">
form(:class="[$style.form, dark ? $style.form_dark: $style.form_light]", @submit.prevent="$emit('save')")
   div(:class="$style.form_title") {{ title }}
   div(:class="[$style.select, ((form.surname.errors.required || form.name.errors.required || form.patronymic.errors.required) && (form.surname.touched || form.name.touched || form.patronymic.touched)) ? $style.form_error : '']")
      div(:class="$style.select_title") ФИО
      FormAssistanceInput(:class="$style.form_group", placeholder="Фамилия", v-model="form.surname.value", @touch="form.surname.blur")
      FormAssistanceInput(:class="$style.form_group", placeholder="Имя", v-model="form.name.value", @touch="form.name.blur")
      FormAssistanceInput(:class="$style.form_group", placeholder="Отчество", v-model="form.patronymic.value", @touch="form.patronymic.blur")
      small(:class="$style.select_error", v-if="((form.surname.errors.required || form.name.errors.required || form.patronymic.errors.required) && (form.surname.touched || form.name.touched || form.patronymic.touched))") ! Заполните все поля
   div(:class="[$style.select, (form.phone.errors.required && form.phone.touched) || (form.phone.errors.isPhone && form.phone.touched) ? $style.form_error : '']")
      div(:class="$style.select_title") Телефон
      FormAssistanceInput(:class="$style.form_group", placeholder="+380", :mask="true", offset="45px", type="tel", v-model="form.phone.value", @touch="form.phone.blur", maxlength="9", @paste="filterPhone")
      small(:class="$style.select_error", v-if="form.phone.errors.required && form.phone.touched") ! Это обязательное поле
      small(:class="$style.select_error", v-else-if="form.phone.errors.isPhone && form.phone.touched") ! Неверный номер
   div(:class="[$style.select, (form.birth.errors.required && form.birth.touched) || (form.birth.errors.isDDMMYYYY && form.birth.touched) ? $style.form_error : '']")
      div(:class="$style.select_title") Дата рождения
      FormAssistanceInput(:class="$style.form_group", placeholder="Ваша дата рождения", min="1920-01-01", max="2022-01-01", v-model="form.birth.value", @touch="form.birth.blur", onfocus="(this.type='date')", onblur="if(this.value==''){this.type='text'}")
      small(:class="$style.select_error", v-if="form.birth.errors.required && form.birth.touched") ! Это обязательное поле
      small(:class="$style.select_error", v-else-if="form.birth.errors.isDDMMYYYY && form.birth.touched") Неверный формат даты
   div(:class="[$style.select, ((form.district.errors.required || form.house.errors.required || form.flat.errors.required) && (form.district.touched || form.house.touched || form.flat.touched)) ? $style.form_error : '']")
      div(:class="$style.select_title") Адрес
      div(:class="$style.form_group")
         label(:class="[$style.form_label, form.district.value ? $style.movePlaceholder : '']") Район
         v-select-district(:class="$style.form_select", v-model="form.district.value", @blur="form.district.blur")
      FormAssistanceInput(:class="$style.form_group", placeholder="Улица/Проспект/Переулок", v-model="form.street.value", @touch="form.street.blur")
      FormAssistanceInput(:class="$style.form_group", placeholder="Дом", v-model="form.house.value", @touch="form.house.blur")
      FormAssistanceInput(:class="$style.form_group", placeholder="Квартира", v-model="form.flat.value", @touch="form.flat.blur")
      small(:class="$style.select_error", v-if="((form.district.errors.required || form.house.errors.required || form.flat.errors.required) && (form.district.touched || form.house.touched || form.flat.touched))") ! Заполните все поля
   div(:class="[$style.select, (form.people_num.errors.required && form.people_num.touched) ? $style.form_error : '']")
      div(:class="$style.select_title") Число проживающих
      FormAssistanceInput(:class="$style.form_group", placeholder="Кол-во людей, проживающих с вами", type="number", v-model="form.people_num.value", @touch="form.people_num.blur")
      small(:class="$style.select_error", v-if="form.people_num.errors.required && form.people_num.touched") ! Это обязательное поле
   div(:class="$style.select", v-if="+form.people_num.value > 1")
      div(:class="$style.select_title") Имя и возраст проживающих
      FormAssistanceInput(:class="$style.form_group", placeholder="Имя и возраст", v-for="item in +form.people_num.value - 1", v-model="form.people_fio.value[+item - 1]", :key="item")
   div(:class="$style.select")
      div(:class="$style.select_title") Есть ли среди проживающих инвалиды?
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-radio(name="invalids", value="Да", v-model="form.invalids.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            v-radio(name="invalids", value="Нет", v-model="form.invalids.value")
            div(:class="$style.form_radio_title") Нет
   div(:class="$style.select")
      div(:class="$style.select_title") Есть ли дети?
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-radio(name="kids", value="Да", v-model="form.children.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            v-radio(name="kids", value="Нет", v-model="form.children.value")
            div(:class="$style.form_radio_title") Нет
   div(:class="$style.select", v-if="form.children.value === 'Да'")
      div(:class="$style.select_title") Отметьте возраст детей
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-checkbox(value="0-1", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 0 до 1
         div(:class="$style.form_radio")
            v-checkbox(value="1-3", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 1 до 3
         div(:class="$style.form_radio")
            v-checkbox(value="3-9", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 3 до 9
         div(:class="$style.form_radio")
            v-checkbox(value="9-18", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 9 до 18
   div(:class="$style.select")
      div(:class="$style.select_title") Нужны ли продукты питания?
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-radio(name="food", value="Да", v-model="form.food.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            v-radio(name="food", value="Нет", v-model="form.food.value")
            div(:class="$style.form_radio_title") Нет
   div(:class="$style.select")
      div(:class="$style.select_title") Нужна ли вода?
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-radio(name="water", value="Да", v-model="form.water.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            v-radio(name="water", value="Нет", v-model="form.water.value")
            div(:class="$style.form_radio_title") Нет
   div(:class="$style.select")
      div(:class="$style.select_title") Нужны ли лекарства?
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-radio(name="drugs", value="Да", v-model="form.drugs.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            v-radio(name="drugs", value="Нет", v-model="form.drugs.value")
            div(:class="$style.form_radio_title") Нет
   div(:class="$style.select", v-if="form.drugs.value === 'Да'")
      div(:class="$style.select_title") Укажите какие именно, кол-во, дозу
      FormAssistanceInput(:class="$style.form_group", placeholder="О лекарствах", v-model="form.products_detail.value")
   div(:class="$style.select")
      div(:class="$style.select_title") Нужны ли средства личной гигиены?
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-radio(name="gigien", value="Да", v-model="form.gigien.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            v-radio(name="gigien", value="Нет", v-model="form.gigien.value", :checked="true")
            div(:class="$style.form_radio_title") Нет
   div(:class="$style.select", v-if="form.gigien.value === 'Да'")
      div(:class="$style.select_title") Укажите какие именно
      FormAssistanceInput(:class="$style.form_group", placeholder="О средствах гигиены", v-model="form.gigien_num.value")
   div(:class="$style.select")
      div(:class="$style.select_title") Памперсы? Если нужны, укажите какие (детские/взрослые, размер)
      FormAssistanceInput(:class="$style.form_group", placeholder="Памперсы", v-model="form.pampers.value")
   div(:class="$style.select")
      div(:class="$style.select_title") Особенности диеты, алергии, диабет и т.д.
      FormAssistanceInput(:class="$style.form_group", placeholder="Особенности", v-model="form.diet.value")
   div(:class="$style.select")
      div(:class="$style.select_title") Даю согласие на обработку персональных данных
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-checkbox(v-model="form.pers_data_agreement.value", :value="true")
            div(:class="$style.form_radio_title") Согласен/согласна
   div(:class="$style.select")
      div(:class="$style.select_title") Даю согласие на фото/видео
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            v-checkbox(v-model="form.photo_agreement.value", :value="true")
            div(:class="$style.form_radio_title") Согласен/согласна
   div(:class="$style.form_buttons")
      div(:class="$style.form_button_submit")
         slot(name="submit", :form="form")
         div(:class="$style.form_message_success") {{ successMessage }}
         div(:class="$style.form_message_error") {{ errorMessage }}
         v-loading-wheel(v-if="isLoading")
      div
         slot(name="cancel")
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useTheme } from "@/hooks/useTheme"
import { AssistanceFormValidators } from "@/intefaces/interfaces"
import FormAssistanceInput from "./FormAssistanceInput.vue";

const props = defineProps({
   form: {
      type: Object as () => AssistanceFormValidators,
      required: true,
   },
   successMessage: {
      type: String,
      default: '',
   },
   errorMessage: {
      type: String,
      default: '',
   },
   isLoading: {
      type: Boolean,
      default: false,
   },
   title: {
      type: String,
      default: 'Заявка на получение гуманитарной помощи',
   },
});

const { dark } = useTheme();
const form = computed(() => props.form);

const filterPhone = (event: ClipboardEvent): void => {
   event.preventDefault();
   const paste = event.clipboardData!.getData('text');
   const numbers = paste.replace(/\D/g, "");
   const symbolsCount = numbers.length;

   if (!symbolsCount) return;

   form.value.phone.value = '';

   if (symbolsCount >= 12) {
      form.value.phone.value = numbers.slice(3);
   } else if (symbolsCount === 11) {
      form.value.phone.value = numbers.slice(2);
   } else if (symbolsCount === 10) {
      form.value.phone.value = numbers.slice(1);
   } else {
      form.value.phone.value = numbers;
   }
}
</script>


<style lang="scss" module>
.movePlaceholder {
   top: -18px !important;
   font-size: 12px;
   color: #e0e0e0 !important;
}

.form {
   font-family: sans-serif;
   letter-spacing: 1px;
   padding: 10px;
   outline: none;

   & .form_title {
      text-align: center;
      margin: 0 0 32px 0;
      font-size: 2rem;
   }

   & .form_error {
      border: 1px solid var(--error-message-color) !important;
   }

   & .select {
      position: relative;
      margin-top: 10px;
      border-radius: 5px;
      padding: 20px 20px;
      border: 1px solid transparent;

      & .form_group {
         margin: 32px 0 32px 0;
         position: relative;

         & .form_radio {
            display: flex;
            align-items: center;
            padding-top: 10px;

            & .form_radio_title {
               padding-left: 10px;
            }
         }
      }

      .form_select {
         position: relative;
         z-index: 1;
      }

      & .select_error {
         color: var(--error-message-color);
         font-weight: 550;
         position: absolute;
         bottom: 15px;
      }

      & .form_label {
         position: absolute;
         top: 1.5px;
         transition: 0.3s;
         color: #9e9e9e;
      }
   }

   & .form_buttons {
      padding: 10px 0 10px 0;
      display: flex;
      place-items: center;
      justify-content: space-between;

      & .form_button_submit {
         display: flex;
         place-items: center;
      }

      & .form_message_success {
         align-self: center;
         color: rgb(10, 157, 10);
         font-weight: bolder;
         min-height: 1em;
         line-height: 1em;
         padding-left: 5px;
      }

      & .form_message_error {
         align-self: center;
         color: var(--error-message-color);
         font-weight: bolder;
         min-height: 1em;
         line-height: 1em;
         padding-left: 5px;
      }
   }
}

.form_light {
   & .select {
      background-color: var(--background-color-light);
      box-shadow: 0 4px 16px #ccc;
   }
}

.form_dark {
   & .select {
      background-color: var(--background-color-dark);
      box-shadow: 0px 4px 8px #e9e6e41a;
   }
}
</style>