<template>
  <main class="mentoring">
    <loading :active="loading" />
    <section class="mentoring__content">
      <div class="mentoring__filters">
        <div
          :class="{ active : active === 'OPEN'}"
          @click="showOpenMentories()">
            EM ABERTO
        </div>
        <div
          :class="{ active : active === 'FINISHED'}"
          @click="showFinishedMentories()">
            CONCLUÍDAS
        </div>
        <div
          :class="{ active : active === 'CANCELED'}"
          @click="showCanceledMentories()">
            CANCELADAS
        </div>
      </div>
      <div class="mentorings">
        <v-card class="mentorings__event" v-for="mentoring in mentories" :key="mentoring.id">
          <header>
            <div class="mentorings__status">
              <span>
               {{ mentoring.name }}
                ({{ formatDateToPtBR(mentoring.dt_initial) }}
                - {{ formatDateToPtBR(mentoring.dt_final) }})
              </span>
            </div>
            <div class="mentorings__status">
              <v-chip :color="getStatusColor(mentoring.status)">
                {{ mentoring.status }}
              </v-chip>
            </div>
          </header>
          <section class="mentorings__description">
            <div class="mentorings__status">
              <span>
                {{ user.role !== 'mentor' ? mentoring.mentor.name : mentoring.student.name }}
              </span>
            </div>
            <span class="mentorings__invitation-text">{{ mentoring.invitation_text  }}</span>
            <div class="mentorings__status mentorings__status-declined"
              v-if="mentoring.status.toUpperCase() === 'CANCELADA PELO MENTOR'">
               <b>Motivo da recusa: </b><span> {{ mentoring.decline_text  }}</span>
            </div>
          </section>
          <footer>
            <v-menu
              bottom
              left
              v-if="!mentoring.status.includes('CANCELADA')"
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
              <v-list class="menu" v-if="mentoring.status.toUpperCase() !== 'CONCLUÍDA'">
                <v-list-item
                  @click="redirectToAction(item.toUpperCase(), mentoring)"
                  v-for="(item, i) in menu" :key="i">
                  <span v-if="item">{{ item }}</span>
                </v-list-item>
              </v-list>
              <v-list class="menu" v-else>
                <v-list-item @click="redirectToAction('FEEDBACK')">
                  Conceder Feedback
                </v-list-item>
              </v-list>
          </v-menu>
          </footer>
        </v-card>
      </div>
    </section>
    <v-dialog
      v-model="showDeclinationModal"
      persistent
      max-width="390"
      class="declination"
    >
      <v-card>
        <v-card-title>Recusa</v-card-title>
        <v-spacer></v-spacer>
        <v-card-text>
          Informe uma breve descrição sobre o porquê
          você está recusando a solicitação de mentoria.
        </v-card-text>
        <v-spacer/>
        <v-card-text>Tem certeza que deseja recusar a solicitação?</v-card-text>
        <v-textarea
          v-model="declinationText"
          class="declination__text"
          outlined color="grey">
        </v-textarea>
        <v-card-actions>
          <v-btn
            color="grey"
            outlined
            @click="showDeclinationModal = !showDeclinationModal"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            depressed
            color="deep-orange lighten-2"
            :loading="loadingAction"
            :disabled="declinationText === ''"
            @click="declineInvitation"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showFeedback"
      persistent
      max-width="390"
      class="feedback"
    >
      <v-card>
        <v-card-title>Feedback</v-card-title>
        <v-spacer></v-spacer>
        <div class="feedback__evaluate">
          <v-card-text>
            Nota:
          </v-card-text>
          <v-rating
            class="feedback__rating"
            v-model="rating"
            background-color="orange lighten-3"
            color="orange"
            medium
          ></v-rating>
        </div>
        <v-card-text>
          Como foi sua experiência?
          Informe uma breve descrição sobre o que você achou sobre o mentor
          e a mentoria realizada.
        </v-card-text>
        <v-spacer/>
        <v-textarea
          v-model="feedbackText"
          class="declination__text"
          outlined color="grey">
        </v-textarea>
        <v-card-actions>
          <v-btn
            color="grey"
            outlined
            @click="showFeedback = !showFeedback; rating = 0; feedbackText = ''"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            depressed
            color="deep-orange lighten-2"
            :loading="loadingAction"
            :disabled="feedbackText === '' && rating === 0"
            @click="declineInvitation"
          >
            Enviar
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

import loading from '@/components/Loading.vue';
import { Mentoring, User } from '@/utils/types';

