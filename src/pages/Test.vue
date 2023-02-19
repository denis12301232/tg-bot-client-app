<template lang="pug">
UserAvatar(name="tt" avatar="" color="primary")
QBtnGroup(flat)
   QBtn(round flat icon="check_circle" color="positive")
   QBtn(round flat icon="add_circle_outline" color="yellow")
   QBtn(round flat icon="info" color="indigo")
   QBtn(round flat icon="cancel" color="negative")
</template>
   
<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue'
</script>
   
<style scoped lang="scss">

</style>