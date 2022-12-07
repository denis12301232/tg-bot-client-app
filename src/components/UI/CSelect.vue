<template lang="pug">
div(:class="['wrapper', isActive ? 'active': '']")
   div(
      class="select-btn", 
      tabindex="0", 
      ref="select",
      @click.stop="onClick",
      @focus="onFocus",
      @blur="[emit('touch'), onBlur]",
      )
      span(class="value") {{modelValue}}
      v-icon(class="icon") mdi-triangle-small-down
   label(:class="['label', checked || modelValue  ? 'selected': '']") {{ label }}
   div(:class="['content', position === 'top' ? 'top': '', {'content_dark':dark}]")
      ul(class="options", )
         li(v-if="!items.length") Нечего выбирать
         li(v-else, v-for="item in items", @click.stop="updateModel", :class="[item === modelValue ? 'checked': '', 'item']") {{item}} 
</template>
   
   
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useTheme } from '@/hooks/useTheme'

defineProps({
   modelValue: {
      type: String,
   },
   label: {
      type: String,
      required: true
   },
   items: {
      type: Array,
      default: [],
   }
});
const emit = defineEmits(['update:modelValue', 'touch']);

onMounted(() => {
   onScroll();
   document.addEventListener('click', onClose);
   document.addEventListener('scroll', onScroll);
});
onBeforeUnmount(() => {
   document.removeEventListener('click', onClose);
   document.removeEventListener('scroll', onScroll);
});

const { dark } = useTheme();
const isActive = ref(false);
const checked = ref(false);
const select = ref<HTMLDivElement>();
const position = ref('');

function onScroll() {
   const coords = select.value?.getBoundingClientRect()!;
   const top = coords.top;
   const bottom = document.documentElement.clientHeight - coords.bottom;
   top >= bottom ? position.value = 'top' : position.value = 'bottom';
}

function onFocus() {
   checked.value = true;
}

function onBlur() {
   checked.value = false;
}

function updateModel(event: Event) {
   const target = event.target as HTMLLIElement;
   emit('update:modelValue', target.textContent);
   onClick();
}

function onClick() {
   isActive.value = !isActive.value;
   isActive.value ? checked.value = true : checked.value = false;
}

function onClose() {
   isActive.value = false;
   checked.value = false;
}
</script>
   
<style lang="scss" scoped>
.wrapper {
   width: 100%;
   position: relative;

   & .select-btn {
      border-bottom: 1px solid #e0e0e0;
      background-color: transparent;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      z-index: 2;

      &:focus {
         border-bottom: 1px solid #1a73a8;
      }

      & .icon {
         font-size: 31px;
         transition: transform 0.3s linear;
         position: absolute;
         right: 0;
      }
   }

   & .content {
      padding: 5px;
      display: none;
      transition: 0.3s;
      position: absolute;
      width: 100%;
      background-color: #ccc;
      z-index: 100;

      & .options {
         max-height: 250px;
         margin-top: 10px;
         overflow-y: auto;

         &::-webkit-scrollbar {
            width: 7px;
         }

         &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 25px;
         }

         &::-webkit-scrollbar-thumb {
            background: rgb(108, 113, 114);
            border-radius: 25px;
         }

         & .item {
            height: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            padding: 0 5px;
            user-select: none;

            &:hover {
               background-color: #3d3e42;
               color: #f1f1f1;
            }
         }
      }
   }
}

.top {
   top: -275px;
}

.active {
   & .content {
      display: block;
   }

   & .icon {
      transform: rotate(-180deg);
   }
}

.selected {
   top: -5px !important;
   transition: 0.3s;
}

.value {
   position: absolute;
   top: 15px;
}

.checked {
   background-color: #313134;
   color: white;
}

.label {
   position: absolute;
   transition: 0.3s;
   color: #9e9e9e;
   top: 15px;
   z-index: 1;
   user-select: none;
}

.content_dark {
   background-color: rgb(48, 46, 51) !important;
}
</style>