import { useListStore } from '@/store/listStore'

export default {
   mounted(el: HTMLElement, binding: { value: { f: () => Promise<void> } }): void {
      const listStore = useListStore();
      const options = {
         rootMargin: '0px',
         threshold: 1.0,
      };

      const callback: IntersectionObserverCallback = (entries: Array<IntersectionObserverEntry>) => {
         if (entries[0].isIntersecting && listStore.page < listStore.total) {
            binding.value.f();
         }
      }

      const observer = new IntersectionObserver(callback, options);
      observer.observe(el);
   },
   name: 'intersection',
}