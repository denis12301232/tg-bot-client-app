<template lang="pug">
v-modal(:show="isModalVisible", @hide="showModal")
   .title-list  Вы уверены?
   .buttons
      .buttons_load
         v-button.confirm(@click="deleteHuman") Да
         v-loading-wheel(v-if="isLoading")
      v-button.confirm(@click="showModal") Нет
.full-list
   .title-list Полный список
   .error(v-if="listStore.error") {{ listStore.error }}
   .list(v-for="(human, index) in listStore.humansList", :key="human._id")
      .list_item
         .number {{ index + 1 }}.
         .human {{ human.fio }}
         v-button-delete(@click="showModal($event, human._id)") test
.loading
   v-loading-wheel(v-if="listStore.isLoading")
.observer
   div(v-intersection="{ f: listStore.catchHumansList }")
</template>


<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useListStore } from "@/store/listStore";
import AssistanceService from "@/api/services/AssistanceService";

const listStore = useListStore();
const isModalVisible = ref(false);
const currentId = ref('');
const isLoading = ref(false);

onMounted(async (): Promise<void> => {
   if (!listStore.humansList.length) {
      listStore.catchHumansList();
   }
});

const showModal = (event?: Event, id?: string): void => {
   isModalVisible.value = !isModalVisible.value;
   if (!event || !id) return;
   currentId.value = id;
}

const deleteHuman = async (): Promise<void> => {
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
}
</script>


<style lang="scss" scoped>
.full-list {
   padding: 10px;
   display: flex;
   flex-direction: column;
   align-items: center;

   & .list {
      width: 50%;
      padding: 5px 10px 5px 10px;
      background-color: white;
      border: 1px solid #dadce0;
      margin-top: 10px;
      border-radius: 5px;


      &>.list_item {
         display: flex;
         padding: 5px;

         &>.number {
            flex-basis: 3%;
         }

         &>.human {
            flex-basis: 97%;
         }
      }
   }
}

.title-list {
   text-align: center;
   font-size: 1.5em;
}

.buttons {
   display: flex;
   justify-content: space-between;
   margin-top: 10px;

   & .confirm {
      width: 40px;
   }

   & .buttons_load {
      display: flex;
   }
}

.error {
   color: red;
   text-align: center;
   font-weight: bolder;
}

@media(max-width: 700px) {
   .list {
      width: 90% !important;
   }
}

.observer {
   padding: 1px;
}

.loading {
   display: flex;
   justify-content: center;
}
</style>