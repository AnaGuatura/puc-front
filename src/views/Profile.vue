<template>
  <main class="profile">
    <section class="profile__content">
      <aside>
        <div class="profile__mobile" v-if="display < 768">
          <v-btn icon @click="show = !show"><v-icon color="#fb8a69">mdi-menu</v-icon></v-btn>
          Menu
        </div>
        <div class="profile__user-info" v-show="show || display > 768">
          <div class="profile__img">
            <v-avatar
            color="#1cb0a8"
            size="80"
            >
            <span class="white--text text-h5">
              {{ user.name[0] | toUpperCase }}{{ user.lastname[0] | toUpperCase}}
            </span>
            </v-avatar>
          </div>
          <h1>Oi, {{ user.name }}!</h1>
        </div>
        <nav v-show="show || display > 768">
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
    display: window.innerWidth,
    show: false,
    menu: {
      admin: [
        {
          name: 'Minha Conta',
          path: '/account',
        },
        {
          name: 'Feedbacks',
          path: '/feedback',
        },
        {
          name: 'Usuários',
          path: '/users',
        },
        {
          name: 'Tecnologias',
          path: '/technologies',
        },
      ],
      mentor: [
        {
          name: 'Minha Conta',
          path: '/account',
        },
        {
          name: 'Mentorias',
          path: '/mentoring',
        },
        {
          name: 'Feedbacks',
          path: '/feedback',
        },
      ],
      mentorado: [
        {
          name: 'Minha Conta',
          path: '/account',
        },
        {
          name: 'Mentorias',
          path: '/mentoring',
        },
        {
          name: 'Feedbacks',
          path: '/feedback',
        },
      ],
    },
  }),
  computed: {
    ...mapGetters(['user']),
  },
  filters: {
    toUpperCase: (value: string) => value.charAt(0).toUpperCase(),
  },
  methods: {
    ...mapActions(['getUser']),
    onResize() {
      this.display = window.innerWidth;
    },
    verifyRoute(path: string) {
      const route = this.$router.currentRoute.path;
      return path === route ? 'active' : '';
    },
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
});
</script>

<style lang="scss" scoped>
$small: 600px;
$medium: 768px;

.profile {
  display: flex;
  font-family: 'Raleway', sans-serif;
  .profile__content {
    display: flex;
    width: 100%;
    @media screen and (max-width: $medium)
    {
      flex-direction: column;
    }
    aside {
      background-color: #edebeb;
      width: 20%;
      position: fixed;
      height: 100vh;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      padding: 2%;
      @media screen and (max-width: $medium)
      {
        width: 100%;
        position: relative;
        height: auto;
      }
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
        @media screen and (max-width: $medium)
        {
          padding: 2%;
        }
      }
    }

    section {
      margin-left: 20%;
      width: 80%;
      @media screen and (max-width: $medium)
      {
        margin-left: 0%;
        width: 100%;
      }
    }
  }
  &__user-info {
    display: flex;
    justify-content: center;
    font-weight: bold;
    flex-direction: column;
    align-items: center;
    padding-top: 10%;
    h1 {
      padding: 5% 0;
    }
  }

  &__mobile {
    color: #fb8a69;
    font-weight: bold;
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
