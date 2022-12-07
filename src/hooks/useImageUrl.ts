export function useImageUrl(name: string){
   return new URL(`/src/assets/images/${name}`, import.meta.url).href;
}