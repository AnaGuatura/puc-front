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
  },
  mutations: {
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
  },
  actions: {
    async register({ commit }, user) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/users`, user).then((response) => {
        if (response) {
          commit('setUserCreated', response);
        }
      }).catch(() => {
        commit('setUserCreated', {});
      });
    },
    async login({ commit }, credentials) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/login`, credentials).then((response) => {
        if (response) {
          commit('setUserAuthentication', true);
          localStorage.setItem('token', JSON.stringify(response.data));
        }
      }).catch(() => {
        commit('setUserAuthentication', false);
      });
    },
    async getAreas({ commit }) {
      const url = 'http://localhost:3000';
      return axios.get(`${url}/areas`).then((response) => {
        if (response) {
          commit('setAreas', response.data);
        }
      }).catch(() => {
        commit('setAreas', []);
      });
    },
    async getPayments({ commit }) {
      const url = 'http://localhost:3000';
      return axios.get(`${url}/payments`).then((response) => {
        if (response) {
          commit('setPayments', response.data);
        }
      }).catch(() => {
        commit('setPayments', []);
      });
    },
    async getTechnologies({ commit }) {
      const url = 'http://localhost:3000';
      return axios.get(`${url}/technologies`).then((response) => {
        if (response) {
          commit('setTechnologies', response.data);
        }
      }).catch(() => {
        commit('setTechnologies', []);
      });
    },
    async createTechnologies({ commit, state }, technologies) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/technologies`, technologies).then((response) => {
        if (response.data) commit('setTechnologies', response.data);
      }).catch(() => {
        commit('setTechnologies', state.technologies);
      });
    },
    async createSkills({ commit, state }, skills) {
      const url = 'http://localhost:3000';
      return axios.post(`${url}/technologies`, skills).then((response) => {
        if (response.data) {
          console.log('adicionou as skills');
        }
      }).catch(() => {
        commit('setTechnologies', state.technologies);
      });
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    userCreated: (state) => state.userCreated,
    areas: (state) => state.areas,
    payments: (state) => state.payments,
    technologies: (state) => state.technologies,
  },
});
