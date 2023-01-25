<template lang="pug">
ToolsLayout(title="Информация о заявке")
   div(class="container")
      div(v-if="!isEditable")
         h4(class="title") Заявка
         div(class="edit")
            QIcon(name="edit" size="20px" @click="$router.push({query: {edit: 'true'}})")
         QMarkupTable
            tbody
               tr(v-for="(key, value) in form")
                  td {{ value }}
                  td {{ key }}
      FormAssistance(
         v-else-if="form && isEditable"
         :form="form"
         title="Редактировать заявку"
         @submit="onUpdateForm"
         :loading="isUpdateLoading"
         :reset="false"
         )
         template(#submit="{type, valid}")
            QBtn(:type="type" :loading="isUpdateLoading" :disable="!valid") Изменить
         template(#cancel)
            QBtn(@click="$router.push({query: undefined})") Отмена
</template>


<script setup lang="ts">
import type { AssistanceForm } from '@/types/interfaces'
import ToolsLayout from '@/layouts/ToolsLayout.vue'
import { onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFetch } from '@/hooks'
import { AssistanceService } from '@/api/services'
import FormAssistance from '@/components/FormAssistance.vue'


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
      margin: 10px 0 10px 0;
   }

   & .edit {
      display: flex;
      justify-content: end;
      margin-bottom: 2px;

      & i {
         cursor: pointer;

         &:hover {
            transform: scale(1.1);
         }
      }
   }

}
</style>