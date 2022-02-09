<template>
  <main class="technologies">
    <header>
      <h1>Tecnologias</h1>
      <v-btn
        color="orange lighten-2"
        outlined
        depressed
      >
        Cadastrar
      </v-btn>
    </header>
    <section class="technologies__search">
      <v-text-field
        solo
        label="Buscar pelo nome da tecnologia"
        v-model="search"
        append-icon="mdi-magnify"
        @input="searchTechnology"
      ></v-text-field>
      <v-select
        :items="areas"
        item-text="name"
        v-model="type"
        label="Área"
        @input="searchTechnology"
        solo
      ></v-select>
    </section>
    <section class="technologies__content">
      <v-card class="technologies__item" v-for="technology in tempTech" :key="technology.id">
        <span>Área: {{ technology.area.name }} | Tecnologia: {{ technology.name }}</span>
         <v-btn
            icon
            color="grey"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
      </v-card>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { Technology } from '@/utils/types';

export default Vue.extend({
  name: 'technologies',
  data: () => ({
    loading: false,
    search: '',
    type: '',
    tempTech: [] as Array<Technology>,
  }),
  computed: {
    ...mapGetters(['technologies', 'areas']),
  },
  methods: {
    ...mapActions(['getTechnologies', 'getAreas', 'deleteTechnology']),
    searchTechnology() {
      this.tempTech = this.technologies
        .filter((t: Technology) => t.name.includes(this.search) && t.area.name === this.type);
    },
  },
  mounted() {
    this.tempTech = this.technologies;
    this.getTechnologies();
    this.getAreas();
  },
});
</script>

<style lang="scss" scoped>
  main {
    padding: 0 5%;
  }

  .technologies {
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    &__search {
      margin-top: 2%;
      display: flex;
      gap: 2%;
    }
    &__content {
      margin-top: 2%;
    }
    &__item {
      padding: 1.5%;
      margin-bottom: 2%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
