<template>
  <v-progress-circular
    v-if="active"
    :size="50"
    color="amber"
    indeterminate
  ></v-progress-circular>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'loading',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>

</style>
