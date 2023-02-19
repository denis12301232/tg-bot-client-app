<template lang="pug">
QForm(:class="$style.container" @submit="onSubmit" ref="formRef" no-error-focus)
   h4(class="text-center q-mt-lg q-mb-lg") Новая задача
   QInput(v-model="task.title" :class="$style.field" filled label="Название" maxlength="30" counter :rules="rules.title" lazy-rules)
   QInput(
      v-model="tag" 
      :class="$style.field" 
      filled 
      label="Теги" 
      :readonly="task.tags.length >= 3"
      lazy-rules
      @keyup.enter="onAddTag" 
      @blur="onAddTag"
      )
      template(#prepend v-if="task.tags.length")
         QChip(
            v-for="(tag, index) in task.tags"
            :class="$style.tag"
            :label="tag"
            clickable
            removable
            icon-remove="cancel"
            @remove="onRemoveTag(index)"
            )
            QTooltip(:delay="1000") {{ tag }}
   QInput(
      v-model="task.description" 
      :class="$style.field" 
      filled label="Описание" 
      type="textarea" 
      counter 
      lazy-rules
      :maxlength="2048"
      :rules="rules.description"
      )
   QInput(v-model="task.date" :class="$style.field" filled label="Дата" mask="date" :rules="rules.date" lazy-rules)
      template(#append)
         QIcon(name="event" class="cursor-pointer")
            QPopupProxy(cover transition-show="scale" transition-hide="scale")
               QDate(v-model="task.date" emit-immediately)
                  div(class="row items-center justify-end")
                     QBtn(v-close-popup label="Close" color="primary" flat)
   QBtn(class="q-mt-sm" color="primary" :loading="loading" :disable="!valid" type="submit") Создать
</template>

<script setup lang="ts">
import type { QForm } from 'quasar'
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch } from '@/hooks'
import { TaskService } from '@/api/services'
import { Validate } from '@/util'


const router = useRouter();
const formRef = ref<QForm | null>(null);
const tag = ref('');
const task = reactive({
   title: '',
   tags: [] as string[],
   description: '',
   date: '',
});
const valid = ref(false);
const { f: onSubmit, loading } = useFetch({
   fn: () => TaskService.createTask(task.title, task.tags, task.description, task.date)
      .then(() => router.push('/task/list'))
});
const rules = {
   title: [
      (v: string) => Validate.required(v) || 'Заполните поле',
   ],
   description: [
      (v: string) => Validate.required(v) || 'Заполните поле'
   ],
   date: [
      (v: string) => Validate.isYYYYMMDD(v) || 'Введите корректную дату'
   ]
};
watch(task, () => {
   formRef.value?.validate().then((v) => {
      valid.value = v && Validate.lengthInterval(1, 3)(task.tags) && !loading.value;
   });
});

function onAddTag() {
   if (tag.value) {
      task.tags.push(tag.value);
      tag.value = '';
   }
}

function onRemoveTag(index: number) {
   task.tags.splice(index, 1);
}
</script>

<style lang="scss" module>
.container {
   width: 50%;
   margin: 0 auto;
   padding: 0 10px;
}

.field {
   margin-top: 10px;
}

.tag {
   max-width: 90px;
}

@media (max-width:1024px) {
   .container {
      width: 70%;
   }
}

@media (max-width:768px) {
   .container {
      width: 85%;
   }
}

@media (max-width:480px) {
   .container {
      width: 100%;
   }
}
</style>