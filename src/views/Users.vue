<template>
 <main class="users">
    <h1>Usuários</h1>
    <section class="users__search">
      <v-text-field
        solo
        label="Buscar pelo nome"
        v-model="search"
        append-icon="mdi-magnify"
        @input="searchUser"
      ></v-text-field>
      <v-select
        :items="['mentor', 'mentorado']"
        v-model="type"
        label="Tipo de usuário"
        @input="searchUser"
        solo
      ></v-select>
    </section>
    <section class="users__content">
      <v-card class="user" v-for="user in tempUsers" :key="user.id">
        <header class="user__title">
          <span> Nome: {{ user.name }} {{ user.lastname }}</span>
          <span> E-mail: {{ user.email }}</span>
          <span> Tipo: {{ user.role }}</span>
        </header>
        <footer
          class="user__remove"
        >
          <v-btn
            icon
            color="grey"
            @click="confirmationDialog(user)"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </footer>
      </v-card>
    </section>
    <v-dialog
      v-model="showConfirmationDialog"
      persistent
      max-width="390"
      class="user__confirmation"
    >
      <v-card>
        <v-card-title>Remover usuário</v-card-title>
        <v-spacer></v-spacer>
        <v-card-text>Tem certeza que deseja remover o usuário?</v-card-text>
        <v-card-actions>
          <v-btn
            color="grey"
            outlined
            @click="showConfirmationDialog = !showConfirmationDialog"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            depressed
            color="deep-orange lighten-2"
            :loading="loadingAction"
            @click="removeUserById()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { User } from '@/utils/types';

export default Vue.extend({
  name: 'users',
  data: () => ({
    loading: false,
    showConfirmationDialog: false,
    loadingAction: false,
    user: {} as User,
    search: '',
    tempUsers: [] as Array<User>,
    type: '',
  }),
  computed: {
    ...mapGetters(['users']),
  },
  methods: {
    ...mapActions(['getUsers', 'removeUser']),
    confirmationDialog(user: User) {
      this.showConfirmationDialog = true;
      this.user = user;
    },
    async removeUserById() {
      this.loadingAction = true;
      await this.removeUser(this.user);
      await this.getUsers();
      this.loadingAction = false;
      this.showConfirmationDialog = false;
    },
    searchUser() {
      this.tempUsers = this.users
        .filter((u: User) => u.name.includes(this.search) && this.type === u.role);
    },
  },
  async mounted() {
    this.tempUsers = this.users;
    this.loading = true;
    await this.getUsers();
    this.loading = false;
  },
});
</script>

<style lang="scss" scoped>
  main {
    padding: 0 5%;
    h1 {
      text-align: left;
    }
  }

  .users {
    &__search {
      margin-top: 2%;
      display: flex;
      gap: 2%;
    }
  }

  .user {
    padding: 2%;
    margin-bottom: 2%;
    display: flex;
    flex-direction: column;
    font-family: "Roboto", sans-serif;
    font-size: 0.90rem;
    &__title {
      display: flex;
      flex-direction: column;
      span {
        padding: 0.5% 0;
      }
    }
    &__remove {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      right: 10px;
      align-items: center;
      height: 100%;
    }
  }
</style>
