<template lang="pug">
.error
   .error-info
      .error-code 403
      .error-text Forbidden
</template>

<style lang="scss" scoped>
.error {
   position: absolute;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   & > .error-info {
      text-align: center;
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      & > .error-code {
         font-size: 7em;
      }
      & > .error-text {
         font-size: 2em;
      }
   }
}
</style>