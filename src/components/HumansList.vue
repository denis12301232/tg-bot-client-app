<template lang="pug">
v-modal(:show="isModalVisible", @hide="showModal")
   div(class="title") Вы уверены?
   div(class="buttons")
      div(class="buttons_load")
         v-button(class="confirm", @click="deleteHuman") Да
         v-loading-wheel(class="wheel", v-if="isLoading")
      div(class="buttons_load")
         v-button(class="confirm", @click="showModal") Нет
div(class="container")
   div(class="header")
      div(class="title") Список
      HumansListSelect(v-model="selectedSort", :options="sortOptions")
   div(class="error", v-if="listStore.error") {{ listStore.error }}
   TransitionGroup(name="list")
      div(class="list", v-for="(human, index) in sortedHumansList", :key="human._id")
         div(class="list_item")
            div(class="item_number")
               div {{ index + 1 }}.
            div(class="item_name") {{ human.fio }}
            v-button-delete(class="item_button", @click="showModal($event, human._id)")
div(class="loading")
   v-loading-wheel(v-if="listStore.isLoading")
div(class="observer")
   div(v-intersection="{ f: listStore.catchHumansList }")
</template>


<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useListStore } from '@/store/listStore'
import AssistanceService from '@/api/services/AssistanceService'
import HumansListSelect from './HumansListSelect.vue'


const listStore = useListStore();
const isModalVisible = ref(false);
const currentId = ref('');
const isLoading = ref(false);
const selectedSort = ref('');
const sortOptions = ref([
   { value: '_id', name: 'По умолчанию' },
   { value: 'fio', name: 'По фамилии' },
]);

onMounted(async (): Promise<void> => {
   if (!listStore.humansList.length) {
      listStore.catchHumansList();
   }
});

const sortedHumansList = computed(() => {
   return [...listStore.humansList].sort((a: { [name: string]: string }, b: { [name: string]: string }) => {
      return a[selectedSort.value]?.localeCompare(b[selectedSort.value]);
   });
});

function showModal(event?: Event, id?: string): void {
   isModalVisible.value = !isModalVisible.value;
   if (!event || !id) return;
   currentId.value = id;
};

async function deleteHuman(): Promise<void> {
   try {
      isLoading.value = true;
      await AssistanceService.deleteHuman(currentId.value);
      listStore.humansList = listStore.humansList.filter(item => item._id !== currentId.value);
   } catch (e: any) {
      listStore.error = e?.response?.data?.message;
   } finally {
      isLoading.value = false;
      showModal();
   }
};
</script>


<style lang="scss" scoped>
.container {
   padding: 10px;
   display: flex;
   flex-direction: column;
   align-items: center;

   & .header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: 50%;
   }

   & .error {
      color: red;
      text-align: center;
      font-weight: bolder;
   }

   & .list {
      width: 50%;
      background-color: white;
      border: 1px solid #dadce0;
      margin-top: 10px;
      border-radius: 5px;

      & .list_item {
         display: flex;
         align-items: center;

         & .item_number {
            flex-basis: 3%;
            border-right: 1px solid #dadce0;
            padding: 5px 10px;
            align-self: stretch;
            display: flex;
            align-items: center;
         }

         & .item_name {
            flex-basis: 97%;
            padding: 10px 10px;
            word-break: break-word;
         }

         & .item_button {
            margin-right: 10px;
         }
      }
   }
}

.title {
   text-align: center;
   font-size: 1.5em;
}

.buttons {
   display: flex;
   justify-content: space-between;
   padding: 30px 0 0 0;

   & .buttons_load {
      display: flex;
      align-items: center;
      padding: 5px;

      & .confirm {
         width: 65px;
      }

      & .wheel {
         margin-left: 5px;
      }
   }
}

.observer {
   padding: 1px;
   bottom: 0px;
}

.loading {
   display: flex;
   justify-content: center;
}

@media(max-width: 768px) {
   .container {

      & .list,
      & .header {
         width: 90%;
      }
   }
}

.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-move {
  transition: transform 0.8s ease;
}
</style>