import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

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
      const url = 'http://localhost:3000';
      return axios.post(`${url}/users`, user)
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
      const url = 'http://localhost:3000';
      return axios.post(`${url}/login`, credentials).then((response) => {
        if (response) {
          commit('setUserAuthentication', true);
          localStorage.setItem('token', JSON.stringify(response.data));
          localStorage.setItem('email', JSON.stringify(credentials.email));
        }
      }).catch((e) => {
        commit('setUserAuthentication', false);
        throw new Error(e.response.data.error);
      });
    },
    async getAreas({ commit }) {
      const url = 'http://localhost:3000';
      return axios.get(`${url}/areas`).then((response) => {
        if (response) {
          commit('setAreas', response.data);
        }
      }).catch((e) => {
        commit('setAreas', []);
        throw new Error(e.response.data.error);
      });
    },
    async getPayments({ commit }) {
      const url = 'http://localhost:3000';
      return axios.get(`${url}/payments`).then((response) => {
        if (response) {
          commit('setPayments', response.data);
        }
      }).catch((e) => {
        commit('setPayments', []);
        throw new Error(e.response.data.error);
      });
    },
    async getTechnologies({ commit }) {
      const url = 'http://localhost:3000';
      return axios.get(`${url}/technologies`).then((response) => {
        if (response) {
          commit('setTechnologies', response.data);
        }
      }).catch((e) => {
        commit('setTechnologies', []);
        throw new Error(e.response.data.error);
      });
    },
    async createTechnologies({ commit, state }, technologies) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/technologies`, technologies).then((response) => {
        if (response.data) commit('setTechnologies', response.data);
      }).catch((e) => {
        commit('setTechnologies', state.technologies);
        throw new Error(e.response.data.error);
      });
    },
    async createSkills({ commit }, skills) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/skills`, skills).catch((e) => {
        throw new Error(e.response.data.error);
      });
    },
    async createPayments({ commit }, payments) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/payments`, payments).catch((e) => {
        throw new Error(e.response.data.error);
      });
    },
    async getUser({ commit }, email) {
      const url = 'http://localhost:3000';
      const token = JSON.parse(localStorage.getItem('token'));
      return axios.get(`${url}/users/${email}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.data) {
          commit('setUser', response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
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
