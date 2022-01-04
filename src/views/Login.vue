<template>
    <main class="login">
      <h1>Bem-vindo de volta!</h1>
      <section class="login__form">
        <section>
          <label>E-mail</label>
          <v-text-field
            dense
            label="E-mail"
            v-model="user.email"
            solo
          ></v-text-field>
          <label>Senha</label>
          <v-text-field
            dense
            label="Senha"
            v-model="user.password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            solo
          ></v-text-field>
          <footer>
            <v-btn
              dense
              color="orange lighten-2"
              depressed
              :loading="loading"
              @click="authenticate">
              Login
            </v-btn>
            <v-btn
              dense
              color="orange lighten-2"
              depressed
              :loading="loadingGoogle"
              @click="authenticateWithGoogle">
              Continuar com o Google
              <v-icon right>mdi-google</v-icon>
            </v-btn>
          </footer>
          <v-alert
            class="login__error"
            v-if="error !== ''"
            dismissible
            color="#ef4054"
            border="left"
            elevation="2"
            colored-border
            icon="mdi-alert-circle"
          >
            {{ error }}
          </v-alert>
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
    loadingGoogle: false,
    show: false,
    error: '',
  }),
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    ...mapActions(['login', 'loginGoogle']),
    async authenticate() {
      this.error = '';
      this.loading = true;
      await this.login({
        email: this.user.email,
        password: this.user.password,
      }).catch((error) => {
        this.loading = false;
        this.error = error;
      });

      if (this.isAuthenticated) {
        this.loading = false;
        this.$router.push({ path: '/home' });
      }
    },
    authenticateWithGoogle() {
      this.loadingGoogle = true;
      this.loginGoogle();
    },
  },
});
</script>

<style lang="scss" scoped>
$small: 600px;
$medium: 768px;

.login {
  padding: 5%;
  width: 100%;
  font-family: 'Raleway', sans-serif;
  &__form {
    margin-top: 5%;
    display: flex;
    section {
      width: 50%;
      @media screen and (max-width: $medium)
      {
        width: 100%;
      }
    }
    label {
      margin-bottom: 2%;
      display: flex;
    }
    aside {
      width: 45%;
      margin-left: 5%;
      margin-top: -10%;
      @media screen and (max-width: $medium)
      {
        display: none;
      }
      img {
        width: 90%;
        margin: 0 auto;
        display: flex;
        border-radius: 3px 150px 150px;
        align-items: center;
        justify-content: center;
      }
    }

    footer {
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: $medium)
      {
        flex-direction: column;
        width: 100%;

        button {
          margin-bottom: 5%;
        }
      }
    }
  }
  &__error {
    margin-top: 5%;
  }
}
</style>
