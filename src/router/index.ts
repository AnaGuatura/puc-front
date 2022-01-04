import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Feedback from '../views/Feedback.vue';
import Profile from '../views/Profile.vue';
import Account from '../views/Account.vue';
import Mentoring from '../views/Mentoring.vue';
import User from '../views/Users.vue';
import Technologies from '../views/Technologies.vue';
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
    path: '/mentor/:id',
    name: 'Mentor',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Mentor.vue'),
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
      {
        path: '/mentoring',
        component: Mentoring,
      },
      {
        path: '/users',
        component: User,
      },
      {
        path: '/technologies',
        component: Technologies,
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
  } else if (to.query.user && to.query.token) {
    localStorage.setItem('token', to.query.token.toString());
    store.commit('setUser', JSON.parse(to.query.user.toString()));
    localStorage.setItem('user', to.query.user.toString());
    store.commit('setUserAuthentication', true);
    next();
  } else if (to.name !== 'Login' && !store.state.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
