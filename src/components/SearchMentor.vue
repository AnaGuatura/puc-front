<template>
  <section class="search">
    <div class="search__options">
      <v-select
        dense
        v-model="selectedArea"
        :items="areas"
        item-text="name"
        label="Áreas"
        return-object
        solo
      ></v-select>
      <v-autocomplete
        dense
        v-model="selectedTechnology"
        :items="technologies.filter((t) => t.area === selectedArea.id)"
        :loading="false"
        :disabled="!technologies.filter((t) => t.area === selectedArea.id).length"
        color="white"
        hide-no-data
        hide-selected
        item-text="name"
        label="Technologia"
        item-value="id"
        solo
        return-object
      ></v-autocomplete>
      <v-btn
        depressed
        color="orange lighten-2"
        :loading="loading"
        @click="search">
        Pesquisar
      </v-btn>
    </div>
    <div class="search__results">
      <div v-if="mentors.length && selectedArea.id && selectedTechnology.id">
        <span class="search__message">
          Encontramos <span>&nbsp;{{ mentors.length }}&nbsp;</span>
            mentores pra te ajudar. Olha só:
        </span>
        <v-card class="result" v-for="mentor in mentors" :key="mentor.id">
          <div class="result__image">
            <v-avatar
              color="#1cb0a8"
              size="80"
            >
              <span class="white--text text-h5">
                {{ mentor.user.name[0] | toUpperCase }}{{ mentor.user.lastname[0] | toUpperCase}}
              </span>
            </v-avatar>
          </div>
          <div class="result__info">
            <div class="info__name">
              <span>{{ mentor.user.name }}</span>
            </div>
            <div class="info__description">
              <span>Sobre: {{ mentor.user.about_user_description }}</span>
              <span class="info__detail">
                Atua há {{ mentor.experience_time }} anos com essa tecnologia
              </span>
            </div>
          </div>
          <div class="info__cta">
            <v-btn
              color="orange lighten-2"
              outlined
              depressed>
              Verificar Agenda
            </v-btn>
          </div>
        </v-card>
      </div>
      <div v-if="message !== ''">
        <span class="search__message">
          Ops! Não encontramos nenhum resultado para a sua pesquisa.
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { Technology, Area, User } from '@/utils/types';

export default Vue.extend({
  name: 'search',
  data: () => ({
    loading: false,
    selectedArea: {} as Area,
    selectedTechnology: {} as Technology,
    mentors: [] as Array<User>,
    message: '',
  }),
  computed: {
    ...mapGetters(['areas', 'technologies']),
  },
  filters: {
    toUpperCase: (value: string) => value.charAt(0).toUpperCase(),
  },
  methods: {
    ...mapActions(['getAreas', 'getTechnologies', 'searchMentors']),
    async search() {
      const technology = this.technologies
        .find((t: Technology) => t.area === this.selectedArea.id
          && t.name === this.selectedTechnology.name);
      this.mentors = await this.searchMentors(technology.id);
      if (this.mentors.length === 0) {
        this.message = 'Nenhum resultado encontrado';
      }
    },
  },
  created() {
    if (this.areas.length === 0 && this.technologies.length === 0) {
      this.getAreas();
      this.getTechnologies();
    }
  },
});
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    flex-direction: column;
    width: 100%;
  &__options {
    display: flex;
    align-items: flex-start;
    gap: 5%;
    width: 100%;
  }
  &__message {
    padding: 2% 0;
    display: flex;
    font-size: 1.1rem;
    span {
      font-weight: bold;
      color: #fb8a69;
    }
  }
  &__results {
    width: 100%;
    position: relative;
  }
}

.result {
  display: flex;
  width: 100%;
  margin-bottom: 5%;
  padding: 2%;
  align-items: center;
  &__image {
    margin-right: 2%;
    margin-left: 2%;
  }
  &__info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}

.info {
  width: 100%;
  &__name {
    font-weight: bold;
    font-size: 1.1rem;
    padding-bottom: 2%;
    span {
      display: flex;
      align-items: flex-start;
    }
  }
  &__description {
    text-align: left;
    font-size: 0.95rem;
    display: flex;
    flex-direction: column;
    span {
      display: flex;
      align-items: flex-start;
    }
  }
  &__detail {
    font-size: 0.8rem;
    padding-top: 2%;
  }
}
</style>
