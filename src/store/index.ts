import Vue from 'vue';
import Vuex from 'vuex';
import api from './api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    userCreated: {},
    areas: [],
    payments: [],
    technologies: [],
    error: '',
    user: {},
  },
  mutations: {
    setError(state, message) {
      state.error = message;
    },
    setUserAuthentication(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setUserCreated(state, isCreated) {
      state.userCreated = isCreated;
    },
    setAreas(state, areas) {
      state.areas = areas;
    },
    setPayments(state, payments) {
      state.payments = payments;
    },
    setTechnologies(state, technologies) {
      state.technologies = technologies;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async register({ commit }, user) {
      return api.post('/users', user)
        .then((response) => {
          if (response.data) {
            commit('setUserCreated', response.data);
          }
        })
        .catch((e) => {
          throw new Error(e.response.data.error);
        });
    },
    async login({ commit }, credentials) {
      return api.post('/login', credentials).then((response) => {
        if (response) {
          commit('setUserAuthentication', true);
          commit('setUser', response.data.user);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }).catch((e) => {
        commit('setUserAuthentication', false);
        commit('setUser', {});
        throw new Error(e.response.data.error);
      });
    },
    async getAreas({ commit }) {
      return api.get('/areas').then((response) => {
        if (response) {
          commit('setAreas', response.data);
        }
      }).catch((e) => {
        commit('setAreas', []);
        throw new Error(e.response.data.error);
      });
    },
    async getPayments({ commit }) {
      return api.get('/payments').then((response) => {
        if (response) {
          commit('setPayments', response.data);
        }
      }).catch((e) => {
        commit('setPayments', []);
        throw new Error(e.response.data.error);
      });
    },
    async getTechnologies({ commit }) {
      return api.get('/technologies').then((response) => {
        if (response) {
          commit('setTechnologies', response.data);
        }
      }).catch((e) => {
        commit('setTechnologies', []);
        throw new Error(e.response.data.error);
      });
    },
    async createTechnologies({ commit, state }, technologies) {
      return new Promise((resolve, reject) => {
        api.post('/technologies', technologies).then((response) => {
          if (response.data) {
            commit('setTechnologies', response.data);
            resolve(response.data);
          }
        }).catch((e) => {
          commit('setTechnologies', state.technologies);
          reject(e.response.data);
        });
      });
    },
    async createSkills({ commit }, skills) {
      return new Promise((resolve, reject) => {
        api.post('/skills', skills).then((response) => {
          if (response.data) resolve(response.data);
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async createPayments({ commit }, payments) {
      return new Promise((resolve, reject) => {
        api.post('/skills', payments).then((response) => {
          if (response.data) resolve(response.data);
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async searchMentors({ commit }, info) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.get(`/users/technology?id=${info.id}&experience=${info.experience}&price=${info.price}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            if (response.data) resolve(response.data);
          }).catch((e) => {
            reject(e.response.data.error);
          });
      });
    },
    async loginGoogle({ commit }) {
      return api.get('/google').then((response) => {
        if (response) {
          const link = document.createElement('a');
          link.href = response.request.responseURL;
          link.click();
        }
      }).catch((e) => {
        throw new Error(e.response.data.error);
      });
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    userCreated: (state) => state.userCreated,
    areas: (state) => state.areas,
    payments: (state) => state.payments,
    technologies: (state) => state.technologies,
    user: (state) => state.user,
  },
});
