<template>
  <div class="home">
    <div class="home__content" v-if="user.role === 'admin'">Em desenvolvimento.</div>
    <div class="home__content" v-else-if="user.role === 'mentor'">Em desenvolvimento.</div>
    <div class="home__content" v-else>
       <search-mentor></search-mentor>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import SearchMentor from '@/components/SearchMentor.vue';

export default Vue.extend({
  components: { SearchMentor },
  name: 'Home',
  data: () => ({
    role: '',
    loading: false,
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['getUser']),
  },
});
</script>

<style lang="scss" scoped>
.home {
  padding: 5%;
  .home__content {
    text-align: center;
  }
}
</style>
