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
    <section class="mentor__info">
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
          <div>Visualizações no perfil (último mês): <span>{{ user.email }}</span></div>
        </div>
        <div class="add-info__row">
          <div>Telefone: <span>{{ user.phone }}</span></div>
          <div>Mentorias solicitadas: <span>{{ user.phone }}</span></div>
        </div>
        <div class="add-info__row">
          <div>Mentor desde: <span>{{ formatData(user.created_at) }}</span></div>
          <div>Média de Avaliação: <span>{{ formatData(user.created_at) }}</span></div>
        </div>
      </div>
    </section>
    <section class="mentor__skills">
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
        >
          Verificar Agenda
        </v-btn>
      </div>
    </section>
    <section class="mentor__feedbacks">
      <h1>Feedbacks Recebidos</h1>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default Vue.extend({
  name: 'mentor',
  data: () => ({
    loadingMentorData: false,
  }),
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['getUserById']),
    formatData(date: string) {
      return moment(date).format('DD/MM/YYYY');
    },
  },
  async created() {
    const { id } = this.$route.params;
    this.loadingMentorData = true;
    if (id) await this.getUserById(id);
    this.loadingMentorData = false;
  },
});
</script>

<style lang="scss" scoped>
  .mentor {
    padding: 0% 15%;
    display: flex;
    flex-direction: column;
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
</style>
