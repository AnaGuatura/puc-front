import Vue from 'vue';
import Vuex from 'vuex';

import api from './api';
import {
  Feedback,
  Mentoring,
  Technology,
  User,
} from '@/utils/types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    userCreated: {},
    areas: [],
    payments: [],
    technologies: [],
    mentorings: [] as Array<Mentoring>,
    error: '',
    user: {},
    users: [],
    feedbacks: [] as Array<Feedback>,
    statistics: [],
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
    setUsers(state, users) {
      state.users = users;
    },
    setMentorings(state, mentorings) {
      state.mentorings = mentorings;
    },
    setFeedbacks(state, feedbacks) {
      state.feedbacks = feedbacks;
    },
    setStatistics(state, statistics) {
      state.statistics = statistics;
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
      return new Promise((resolve, reject) => {
        api.post('/login', credentials).then((response) => {
          if (response) {
            commit('setUserAuthentication', true);
            commit('setUser', response.data.user);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            resolve(response.data.user);
          }
        }).catch((e) => {
          commit('setUserAuthentication', false);
          commit('setUser', {});
          reject(e.response.data.error);
        });
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
    async deleteTechnology({ commit }, id: string) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.delete(`/technologies/${id}`,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })
          .then((response) => {
            if (response.data) {
              resolve({ type: 'success', desc: 'Removido.' });
            }
          }).catch((e) => {
            reject(e.response.data);
          });
      });
    },
    async createTechnologies({ commit, state }, technologies) {
      return new Promise((resolve, reject) => {
        api.post('/technologies', technologies).then((response) => {
          if (response.data) {
            const oldTechnologies = state.technologies as Array<Technology>;
            response.data.forEach((tech: Technology) => {
              oldTechnologies.push(tech);
            });
            commit('setTechnologies', oldTechnologies);
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
        api.post('/payments', payments).then((response) => {
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
    async getUserById({ commit }, id: string) {
      const token = localStorage.getItem('token');
      return api.get(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
        if (response) {
          commit('setUser', response.data);
        }
      }).catch((e) => {
        throw new Error(e.response.data.error);
      });
    },
    async getUsers({ commit }) {
      const token = localStorage.getItem('token');
      return api.get('/users', { headers: { Authorization: `Bearer ${token}` } }).then((response) => {
        if (response) {
          commit('setUsers', response.data);
        }
      }).catch((e) => {
        throw new Error(e.response.data.error);
      });
    },
    async updateUser({ commit }, user: User) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.put('/users', user, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response) {
            if (response.data.affected > 0) resolve({ type: 'success', desc: 'Dados alterados com sucesso!' });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async removeUser({ commit }, user: User) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.delete(`/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            resolve({ type: 'success', desc: 'Removido.' });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async createMentoring({ commit }, mentoring: Mentoring) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.post('/mentoring', mentoring, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            commit('setMentorings', response.data);
            resolve({ type: 'success', desc: 'Solicitação enviada.' });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async getMentoring({ commit }, id: string) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.get(`/mentoring/${id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            commit('setMentorings', response.data);
            resolve({ type: 'success', data: response.data });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async getStatistics({ commit }) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.get('/statistics', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          resolve({ type: 'success', data: response.data });
          commit('setStatistics', response.data);
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async updateMentoring({ commit }, mentoring: Mentoring) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.put(`/mentoring/${mentoring.id}`, mentoring, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            const mentorings = this.state.mentorings.map((m: Mentoring) => {
              let temp = m;
              if (m.id === response.data.id) {
                temp = response.data;
              }
              return temp;
            });
            commit('setMentorings', mentorings);
            resolve({ type: 'success', data: response.data });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async createFeedback({ commit }, feedback: Feedback) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.post('/feedback', feedback, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            commit('setFeedbacks', response.data);
            resolve({ type: 'success', data: response.data });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async getFeedbacks({ commit }, id: string) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.get(`/feedback/${id}`, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            commit('setFeedbacks', response.data);
            resolve({ type: 'success', data: response.data });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
      });
    },
    async updateFeedback({ commit }, feedback: Feedback) {
      const token = localStorage.getItem('token');
      return new Promise((resolve, reject) => {
        api.put('/feedback', feedback, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        }).then((response) => {
          if (response.data) {
            commit('setFeedbacks', response.data);
            resolve({ type: 'success', data: response.data });
          }
        }).catch((e) => {
          reject(e.response.data.error);
        });
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
    mentorings: (state) => state.mentorings,
    feedbacks: (state) => state.feedbacks,
    users: (state) => state.users,
    statistics: (state) => state.statistics,
  },
});
