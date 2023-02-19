<template lang="pug">
div(:class="$style.container")
   h4(class="text-center q-mt-lg q-mb-lg") Задачи
   QTable(
      :class="$style.table"
      :columns="columns" 
      :rows="tasks"
      :loading="loading"
      :rows-per-page-options="[5, 10, 20]"
      :pagination-label="(f, t, a) => `${f}-${t} из ${a}`"
      no-data-label="Задач нет"
      loading-label="Загрузка..."
      rows-per-page-label="Отображать на странице:"
      )
      template(#body="{ row, rowIndex }")
         QTr
            QTd(key="title")
               div(:class="$style.title") {{ row.title }}
            QTd(key="description")
               div(:class="$style.description") {{ row.description }}
            QTd(key="date") {{ row.date }}
            QTd(key="status")
               QBadge(:label="row.status" :class="$style[setStatus(row.status)]")
            QTd(key="tag")
               div(:class="$style.tags")
                  QChip(v-for="tag in row.tags" style="max-width: 90px;" :label="tag" clickable)
                     QTooltip(:delay="1000") {{ tag }}
            QTd(key="_id") 
               QBtnGroup(flat)
                  QBtn(
                     v-if="row.status !== 'Выполнена' && row.user" 
                     round
                     flat
                     icon="check_circle"
                     color="positive"
                     @click="onUpdateTaskStatus(row._id, 'Выполнена')"
                     )
                  QBtn(
                     v-if="!(row.status === 'Отменена')  && !row.user" 
                     round 
                     flat 
                     icon="add_circle_outline" 
                     color="teal" 
                     @click="setUserForTask(row._id)"
                     )
                  QBtn(round flat icon="info" color="primary" @click="$router.push(`/task/id/${row._id}`)")
                  QBtn(
                     v-if="store.isAdmin && row.status !== 'Выполнена' && row.status !== 'Отменена'"
                     round 
                     flat 
                     icon="cancel" 
                     color="negative"
                     @click="onUpdateTaskStatus(row._id, 'Отменена')"
                     )
</template>

<script setup lang="ts">
import type { QTable } from 'quasar'
import type { ITask } from '@/types/interfaces'
import { onMounted } from 'vue'
import { useStore } from '@/stores'
import { useFetch } from '@/hooks'
import { TaskService } from '@/api/services'


const store = useStore();
const { f: onGetTasks, data: tasks, loading } = useFetch<ITask[]>({
   fn: TaskService.getTasks
});
const { f: onUpdateTaskStatus } = useFetch({
   fn: updateStatus
});

const columns: QTable['columns'] = [
   { name: 'title', label: 'Название', align: 'center', field: 'title', headerStyle: 'font-size: 1.1em;' },
   { name: 'description', label: 'Описание', align: 'center', field: 'description', headerStyle: 'font-size: 1.1em;' },
   { name: 'date', label: 'Дата', align: 'center', field: 'date', headerStyle: 'font-size: 1.1em;' },
   { name: 'status', label: 'Статус', align: 'center', field: 'status', headerStyle: 'font-size: 1.1em;' },
   { name: 'tags', label: 'Теги', align: 'center', field: 'tags', headerStyle: 'font-size: 1.1em;' },
   { name: '_id', label: 'Действия', align: 'center', field: '_id', headerStyle: 'font-size: 1.1em;' },
];

onMounted(onGetTasks);

async function updateStatus(task_id: string, status: 'Не выбрана' | 'В работе' | 'Отменена' | 'Выполнена') {
   await TaskService.updateTaskStatus(task_id, status);
   const task = tasks.value?.find((task) => task._id === task_id);
   if (task) task.status = status;
}

async function setUserForTask(task_id: string) {
   await TaskService.setUserForTask(task_id);
   const task = tasks.value?.find((task) => task._id === task_id);
   if (task) {
      task.status = 'В работе';
      task.user = store.user._id;
   }
}

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
.container{
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 0 10px;
}
.table {
   max-width: 100%;

   & .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100px;
   }

   & .description {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 170px;
   }

   & .tags {
      display: flex;
      justify-content: center;
   }
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
</style>