<template>
  <main class="account">
    <loading :active="loading" />
    <section class="account__content" v-if="!loading">
      <h1>Dados Cadastrais</h1>
      <label>Nome</label>
      <v-text-field
        dense
        label="Nome"
        v-model="userInfo.name"
        solo
      ></v-text-field>
      <label>Sobrenome</label>
      <v-text-field
        dense
        label="Sobrenome"
        v-model="userInfo.lastname"
        solo
      ></v-text-field>
      <label>E-mail</label>
      <v-text-field
        dense
        label="E-mail"
        v-model="userInfo.email"
        solo
      ></v-text-field>
      <label>Data de Nascimento</label>
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
        dark
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            dense
            solo
            v-model="dateFormatted"
            label="Date"
            persistent-hint
            prepend-icon="mdi-calendar"
            v-bind="attrs"
            @blur="date = parseDate(dateFormatted)"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="userInfo.birthday"
          max="2022-NaN-NaN"
          no-title
          @input="menu = false"
        ></v-date-picker>
      </v-menu>
      <footer class="account__actions">
        <v-btn
          depressed
          color="orange lighten-2"
          :loading="updatingUser"
          @click="updateUserInfo">
          Salvar
        </v-btn>
        <v-btn
          outlined
          color="orange lighten-2"
          :loading="excludingUser"
          @click="removeUserInfo">
          Excluir Conta
        </v-btn>
      </footer>
      <v-alert
          class="account__message"
          v-if="message !== ''"
          dismissible
          :type="messageType"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-alert-circle"
        >
          {{ message }}
      </v-alert>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import moment from 'moment';
import Loading from '@/components/Loading.vue';
import { User } from '@/utils/types';

export default Vue.extend({
  name: 'account',
  components: {
    Loading,
  },
  data: () => ({
    userInfo: {} as User,
    loading: false,
    updatingUser: false,
    excludingUser: false,
    menu: false,
    message: '',
    messageType: '',
  }),
  computed: {
    ...mapGetters(['user']),
    dateFormatted() {
      return moment(this.userInfo.birthday).format('DD/MM/YYYY');
    },
  },
  methods: {
    ...mapActions(['getUserById', 'updateUser', 'removeUser']),
    formatDate(date: string) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate(date: string) {
      if (!date) return null;

      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    async updateUserInfo() {
      this.message = '';
      this.updatingUser = true;

      const updated = await this.updateUser(this.userInfo).catch((error: Error) => error);

      if (updated.type !== 'success') {
        this.message = updated;
        this.messageType = 'error';
      } else {
        this.message = updated.desc;
        this.messageType = 'success';
      }
      this.updatingUser = false;
    },
    async removeUserInfo() {
      this.excludingUser = true;
      this.message = '';

      const deleted = await this.removeUser(this.userInfo).catch((error: Error) => error);

      if (deleted.type !== 'success') {
        this.message = deleted;
        this.messageType = 'error';
      } else {
        this.$router.push('/login');
        localStorage.setItem('token', '');
      }
      this.excludingUser = false;
    },
  },
  async created() {
    this.loading = true;
    const user = localStorage.getItem('user');
    if (user) await this.getUserById(JSON.parse(user).id);
    this.loading = false;
    this.userInfo = { ...this.user };
  },
});
</script>

<style lang="scss" scoped>
  main {
    padding: 0 5%;
    text-align: center;
  }

  .account {
    &__content {
      text-align: left;
      h1 {
        font-size: 1.2rem;
        margin-bottom: 2%;
      }
      label {
        margin-bottom: 1%;
        display: flex;
      }
    }

    &__actions {
      margin-top: 2%;
      display: flex;
      justify-content: space-between;
    }

    &__message {
      margin-top: 2%;
    }
  }
</style>
