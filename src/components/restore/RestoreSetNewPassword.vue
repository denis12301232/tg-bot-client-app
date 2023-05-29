<template>
  <QForm ref="formRef" :class="$style.settings" @submit.prevent="request(password, link)">
    <h5 class="q-pa-lg text-center">Введите новый пароль</h5>
    <QInput
      v-model="password"
      standout
      :rules="rules"
      lazy-rules
      label="Пароль"
      :type="visible ? 'text' : 'password'"
      counter
      maxlength="20"
      autocomplete="new-password"
      :error="!!error"
      :error-message="typeof error === 'object' ? error.message : error"
    >
      <template #append>
        <QIcon :name="visible ? 'eva-eye' : 'eva-eye-off'" :class="$style.icon" @click="showPassword" />
      </template>
    </QInput>
    <div class="row justify-center">
      <QBtn type="submit" :disable="!valid || loading" :loading="loading">Изменить</QBtn>
    </div>
    <div v-if="message" :class="$style.message">{{ message }}</div>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@/hooks';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';

const route = useRoute();
const password = ref('');
const formRef = ref<QForm | null>(null);
const visible = ref(false);
const valid = ref(false);
const message = ref('');
const link = computed(() => String(route.query.link));
const rules = [
  (v: string) => Validate.required(v) || 'Заполните поле',
  (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов',
];
const { request, loading, error } = useFetch(AuthService.restorePassword, {
  afterResponse: () => {
    password.value = '';
    message.value = 'Пароль изменен!';
  },
});

watch(password, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});

function showPassword() {
  visible.value = !visible.value;
}
</script>

<style lang="scss" module>
.settings {
  max-width: 500px;
  width: 100%;
}

.icon {
  cursor: pointer;
  color: $primary;

  &:hover {
    color: $secondary;
  }
}

.message {
  color: $positive;
  padding: 5px 0;
  font-size: 1.1em;
  font-weight: bolder;
}
</style>