export default Vue.extend({
  name: 'mentoring',
  components: {
    loading,
  },
  data: () => ({
    loading: false,
    loadingAction: false,
    user: {} as User,
    menu: ['item'] as Array<string>,
    showDeclinationModal: false,
    declinationText: '',
    mentoring: {} as Mentoring,
    mentories: [] as Array<Mentoring>,
    active: 'OPEN',
    showFeedback: false,
    rating: 0,
    feedbackText: '',
  }),
  computed: {
    ...mapGetters(['mentorings']),
  },
  methods: {
    ...mapActions(['getMentoring', 'updateMentoring']),
    formatDateToPtBR(date: Date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },
    async acceptInvitation() {
      const invitation = this.mentoring;
      this.loadingAction = true;
      invitation.status = 'CONFIRMADA PELO MENTOR';
      await this.updateMentoring(invitation);
      this.loadingAction = false;
    },
    async declineInvitation() {
      const invitation = this.mentoring;
      invitation.status = 'CANCELADA PELO MENTOR';
      invitation.decline_text = this.declinationText;
      await this.updateMentoring(invitation);
      this.showDeclinationModal = !this.showDeclinationModal;
    },
    async completeInvitation() {
      const invitation = this.mentoring;
      const today = new Date();
      if (new Date(invitation.dt_final) < today) {
        invitation.status = 'CONCLUÍDA';
        await this.updateMentoring(invitation);
      }
    },
    async cancelInvitation() {
      const invitation = this.mentoring;
      invitation.status = 'CANCELADA PELO MENTORADO';
      await this.updateMentoring(invitation);
    },
    redirectToAction(action: string, mentoring: Mentoring) {
      this.mentoring = mentoring;
      switch (action.toUpperCase()) {
        case 'ACEITAR':
          this.acceptInvitation();
          break;
        case 'REJEITAR':
          this.showDeclinationModal = true;
          this.mentoring = mentoring;
          break;
        case 'EXCLUIR':
          this.cancelInvitation();
          break;
        case 'FEEDBACK':
          this.showFeedback = true;
          this.mentoring = mentoring;
          break;
        default:
          this.completeInvitation();
      }
    },
    setMenuFromUser() {
      if (this.user.role === 'mentor') {
        this.menu = ['Aceitar', 'Rejeitar', 'Concluir'];
      } else {
        this.menu = ['Excluir', 'Concluir'];
      }
    },
    getStatusColor(status: string) {
      let color = '';
      switch (status.toUpperCase()) {
        case 'AGUARDANDO CONFIRMAÇÃO DO MENTOR':
          color = '#F6CE8F';
          break;
        case 'CONFIRMADA PELO MENTOR':
          color = '#FFF';
          break;
        case 'CANCELADA PELO MENTOR':
          color = '#FFC29A';
          break;
        case 'CANCELADA PELO MENTORADO':
          color = '#FFC586';
          break;
        default:
          color = '#ADB96D';
      }

      return color;
    },
    showOpenMentories() {
      this.active = 'OPEN';
      this.mentories = this.mentorings
        .filter((m: Mentoring) => m.status === 'CONFIRMADA PELO MENTOR' || m.status === 'AGUARDANDO CONFIRMAÇÃO DO MENTOR');
    },
    showFinishedMentories() {
      this.active = 'FINISHED';
      this.mentories = this.mentorings
        .filter((m: Mentoring) => m.status === 'CONCLUÍDA');
    },
    showCanceledMentories() {
      this.active = 'CANCELED';
      this.mentories = this.mentorings
        .filter((m: Mentoring) => m.status === 'CANCELADA PELO MENTOR' || m.status === 'CANCELADA PELO MENTORADO');
    },
  },
  async mounted() {
    this.user = getUserInfo();
    this.loading = true;
    if (this.user) {
      this.setMenuFromUser();
      await this.getMentoring(this.user.id);
      this.loading = false;
      this.mentories = this.mentorings;
      this.showOpenMentories();
    }
  },
});
</script>

<style lang="scss" scoped>
  .active {
    border-bottom: 2px solid #fcb643;
  }
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
    &__filters {
      display: flex;
      margin-bottom: 2%;
      gap: 3%;
      div {
        cursor: pointer;
      }
    }
  }

  .mentorings {
    &__event {
      padding: 2%;
      margin-bottom: 2%;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.87);
      font-size: 0.95rem;
      header {
        display: flex;
        justify-content: space-between;
      }
      footer {
        display: flex;
        justify-content: flex-end;
      }
    }
    &__status {
      width: 50%;
      display: flex;
      align-items: center;
      &:last-child {
        display: flex;
        justify-content: flex-end;
      }
      &-declined {
        border-top: 1px solid #eee;
        margin-top: 2%;
        padding-top: 2%;
        width: 100%;
        justify-content: flex-start !important;
        span {
          margin-left: 10px;
        }
      }
    }
    &__description {
      display: flex;
      flex-direction: column;
    }
    &__invitation-text {
      margin-top: 2%;
      font-family: "Roboto", sans-serif;
    }
    &__declination-text {
      border-top: 1px solid #eee;
      margin-top: 2%;
      padding-top: 2%;
      font-family: "Roboto", sans-serif;
    }
  }

  .declination {
    &__text {
      padding: 5%;
    }
  }

  .status {
    &__circle {
      width: 5px;
      height: 100%;
      margin-right: 1%;
    }
  }
  .menu {
    font-family: "Roboto", sans-serif;
    font-size: 0.90rem;
    text-transform: lowercase;
  }

  .feedback {
    font-family: "Roboto", sans-serif;
    &__rating {
      padding: 0 4%;
    }
    &__evaluate {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
