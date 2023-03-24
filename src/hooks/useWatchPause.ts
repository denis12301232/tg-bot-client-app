import { watch, type WatchSource, type WatchStopHandle, type WatchOptions, type WatchCallback } from 'vue'


export default function useWatchPause<T>(source: WatchSource<T> | WatchSource<T>[], callback: WatchCallback<WatchSource<T> | WatchSource<T>[], WatchSource<T> | WatchSource<T>[] | undefined>, options?: WatchOptions) {
   let unwatch: WatchStopHandle | null = watch(source, callback, options);

   function stop() {
      unwatch && unwatch();
      unwatch = null;
   }

   function resume() {
      unwatch || (unwatch = watch(source, callback, options));
   }

   return { stop, resume }
}