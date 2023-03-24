import type { DefineComponent } from 'vue'
import 'vue-router'

declare module 'vue-router' {
   export interface RouteMeta {
      layout?: string;
      layoutComponent?: DefineComponent;
      layoutProps?: { [name: string]: any };
   }
}