<template>
  <v-app>
    <!-- Закомментил, это справа шестернка такая плавучая была с выпадающем меню -->
    <!-- <core-filter /> -->

    <core-toolbar />

    <core-drawer />

    <core-view />
  </v-app>
</template>

<style lang="scss">
@import '@/styles/index.scss';

/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>
