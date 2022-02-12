<template>
  <div class="home">
    <div class="home__content">
      <search-mentor></search-mentor>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import SearchMentor from '@/components/SearchMentor.vue';

export default Vue.extend({
  components: { SearchMentor },
  name: 'Home',
  computed: {
    ...mapGetters(['user']),
  },
  created() {
    if (this.$route.query.user) {
      this.$router.replace('/home');
    }
  },
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  .home__content {
    text-align: center;
    height: 100%;
  }
}
</style>
