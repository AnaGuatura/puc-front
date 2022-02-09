<template>
  <main class="mentor">
    <v-btn
      class="previous"
      icon
      color="deep-orange lighten-2"
      @click="$router.go(-1)"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div class="mentor__loading">
      <loading :active="loadingMentorData"></loading>
    </div>
    <section class="mentor__info" v-show="!loadingMentorData">
      <div class="mentor__presentation">
        <div class="mentor__image">
          <v-avatar color="indigo" size="100">
            <v-icon dark size="75">
              mdi-account-circle
            </v-icon>
          </v-avatar>
        </div>
        <div class="mentor__description">
          <h1> {{ user.name }} {{ user.lastname }}</h1>
          <span>{{ user.about_user_description }}</span>
          <span>{{ user.experiences_description }}</span>
        </div>
      </div>
      <div class="mentor__add-info">
        <div class="add-info__row">
          <div>E-mail: <span>{{ user.email }}</span></div>
          <div>Formas de Pagamento aceitas:
            <v-chip v-for="payment in user.payments" :key="payment.id">
              {{ payment.payment.type }}
            </v-chip>
          </div>
        </div>
        <div class="add-info__row">
          <div>Telefone: <span>{{ user.phone }}</span></div>
          <div>Mentorias solicitadas: <span>{{ events.length }}</span></div>
        </div>
        <div class="add-info__row">
          <div>Mentor desde: <span>{{ formatData(user.created_at) }}</span></div>
          <div>Média de Avaliação:
            <v-rating
              readonly
              class="feedback__rating"
              :value="getRating()"
              background-color="orange lighten-3"
              color="orange"
              medium
            ></v-rating>
          </div>
        </div>
      </div>
    </section>
    <section class="mentor__skills" v-show="!loadingMentorData">
      <h1>Tecnologias</h1>
      <div class="mentor__detail">
        <div class="mentor__technologies">
          <div class="mentor__technology" v-for="skill in user.skills" :key="skill.id">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-chip draggable v-bind="attrs" v-on="on">
                  {{ skill.technology.name }}
                </v-chip>
              </template>
              <span>tempo de experiência: {{ skill.experience_time }} ano(s)</span>
              <span>, preço por mentoria: R$ {{ skill.price }}</span>
            </v-tooltip>
          </div>
        </div>
        <v-btn
          color="orange lighten-2"
          outlined
          depressed
          @click="verifySchedule"
        >
          Verificar Agenda
        </v-btn>
      </div>
    </section>
    <section class="mentor__feedbacks" v-show="!loadingMentorData">
      <h1>Feedbacks Recebidos</h1>
      <div class="feedback" v-for="feedback in user.feedbacks" :key="feedback.id">
        <div class="feedback__title">
          <span>{{ formatDateToPtBR(feedback.dt_create) }}</span>
          <v-rating
              readonly
              class="feedback__rating"
              v-model="feedback.rating"
              background-color="orange lighten-3"
              color="orange"
              medium
            ></v-rating>
        </div>
        <div class="feedback__text"> {{ feedback.feedback_text }} </div>
      </div>
    </section>
    <v-dialog
      v-model="showCalendar"
    >
      <v-sheet height="700">
        <div
          class="dialog__toolbar"
        >
          <v-btn
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Hoje
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            color="grey darken-2"
            @click="showCalendar = !showCalendar"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-calendar
          class="calendar"
          ref="calendar"
          :locale="'pt-br'"
          v-model="focus"
          :now="today"
          color="#ffb74d"
          type="week"
          :events="events"
          :event-ripple="false"
          @click:time="addEvent"
          @click:event="showEvent"
        >
        </v-calendar>
      </v-sheet>
    </v-dialog>
    <v-dialog
      v-model="showScheduleInfo"
      persistent
      max-width="390"
      class="confirmation"
    >
      <v-card>
        <v-card-title>Solicitação de Mentoria</v-card-title>
        <v-spacer></v-spacer>
        <v-card-subtitle>Mentoria agendada para: {{ scheduleDate.date }}
          (Início: {{ scheduleDate.start }}, Fim: {{ scheduleDate.end }}).
        </v-card-subtitle>
        <v-card-text>
          Informe uma breve descrição sobre qual assunto a ser abordado na mentoria
          para que o mentor possa analisá-lo e retornar assim que possível a solicitação.
        </v-card-text>
        <v-spacer/>
        <v-textarea
          v-model="description"
          class="confirmation__text"
          outlined color="grey">
        </v-textarea>
        <v-card-actions>
           <v-btn
            color="grey"
            outlined
            @click="showScheduleInfo = !showScheduleInfo"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            depressed
            color="deep-orange lighten-2"
            :loading="loadingInvitation"
            @click="sendInvitation"
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

import loading from '@/components/Loading.vue';
import {
  EventInfo,
  Feedback,
  Mentoring,
  ScheduleInfo,
} from '@/utils/types';
import {
  convertData,
  formatEvents,
  getUserInfo,
  formatDateToPtBR,
} from '@/utils/functions';

