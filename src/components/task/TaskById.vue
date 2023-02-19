<template lang="pug">
div(:class="$style.container")
   h4(class="text-center q-mt-lg q-mb-lg") Информация о задаче
   div(v-if="loading" style="height: 40px;")
      QInnerLoading(:showing="loading" color="secondary")
   QMarkupTable(v-else)
      thead
      tbody
         tr
            td Название задачи
            td {{ task?.title }}
         tr 
            td Описание
            td {{ task?.description }}
         tr
            td Теги
            td
               QChip(v-for="tag in task?.tags" :label="tag" clickable) 
                  QTooltip(:delay="1000") {{ tag }}
         tr
            td Статус
            td
               QBadge(:label="task?.status" :class="$style[setStatus(task?.status || 'Не выбрана')]")
         tr(v-if="task?.user")
            td Взял задачу
            td {{ typeof task?.user !== 'string' ? task.user.name: '' }}
</template>

<script setup lang="ts">
import type { ITask } from '@/types/interfaces'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@/hooks'
import { TaskService } from '@/api/services'


const route = useRoute();
const { f: onGetTask, data: task, loading } = useFetch<ITask>({
   fn: () => TaskService.getTaskById(route.params.id.toString())
});;

onMounted(onGetTask);

function setStatus(status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена') {
   switch (status) {
      case 'Не выбрана':
         return 'status_not_selected';
      case 'В работе':
         return 'status_accepted';
      case 'Отменена':
         return 'status_canceled';
      case 'Выполнена':
         return 'status_completed';
   }
}
</script>

<style lang="scss" module>
.container {
   width: 50%;
   margin: 0 auto;
   padding: 0 10px;
}

.status_completed {
   background-color: $positive;
}

.status_canceled {
   background-color: $negative;
}

.status_accepted {
   background-color: $info;
}

.status_not_selected {
   background-color: $warning;
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