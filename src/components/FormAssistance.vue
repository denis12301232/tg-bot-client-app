<template lang="pug">
form(:class="[$style.form, dark ? $style.form_dark: $style.form_light]", @submit.prevent="emit('save', form)")
   div(:class="$style.form_title") {{ title }}
   FormAssistanceGroup(title="ФИО", error="Заполните все поля", :invalid="validFio")
      FormAssistanceInput(:class="$style.form_group", placeholder="Фамилия", v-model="form.surname.value", @touch="form.surname.blur", maxlength="30")
      FormAssistanceInput(:class="$style.form_group", placeholder="Имя", v-model="form.name.value", @touch="form.name.blur", maxlength="30")
      FormAssistanceInput(:class="$style.form_group", placeholder="Отчество", v-model="form.patronymic.value", @touch="form.patronymic.blur", maxlength="30")
   FormAssistanceGroup(title="Телефон", :error="['Это обязательное поле', 'Неверный номер']", :invalid="validPhone")
      FormAssistanceInput(:class="$style.form_group", placeholder="+380", :mask="true", offset="45px", type="tel", v-model="form.phone.value", @touch="form.phone.blur", maxlength="9", @paste="filterPhone")
   FormAssistanceGroup(title="Дата рождения", :error="['Это обязательное поле', 'Неверный формат даты']", :invalid="validBirth")
      DatePicker(:class="$style.form_group", label="Ваша дата рождения", v-model="form.birth.value", @touch="form.birth.blur")
   FormAssistanceGroup(title="Адрес", error="Заполните все поля", :invalid="validAddress")
      div(:class="$style.form_group")
         CSelect(label="Район", :items="Constants.districts", v-model="form.district.value", @touch="form.district.blur") 
      FormAssistanceInput(:class="$style.form_group", placeholder="Улица/Проспект/Переулок", v-model="form.street.value", @touch="form.street.blur", maxlength="30")
      FormAssistanceInput(:class="$style.form_group", placeholder="Дом", v-model="form.house.value", @touch="form.house.blur", maxlength="30")
      FormAssistanceInput(:class="$style.form_group", placeholder="Квартира", v-model="form.flat.value", @touch="form.flat.blur", maxlength="30")
   FormAssistanceGroup(title="Число проживающих", error="Это обязательное поле", :invalid="validPeopleNum") 
      FormAssistanceInput(:class="$style.form_group", placeholder="Кол-во людей, проживающих с вами", type="number", v-model="form.people_num.value", @touch="form.people_num.blur", max="10")
   FormAssistanceGroup(v-if="+form.people_num.value > 1", title="Имя и возраст проживающих")
      FormAssistanceInput(:class="$style.form_group", placeholder="Имя и возраст", v-for="item in (+form.people_num.value - 1 < 10 ? +form.people_num.value - 1: 10)", v-model="form.people_fio.value[+item - 1]", :key="item")
   FormAssistanceGroup(title="Есть ли среди проживающих инвалиды?")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CRadio(name="invalids", value="Да", v-model="form.invalids.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            CRadio(name="invalids", value="Нет", v-model="form.invalids.value")
            div(:class="$style.form_radio_title") Нет
   FormAssistanceGroup(title="Есть ли дети?")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CRadio(name="kids", value="Да", v-model="form.children.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            CRadio(name="kids", value="Нет", v-model="form.children.value")
            div(:class="$style.form_radio_title") Нет
   FormAssistanceGroup(v-if="form.children.value === 'Да'", title="Отметьте возраст детей")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CCheckbox(value="0-1", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 0 до 1
         div(:class="$style.form_radio")
            CCheckbox(value="1-3", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 1 до 3
         div(:class="$style.form_radio")
            CCheckbox(value="3-9", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 3 до 9
         div(:class="$style.form_radio")
            CCheckbox(value="9-18", v-model="form.children_age.value")
            div(:class="$style.form_radio_title") От 9 до 18
   FormAssistanceGroup(title="Нужны ли продукты питания?")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CRadio(name="food", value="Да", v-model="form.food.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            CRadio(name="food", value="Нет", v-model="form.food.value")
            div(:class="$style.form_radio_title") Нет
   FormAssistanceGroup(title="Нужна ли вода?")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CRadio(name="water", value="Да", v-model="form.water.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            CRadio(name="water", value="Нет", v-model="form.water.value")
            div(:class="$style.form_radio_title") Нет
   FormAssistanceGroup(title="Нужны ли лекарства?")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CRadio(name="drugs", value="Да", v-model="form.drugs.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            CRadio(name="drugs", value="Нет", v-model="form.drugs.value")
            div(:class="$style.form_radio_title") Нет
   FormAssistanceGroup(v-if="form.drugs.value === 'Да'", title="Укажите какие именно, кол-во, дозу")
      FormAssistanceInput(:class="$style.form_group", placeholder="О лекарствах", v-model="form.products_detail.value")
   FormAssistanceGroup(title="Нужны ли средства личной гигиены?")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CRadio(name="gigien", value="Да", v-model="form.gigien.value")
            div(:class="$style.form_radio_title") Да
         div(:class="$style.form_radio")
            CRadio(name="gigien", value="Нет", v-model="form.gigien.value", :checked="true")
            div(:class="$style.form_radio_title") Нет
   FormAssistanceGroup(v-if="form.gigien.value === 'Да'", title="Укажите какие именно")
      FormAssistanceInput(:class="$style.form_group", placeholder="О средствах гигиены", v-model="form.gigien_num.value")
   FormAssistanceGroup(title="Памперсы? Если нужны, укажите какие (детские/взрослые, размер)")
      FormAssistanceInput(:class="$style.form_group", placeholder="Памперсы", v-model="form.pampers.value")
   FormAssistanceGroup(title="Особенности диеты, алергии, диабет и т.д.")
      FormAssistanceInput(:class="$style.form_group", placeholder="Особенности", v-model="form.diet.value")
   FormAssistanceGroup(title="Даю согласие на обработку персональных данных")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CCheckbox(v-model="form.pers_data_agreement.value", :value="true")
            div(:class="$style.form_radio_title") Согласен/согласна
   FormAssistanceGroup(title="Даю согласие на фото/видео")
      div(:class="$style.form_group")
         div(:class="$style.form_radio")
            CCheckbox(v-model="form.photo_agreement.value", :value="true")
            div(:class="$style.form_radio_title") Согласен/согласна
   div(:class="$style.form_buttons")
      div(:class="$style.form_button_submit")
         slot(name="submit", :form="form")
         LoadingWheel(v-if="isLoading")
      div
         slot(name="cancel")
</template>

<script setup lang="ts">
import { useTheme } from "@/hooks/useTheme"
import { useAssistanceValidation } from '@/hooks/useAssistanceValidation'
import { AssistanceFormValidators } from "@/interfaces/interfaces"
import FormAssistanceInput from "@/components/FormAssistanceInput.vue"
import FormAssistanceGroup from "@/components/FormAssistanceGroup.vue"
import { reactive } from 'vue'
import Constants from "@/libs/Constants"
import DatePicker from "./DatePicker.vue"


const props = defineProps({
   form: {
      type: Object as () => AssistanceFormValidators,
      required: true,
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

const emit = defineEmits<{ (e: 'save', fm: typeof form): void }>();
const form = reactive(props.form)
const { dark } = useTheme();
const { validFio, validPhone, validBirth, validAddress, validPeopleNum } = useAssistanceValidation(form);


const filterPhone = (event: ClipboardEvent): void => {
   event.preventDefault();
   const paste = event.clipboardData!.getData('text');
   const numbers = paste.replace(/\D/g, "");
   const symbolsCount = numbers.length;

   if (!symbolsCount) return;

   form.phone.value = '';

   if (symbolsCount >= 12) {
      form.phone.value = numbers.slice(3);
   } else if (symbolsCount === 11) {
      form.phone.value = numbers.slice(2);
   } else if (symbolsCount === 10) {
      form.phone.value = numbers.slice(1);
   } else {
      form.phone.value = numbers;
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

   & .form_buttons {
      padding: 10px 0 10px 0;
      display: flex;
      place-items: center;
      justify-content: space-between;

      & .form_button_submit {
         display: flex;
         place-items: center;
      }
   }

   & .form_select {
      position: relative;
      z-index: 1;
   }

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

   & .form_label {
      position: absolute;
      top: 1.5px;
      transition: 0.3s;
      color: #9e9e9e;
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
      box-shadow: 0px 4px 8px #e9e6e400;
   }
}
</style>