<template>
  <div class="home">
    <div class="home__content" v-if="role === 'admin'">Em desenvolvimento.</div>
    <div class="home__content" v-else-if="role === 'mentor'">Em desenvolvimento.</div>
    <div class="home__content" v-else></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
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
  async mounted() {
    this.loading = true;
    const email = JSON.parse(localStorage.getItem('email'));
    console.log(email);
    await this.getUser(email?.trim());
    if (this.user) this.role = this.user.role;
    this.loading = false;
  },
});
</script>

<style lang="scss" scoped>
.home {
  padding: 5%;
}
</style>
