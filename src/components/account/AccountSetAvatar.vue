<template lang="pug">
form(class="form" @submit.prevent="onUpdateAvatar")
   QFile(v-model="avatar" class="form_input" label="Аватар" outlined accept="image/jpeg, image/png" use-chips)
      template(#append)
         QIcon(name="attach_file")
   QBtn(class="form_button" type="submit" color="primary" :loading="isAvatarLoading") Изменить
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useFetch } from '@/hooks'
import { ToolsService } from '@/api/services'


const formData = ref<FormData | null>(null);
const avatar = ref<File | null>(null);

watchEffect(() => {
   if (avatar.value) {
      formData.value = new FormData();
      formData.value.append('avatar', avatar.value);
   }
});

const { f: onUpdateAvatar, loading: isAvatarLoading } = useFetch({
   fn: () => ToolsService.setAvatar(formData.value!).then(() => avatar.value = null),
   successMsg: 'Изменено',
   alert: true
});
</script>

<style scoped lang="scss">
.form {
   margin-top: 10px;

   & .form_input {
      margin-top: 5px;

      & i {
         cursor: pointer;
         color: $primary;

         &:hover {
            color: $secondary;
         }
      }
   }

   & .form_button {
      margin-top: 5px;
   }

}
</style>