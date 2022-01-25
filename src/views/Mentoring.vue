<template>
  <main class="mentoring">
     <loading :active="loading" />
    <section class="mentoring__content">
      <h1>Mentorias</h1>
      <div class="mentorings">
        <v-card class="mentorings__event" v-for="mentoring in mentorings" :key="mentoring.id">
          <header>
            <span> Data de Solicitação: {{ formatDateToPtBR(mentoring.dt_initial) }} </span>
            <span> Status: {{ mentoring.status }}</span>
          </header>
          <section class="mentorings__description">
            <span>{{ user.role !== 'mentor' ?
              `Mentor: ${mentoring.mentor.name}` : `Mentorado: ${ mentoring.student.name }`}}
            </span>
            <span>{{ mentoring.invitation_text  }}</span>
          </section>
          <footer>
            <v-menu
              bottom
              left
            >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                color="grey"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list v-if="mentoring.status.toUpperCase() !== 'CONCLUÍDA'">
              <v-list-item
                @click="redirectToAction(item.toUpperCase())"
                v-for="(item, i) in menu" :key="i">
                <span v-if="item">{{ item }}</span>
              </v-list-item>
            </v-list>
            <v-list v-else>
              <v-list-item @click="redirectToAction('FEEDBACK')">
                Conceder Feedback
              </v-list-item>
            </v-list>
          </v-menu>
          </footer>
        </v-card>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

import { getUserInfo } from '@/utils/functions';

import loading from '@/components/Loading.vue';
import { User } from '@/utils/types';

export default Vue.extend({
  name: 'mentoring',
  components: {
    loading,
  },
  data: () => ({
    loading: false,
    user: {} as User,
    menu: ['item'] as Array<string>,
  }),
  computed: {
    ...mapGetters(['mentorings']),
  },
  methods: {
    ...mapActions(['getMentoring']),
    formatDateToPtBR(date: Date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },
    redirectToAction(action: string) {
      console.log(action);
    },
    setMenuFromUser() {
      if (this.user.role === 'mentor') {
        this.menu = ['Responder', 'Concluir'];
      } else {
        this.menu = ['Excluir', 'Concluir'];
      }
    },
  },
  async mounted() {
    this.user = getUserInfo();
    this.loading = true;
    if (this.user) {
      this.setMenuFromUser();
      await this.getMentoring(this.user.id);
      this.loading = false;
    }
  },
});
</script>

<style lang="scss" scoped>
  main {
    padding: 0 5%;
    text-align: center;
  }

  .mentoring {
    &__content {
      text-align: left;
      h1 {
        font-size: 1.2rem;
        margin-bottom: 2%;
      }
    }
  }

  .mentorings {
    &__event {
      padding: 2%;
      margin-bottom: 2%;
      header {
        display: flex;
        justify-content: space-between;
      }
      footer {
        display: flex;
        justify-content: flex-end;
      }
    }
    &__description {
      display: flex;
      flex-direction: column;
      span {
        margin-top: 2%;
      }
    }
  }
</style>
