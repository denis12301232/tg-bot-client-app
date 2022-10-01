import { useHumanStore } from '@/store/humanStore'

interface Binding {
   value: {
      f: () => Promise<void>
   }
}

export default {
   name: 'intersection',
   mounted(el: HTMLElement, binding: Binding): void {
      const humanStore = useHumanStore();
      const options = {
         rootMargin: '0px',
         threshold: 1.0,
      };

      const callback: IntersectionObserverCallback = (entries: Array<IntersectionObserverEntry>) => {
         if (entries[0].isIntersecting && humanStore.list.page < humanStore.list.total) {
            binding.value.f();
         }
      };

      const observer = new IntersectionObserver(callback, options);
      observer.observe(el);
   },
}