import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Feedback from '../views/Feedback.vue';
import Profile from '../views/Profile.vue';
import Account from '../views/Account.vue';
import store from '../store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Landing',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Landing.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/profile',
    component: Profile,
    children: [
      {
        path: '/feedback',
        component: Feedback,
      },
      {
        path: '/account',
        component: Account,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    store.commit('setUser', JSON.parse(user));
    store.commit('setUserAuthentication', true);
  }

  if (to.name === 'Landing' || to.name === 'Register') {
    next();
  } else if (to.name !== 'Login' && !store.state.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
