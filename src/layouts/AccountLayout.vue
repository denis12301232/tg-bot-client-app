<template>
  <QLayout view="hHh lpR fFf">
    <QHeader elevated class="header" height-hint="98">
      <QToolbar>
        <QBtn icon="eva-arrow-back" color="red-10" dense flat round @click="$router.push('/')" />
        <QToolbarTitle>Настройки аккаунта</QToolbarTitle>
      </QToolbar>
    </QHeader>
    <QPageContainer class="window-height">
      <slot />
    </QPageContainer>
  </QLayout>
</template>
