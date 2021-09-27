<template>
  <v-app class="superior-menu">
    <header class="header" v-if="!isAuthenticated">
      <hr>
      <router-link :to="'/'">
        <span>MADS</span>
      </router-link>
      <nav>
        <ul>
          <router-link :to="'register'">
            <li>
              Inscreva-se
            </li>
          </router-link>
          <router-link :to="'login'">
            <li>
              Entrar
            </li>
          </router-link>
        </ul>
      </nav>
    </header>
    <header class="header" v-else>
      <hr>
      <router-link :to="'/'">
        <span>MADS</span>
      </router-link>
      <nav>
        <ul>
          <router-link :to="'home'">
            <li>
              Home
            </li>
          </router-link>
          <router-link :to="'account'">
            <li>
              Perfil
            </li>
          </router-link>
          <router-link :to="{name: 'Landing', query: {logout: true}}">
            <li>
              Logout
            </li>
          </router-link>
        </ul>
      </nav>
    </header>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  data: () => ({
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
  }

    hr {
    margin: 1.5em auto;
    position: relative;
    height: 9px !important;
    width: 10px;
    border: transparent;
    overflow: visible;
    background-image: url('data:image/svg+xml;utf8,<svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><rect x="0.75" y="0.5" width="8" height="8" rx="4" fill="%231CB0A8" /></svg>');
    &:before {
      position: absolute;
      height: 9px;
      width: 10px;
      content: '';
      background-image: url('data:image/svg+xml;utf8,<svg width="10" height="9" viewBox="0 0 10 9" xmlns="http://www.w3.org/2000/svg"><path d="M3.91043 1.29752C4.30449 0.688518 5.19551 0.688519 5.58957 1.29752L9.25143 6.95675C9.68196 7.62211 9.20436 8.5 8.41186 8.5H1.08814C0.29564 8.5 -0.181954 7.62211 0.248574 6.95675L3.91043 1.29752Z" fill="%23FCB643" /></svg>');
      left: -18px;
    }
    &:after {
      position: absolute;
      height: 9px;
      width: 9px;
      content: '';
      background-image: url('data:image/svg+xml;utf8,<svg width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><rect x="0.75" y="0.5" width="8" height="8" rx="1" fill="%23EF4056" /></svg>');
      right: -18px;
    }
  }

  .superior-menu {
    width: 100%;
  }

  .header {
    font-family: 'Raleway', sans-serif;
    padding: 0 5%;
    display: flex;
    width: 100%;
    height: 50px;
    font-size: 0.80rem;
    align-items: center;
    a {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.87) !important;
    }
    hr {
      margin-left: 20px;
      margin-top: 17px;
    }
    span {
      font-size: 1rem;
      font-weight: bold;
      margin-left: 25px;
      letter-spacing: 5px;
    }
    nav {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      ul {
        a {
          text-decoration: none;
          color: inherit;
        }
        li {
          text-transform: uppercase;
          font-weight: bold;
          color: #fb8a69;
          display: inline;
          margin: 0.5rem;
        }
      }
    }
  }
</style>
