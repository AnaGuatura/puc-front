<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>

<style lang="scss">
  .theme--light.v-application {
    background-color: #fcfcfc !important;
  }
  .v-btn__content {
    font-weight: bold;
    color: #fb8a69 !important;
    :hover {
      color: #fff !important;
      background-color: #fb8a69 !important;
    }
  }
</style>
