<template>
    <main class="login">
      <h1>Bem-vindo de volta!</h1>
      <section class="login__form">
        <section>
          <v-text-field
            dense
            label="E-mail"
            v-model="user.email"
            solo
          ></v-text-field>
          <v-text-field
            dense
            label="Senha"
            v-model="user.password"
            type="password"
            solo
          ></v-text-field>
          <footer>
            <v-btn
            color="orange lighten-2"
              depressed
              :loading="loading"
              @click="authenticate">
              Login
            </v-btn>
            <v-btn
            color="orange lighten-2"
              depressed
              disabled
              @click="login">
              <v-icon>mdi-google</v-icon>
              Continuar com o Google
            </v-btn>
          </footer>
        </section>
        <aside>
          <img :src="require(`@/assets/login.jpeg`)" alt class="icon" />
        </aside>
      </section>
    </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { Credentials } from '../utils/types';

export default Vue.extend({
  name: 'login',
  data: () => ({
    user: {
      email: '',
      password: '',
    } as Credentials,
    loading: false,
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['login']),
    async authenticate() {
      this.loading = true;
      await this.login({
        email: this.user.email,
        password: this.user.password,
      });

      if (this.isAuthenticated) {
        this.loading = false;
        this.$router.push({ path: '/home' });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.login {
  padding: 5%;
  width: 100%;
  font-family: 'Raleway', sans-serif;
  &__form {
    margin-top: 5%;
    display: flex;
    section {
      width: 50%;
    }
    aside {
      width: 45%;
      margin-left: 5%;
      margin-top: -10%;
      img {
        width: 100%;
        display: flex;
        border-radius: 3px 150px 150px;
        align-items: center;
        justify-content: center;
      }
    }

    footer {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
