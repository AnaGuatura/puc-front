<template>
  <section class="search">
    <div class="search__options">
      <div class="options__mobile" v-if="display <= 768">
        <v-btn icon @click="show = !show"><v-icon color="#fb8a69">mdi-menu</v-icon></v-btn>
        Filtros
      </div>
      <div class="options__row" v-show="show || display > 768">
        <label>Área de Atuação</label>
        <v-select
          dense
          v-model="selectedArea"
          :items="areas"
          item-text="name"
          label="Áreas"
          return-object
          solo
        ></v-select>
        <label>Tecnologia</label>
        <v-autocomplete
          dense
          v-model="selectedTechnology"
          :items="technologies.filter((t) => t.area === selectedArea.id)"
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
      </div>
      <div class="options__row options__row--filter" v-show="show || display > 768">
        <label>Tempo de Experiência</label>
        <v-text-field
          class="options__experience"
          v-model="experience"
          dense
          type="number"
          label="Anos"
          solo
          required
        ></v-text-field>
        <label>Preço por hora <div v-if="price !== 0">&nbsp;(R$ {{ price }},00)</div></label>
        <v-slider
          v-model="price"
          thumb-label
          color="orange lighten-2"
          min="0"
          max="500"
          track-color="grey"
        ></v-slider>
        <div class="options__clear">
        <v-btn
          depressed
          color="orange lighten-2"
          :loading="loading"
          :disabled="!selectedTechnology.id || !selectedArea.id"
          @click="search">
          Pesquisar
        </v-btn>
        <v-btn
          depressed
          color="grey"
          :loading="loading"
          @click="clear">
          Limpar
        </v-btn>
        </div>
      </div>
    </div>
    <div class="search__results">
      <div v-if="mentors.length">
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
              <span>
                <v-rating
                  v-show="false"
                  v-model="rating"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="$ratingFull"
                  half-increments
                  hover
                  small
                ></v-rating>
              </span>
            </div>
            <div class="info__description">
              <span>{{ mentor.user.about_user_description }}</span>
              <span class="info__detail">
                Atua há {{ mentor.experience_time }} anos com essa tecnologia
              </span>
            </div>
          </div>
          <div class="info__cta">
            <v-btn
              disabled
              color="orange lighten-2"
              outlined
              depressed>
              Contratar
            </v-btn>
          </div>
        </v-card>
      </div>
      <div v-else>
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
    rating: 0,
    price: 0,
    experience: null,
    display: window.innerWidth,
    show: false,
  }),
  computed: {
    ...mapGetters(['areas', 'technologies']),
  },
  filters: {
    toUpperCase: (value: string) => value.charAt(0).toUpperCase(),
  },
  methods: {
    ...mapActions(['getAreas', 'getTechnologies', 'searchMentors']),
    onResize() {
      this.display = window.innerWidth;
    },
    async search() {
      const technology = this.technologies
        .find((t: Technology) => t.area === this.selectedArea.id
          && t.name === this.selectedTechnology.name);
      const info = {
        id: technology.id,
        experience: this.experience || 0,
        price: this.price,
      };

      this.loading = true;
      this.mentors = await this.searchMentors(info);
      console.log(this.mentors);
      if (this.mentors.length === 0) {
        this.message = 'Nenhum resultado encontrado';
      }
      this.loading = false;
    },
    async clear() {
      this.selectedArea = {} as Area;
      this.selectedTechnology = {} as Technology;
      this.price = 0;
      this.experience = null;

      this.loading = true;
      this.mentors = await this.searchMentors({ id: '', experience: 0, price: 0 });
      this.loading = false;
    },
  },
  async created() {
    window.addEventListener('resize', this.onResize);

    if (this.areas.length === 0 && this.technologies.length === 0) {
      this.getAreas();
      this.getTechnologies();
    }
    this.mentors = await this.searchMentors({ id: '', experience: 0, price: 0 });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
});
</script>

<style lang="scss" scoped>
$small: 600px;
$medium: 768px;

.search {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  @media screen and (max-width: $medium)
  {
    flex-direction: column;
  }
  &__options {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 25%;
    padding: 2%;
    background-color: #edebeb;
    padding-top: 5%;
    text-align: left;
    height: 100%;
    @media screen and (max-width: $medium)
    {
      width: 100%;
      margin-bottom: 5%;
      padding-top: 2%;
    }
    label {
      display: flex;;
      margin-bottom: 4%;
    }
  }
  &__message {
    padding: 2% 0;
    display: flex;
    font-size: 1.2rem;
    span {
      font-weight: bold;
      color: #fb8a69;
    }
  }
  &__results {
    width: 75%;
    position: relative;
    padding: 0 5%;
    @media screen and (max-width: $medium)
    {
      width: 100%;
    }
  }
}

.result {
  display: flex;
  width: 100%;
  margin-bottom: 3%;
  padding: 3%;
  align-items: center;
  @media screen and (max-width: $small)
  {
    padding: 5%;
    flex-direction: column;
  }
  &__image {
    margin-right: 2%;
    margin-left: 2%;
  }
  &__info {
    display: flex;
    flex-direction: column;
    width: 100%;
    @media screen and (max-width: $small)
    {
      padding-bottom: 10%;
    }
  }
}

.info {
  width: 100%;
  &__name {
    font-weight: bold;
    font-size: 1.1rem;
    padding-bottom: 2%;
    display: flex;
    align-items: center;
    gap: 2%;
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
  &__cta {
    padding-left: 2%;
  }
}

.options {
  &__row {
    width: 100%;
    gap: 5%;
    color: rgba(0, 0, 0, 0.6);
    align-items: center;
  }
  &__experience {
    width: 100%;
  }
  &__clear {
    display: flex;
    justify-content: space-between;
  }
  &__mobile {
    // padding-bottom: 5%;
    color: #fb8a69;
    font-weight: bold;
    display: flex;
    align-items: center;
    font-size: 1.1rem;
  }
}
</style>
