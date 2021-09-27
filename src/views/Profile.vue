<template>
  <main class="profile">
    <section class="profile__content">
      <aside>
        <div class="profile__user-info">
          <div class="profile__img"></div>
          <h1>Oi, {{ user.name }}!</h1>
        </div>
        <nav>
          <ul>
            <div class="profile__menu" v-for="menu in menu[user.role]" :key="menu.name">
              <router-link :to="menu.path">
                <li :class="verifyRoute(menu.path)">
                  <span>{{ menu.name }}</span>
                  <v-icon v-if="verifyRoute(menu.path) === 'active'">mdi-chevron-right</v-icon>
                </li>
              </router-link>
            </div>
          </ul>
        </nav>
      </aside>
      <section>
        <router-view></router-view>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Profile',
  data: () => ({
    loading: false,
    menu: {
      admin: [
        {
          name: 'Minha Conta',
          path: '/account',
        },
        {
          name: 'Feedbacks',
          path: '',
        },
        {
          name: 'Usuários',
          path: '',
        },
        {
          name: 'Tecnologias',
          path: '',
        },
      ],
      mentor: [
        {
          name: 'Minha Conta',
          path: '/account',
        },
        {
          name: 'Mentorias',
          path: '',
        },
        {
          name: 'Feedbacks',
          path: '',
        },
        {
          name: 'Agenda',
          path: '',
        },
      ],
      mentorado: [
        {
          name: 'Minha Conta',
          path: '/account',
        },
        {
          name: 'Mentorias',
          path: '',
        },
        {
          name: 'Feedbacks',
          path: '',
        },
      ],
    },
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['getUser']),
    verifyRoute(path: string) {
      const route = this.$router.currentRoute.path;
      console.log(path, route);
      return path === route ? 'active' : '';
    },
  },
});
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  font-family: 'Raleway', sans-serif;
  .profile__content {
    display: flex;
    width: 100%;
    aside {
      background-color: #edebeb;
      width: 20%;
      position: fixed;
      height: 100vh;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      a {
        text-decoration: none;
        color: inherit;
      }
      ul {
        padding: 0 10% !important;
      }
      li {
        list-style: none;
        padding: 5%;
        display: flex;
        justify-content: space-between;
      }
    }

    section {
      margin-left: 20%;
      width: 80%;
    }
  }
  &__user-info {
    display: flex;
    justify-content: center;
    font-weight: bold;
    flex-direction: column;
    // color: #fb8a69;
    align-items: center;
    padding-top: 10%;
    h1 {
      padding: 5% 0;
    }
  }

  &__img {
    padding-top: 5%;
    height: 150px;
    width: 150px;
    // border: 1px solid;
    // border-color: #fcb643;
    border-radius: 50%;
  }
}

.active {
  color: #ef4056;
  font-weight: bold;
  i {
    color: #fcb643;
  }
}
</style>
