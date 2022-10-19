interface Binding {
   value: {
      f: () => any;
      canLoad: () => boolean;
   }
}

class Observer {
   name = 'intersection';
   observer: null | IntersectionObserver = null;

   constructor() {
      this.mounted = this.mounted.bind(this);
      this.beforeUnmount = this.beforeUnmount.bind(this);
   }

   mounted(el: HTMLElement, binding: Binding) {

      const options = {
         rootMargin: '0px',
         threshold: 1.0,
      };

      const callback: IntersectionObserverCallback = (entries) => {
         if (entries[0].isIntersecting && binding.value.canLoad()) {
            binding.value.f();
         }
      };

      this.observer = new IntersectionObserver(callback, options);
      this.observer.observe(el);
   }

   beforeUnmount() {
      this.observer?.disconnect();
   }
}

export default new Observer;