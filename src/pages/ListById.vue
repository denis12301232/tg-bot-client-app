<template lang="pug">
div(class="container")
   div(v-if="!isEditable")
      h4(class="title") Заявка
      div(class="edit")
         QBtn(icon="edit" round dense flat @click="$router.push({ query: { edit: 'true' } })")
      QMarkupTable()
         tbody
            tr(v-for="(key, value) in form")
               td {{ Constants.assistance[value] }}
               td {{ useBeautifyAssistance(key) }}
   FormAssistance(
      v-else-if="form && isEditable"
      :form="form"
      :loading="isUpdateLoading"
      :reset="false"
      title="Редактировать заявку"
      @submit="onUpdateForm"
      )
      template(#submit="{type, valid}")
         QBtn(:type="type" :loading="isUpdateLoading" :disable="!valid" color="primary") Изменить
      template(#cancel)
         QBtn(@click="$router.push({query: undefined})" color="primary") Отмена
</template>


<script setup lang="ts">
import type { AssistanceForm } from '@/types/interfaces'
import FormAssistance from '~/FormAssistance.vue'
import { onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch, useBeautifyAssistance } from '@/hooks'
import { AssistanceService } from '@/api/services'
import { Constants } from '@/util'


const props = defineProps<{
   id: string;
}>();
const router = useRouter();
const route = useRoute();
const isEditable = computed(() => !!route.query.edit);
const { f: onFetchForm, loading, error, data: form } = useFetch<AssistanceForm>({
   fn: () => AssistanceService.getFormById(props.id),
});
const { f: onUpdateForm, loading: isUpdateLoading } = useFetch({
   fn: (form) => AssistanceService.modifyAssistanceForm(form, props.id)
      .then(() => router.push({ query: undefined })),
   alert: true,
   successMsg: 'Обновлено'
});

onMounted(onFetchForm);

watch(route, () => {
   window.scrollTo(0, 0);
});
</script>

<style lang="scss" scoped>
.container {
   width: 50%;
   padding: 20px 0 20px 0;
   margin: 0 auto;

   & .title {
      text-align: center;
   }

   & .edit {
      display: flex;
      justify-content: end;
      margin-bottom: 2px;
   }
}

@media (max-width:1024px) {
   .container {
      width: 60%;
   }
}

@media (max-width:768px) {
   .container {
      width: 70%;
   }
}

@media (max-width:560px) {
   .container {
      width: 95%;
   }
}
</style>