export default Vue.extend({
  name: 'mentor',
  components: {
    loading,
  },
  data: () => ({
    loadingMentorData: true,
    showCalendar: false,
    today: new Date().toISOString().substr(0, 10),
    focus: '',
    showScheduleInfo: false,
    scheduleDate: {} as ScheduleInfo,
    description: '',
    loadingInvitation: false,
    mentorId: '',
    events: [] as Array<EventInfo>,
  }),
  computed: {
    ...mapGetters(['user', 'mentorings']),
  },
  methods: {
    ...mapActions(['getUserById', 'createMentoring', 'getMentoring']),
    formatData(date: string) {
      return moment(date).format('DD/MM/YYYY');
    },
    verifySchedule() {
      this.showCalendar = !this.showCalendar;
      this.getMentoring(this.mentorId);
    },
    prev() {
      if (this.$refs.calendar) (this.$refs.calendar as any).prev();
    },
    next() {
      if (this.$refs.calendar) (this.$refs.calendar as any).next();
    },
    setToday() {
      this.focus = '';
    },
    addEvent(event: any) {
      if (event.date < this.today) return;

      this.showScheduleInfo = !this.showScheduleInfo;

      const fullDate = `${event.date} ${event.time}`;
      const date = moment(fullDate).format('DD/MM/YYYY');
      const start = moment(fullDate).format('HH:mm');
      const end = moment(fullDate).add(1, 'hours').format('HH:mm');

      this.scheduleDate = { start, end, date };
    },
    async sendInvitation() {
      this.loadingInvitation = true;

      const date = convertData(`${this.scheduleDate.date} ${this.scheduleDate.start}`);
      const start = new Date(moment(date).format('YYYY-MM-DD hh:mm'));
      const end = new Date(moment(date).add(1, 'hours').format('YYYY-MM-DD hh:mm'));

      const user = getUserInfo();

      const invitation = {
        name: `Solicitação - ${user.name}`,
        mentor: this.mentorId,
        student: user.id,
        dt_initial: start,
        dt_final: end,
        invitation_text: this.description,
      } as Mentoring;

      const mentoring = await this.createMentoring(invitation)
        .finally(() => {
          this.loadingInvitation = false;
        });

      if (mentoring.type === 'success') {
        this.description = '';
        this.showScheduleInfo = !this.showScheduleInfo;
      }
    },
    showEvent() {
      this.showScheduleInfo = !this.showScheduleInfo;
    },
    getRating() {
      const totalFeeds = this.user.feedbacks.length;
      const sum = this.user.feedbacks.reduce((acc: number, curr: Feedback) => {
        let average = acc;
        average = (average || 0) + curr.rating;
        return average;
      }, 0);

      console.log(sum, totalFeeds);

      return sum / totalFeeds;
    },
  },
  async mounted() {
    this.mentorId = this.$route.params.id;
    this.loadingMentorData = true;
    if (this.mentorId) await this.getUserById(this.mentorId);
    this.loadingMentorData = false;
  },
  watch: {
    mentorings: {
      handler(curr) {
        if (curr) this.events = formatEvents(curr);
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
  .mentor {
    padding: 0% 20%;
    margin-bottom: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    &__loading {
      align-items: center;
      width: 100%;
      justify-content: center;
      display: flex;
    }
    &__presentation {
      display: flex;
      align-items: center;
    }
    &__description {
      margin-left: 5%;
      h1 {
        text-transform: capitalize;
      }
    }
    &__add-info{
      width: 100%;
      margin-top: 2.5%;
      display: flex;
      justify-content: space-around;
      gap: 10%;
      font-size: 0.95rem;
      font-weight: 500;
      span {
        font-weight: normal;
      }
      div {
        width: 100%;
      }
    }

    &__skills {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      margin-top: 5%;
      h1 {
        padding: 2.5% 0;
      }
    }
    &__detail {
      width: 100%;
      display: flex;
      gap: 2%;
      margin-bottom: 5%;
      justify-content: space-between;
    }
    &__technologies {
      width: 100%;
      display: flex;
      gap: 2%;
      flex-wrap: wrap;
    }
    &__feedbacks {
      margin-top: 2.5%;
    }
  }

  .add-info {
    width: 100%;
    &__row {
      div {
        padding: 1.5% 0;
      }
    }
  }
  .previous {
    margin: 2% 0 2.5%;
  }

  .dialog {
    &__toolbar {
      justify-content: center;
      align-items: center;
      display: flex;
      height: 65px;
      top: 0;
      background-color: white;
      padding: 1%;
    }
  }

  .confirmation {
    &__text {
      padding: 5%;
    }
  }

  .feedback {
    display: flex;
    flex-direction: column;
    margin: 2% 0;
    &__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2%;
      font-size: 0.90rem;
      color: #858080;
    }
  }
</style>
