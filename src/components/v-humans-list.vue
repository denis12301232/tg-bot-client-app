<template lang="pug">
div.full-list
   div.title-list Полный список
   div.error(v-if="listStore.error") {{ listStore.error }}
   .list(v-for="(human, index) in listStore.humansList")
      .list_item
         div.number {{ index + 1 }}.
         div.human {{ human }}
div.loading
   v-loading-wheel(v-if="listStore.isLoading")
div.observer
   div(v-intersection="{ f: listStore.catchHumansList }")
</template>


<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useListStore } from "@/store/listStore";

export default defineComponent({
   setup() {
      const listStore = useListStore();

      onMounted(async () => {
         if (!listStore.humansList.length) {
            listStore.catchHumansList();
         }
      });

      return { listStore }
   }
});
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