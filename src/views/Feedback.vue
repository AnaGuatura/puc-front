<template>
 <main class="feedbacks">
    <h1> Feedbacks {{ user.role === 'mentor' ? 'Recebidos' : 'Concedidos' }}</h1>
    <section class="feedbacks__content">
      <v-card class="feedback" v-for="feedback in feedbacks" :key="feedback.id">
        <header class="feedback__title">
          <span> {{ formatDateToPtBR(feedback.dt_create) }} </span>
            <v-rating
            readonly
            class="feedback__rating"
            v-model="feedback.rating"
            background-color="orange lighten-3"
            color="orange"
            small
          ></v-rating>
        </header>
        <span class="feedback__mentor" v-if="user.role === 'mentorado'">
          Mentor: {{ feedback.mentor.name }}
        </span>
        <span class="feedback__mentorado" v-if="user.role === 'mentor'">
          Mentorado: {{ feedback.student.name }}
        </span>
        <div class="feedback__text">
          <span v-if="feedback.status === 'ATIVO'">{{ feedback.feedback_text }}</span>
          <span v-else>REMOVIDO PELO ADMINISTRADOR.</span>
        </div>
        <footer
          class="feedback__remove"
          v-if="user.role === 'admin' && feedback.status === 'ATIVO'"
        >
          <v-btn
            icon
            color="grey"
            @click="confirmationDialog(feedback)"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </footer>
      </v-card>
      <span v-if="feedbacks.length === 0">
        Nenhum feedback {{ user.role === 'mentor' ? 'recebido ' : 'concedido '}} até o momento.
      </span>
    </section>
    <v-dialog
      v-model="showConfirmationDialog"
      persistent
      max-width="390"
      class="feedback__confirmation"
    >
      <v-card>
        <v-card-title>Remover Feedback</v-card-title>
        <v-spacer></v-spacer>
        <v-card-text>Tem certeza que deseja remover o feedback?</v-card-text>
        <v-card-actions>
          <v-btn
            color="deep-orange lighten-2"
            outlined
            @click="showConfirmationDialog = !showConfirmationDialog"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            dense
            color="deep-orange lighten-2"
            depressed
            :loading="loadingAction"
            @click="removeFeedback()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

import { getUserInfo } from '@/utils/functions';
import { Feedback, User } from '@/utils/types';

export default Vue.extend({
  name: 'feedback',
  data: () => ({
    loading: false,
    user: {} as User,
    showConfirmationDialog: false,
    feedback: {} as Feedback,
    loadingAction: false,
  }),
  computed: {
    ...mapGetters(['feedbacks']),
  },
  methods: {
    ...mapActions(['getFeedbacks', 'updateFeedback']),
    formatDateToPtBR(date: Date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },
    async removeFeedback() {
      this.loadingAction = true;
      this.feedback.status = 'REMOVIDO';
      this.feedback.user = getUserInfo().id;
      await this.updateFeedback(this.feedback);
      this.showConfirmationDialog = false;
      this.loadingAction = false;
    },
    confirmationDialog(feed: Feedback) {
      this.feedback = feed;
      this.showConfirmationDialog = true;
    },
  },
  async mounted() {
    this.user = getUserInfo();
    this.loading = true;
    await this.getFeedbacks(this.user.id);
    this.loading = false;
  },
});
</script>

<style lang="scss" scoped>
  main {
    padding: 0 5%;
    h1 {
      text-align: left;
    }
  }

  .feedbacks {
    &__content {
      margin-top: 2%;
    }
  }

  .feedback {
    padding: 2%;
    margin-bottom: 2%;
    display: flex;
    flex-direction: column;
    &__title {
      display: flex;
      justify-content: space-between;
    }
    &__text {
      margin-top: 2%;
      font-size: 0.90rem;
      font-family: 'Roboto', sans-serif;
    }
    &__remove {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
