<template>
  <main class="technologies">
    <header>
      <h1>Tecnologias</h1>
      <v-btn
        color="deep-orange lighten-2"
        dense
        depressed
        @click="registerTechnology = true;"
      >
        Cadastrar
      </v-btn>
    </header>
    <div class="technologies__loading">
      <loading :active="loading"></loading>
    </div>
    <section class="technologies__search"
      v-if="!loading"
    >
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
            @click="confirmationDialog(technology)"
          >
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
      </v-card>
    </section>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="390"
      class="confirmation"
    >
      <v-card>
        <v-card-title>Remover Tecnologia</v-card-title>
        <v-card-text>
          Tem certeza que deseja remover a tecnologia?
        </v-card-text>
        <v-spacer/>
        <v-card-actions>
           <v-btn
            color="deep-orange lighten-2"
            outlined
            @click="showDialog = !showDialog"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            dense
            depressed
            color="deep-orange lighten-2"
            :loading="loadingAction"
            @click="removeTechnology"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="registerTechnology"
      persistent
      max-width="400"
      class="new-technology"
    >
      <v-card>
        <v-card-title>Cadastrar Nova Tecnologia</v-card-title>
        <v-spacer/>
        <div class="new-technology__options">
          <label>Área</label>
          <v-select
            :items="areas"
            item-text="name"
            item-value="id"
            v-model="area"
            label="Selecione a área"
            solo
          ></v-select>
          <label>Tecnologia</label>
          <v-text-field
            dense
            label="Tecnologia"
            v-model="tech"
            solo
          ></v-text-field>
        </div>
        <v-alert
          class="new-technology__message"
          v-if="message !== ''"
          dismissible
          :type="messageType"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-alert-circle"
        >
          {{ message }}
        </v-alert>
        <v-card-actions>
           <v-btn
            color="deep-orange lighten-2"
            outlined
            @click="registerTechnology = !registerTechnology;
              this.loadingAction = !this.loadingAction"
          >
            Cancelar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            dense
            color="deep-orange lighten-2"
            depressed
            :loading="loadingAction"
            @click="addNewTechnology"
          >
            Cadastrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { Technology } from '@/utils/types';
import loading from '@/components/Loading.vue';

export default Vue.extend({
  name: 'technologies',
  components: {
    loading,
  },
  data: () => ({
    loading: false,
    search: '',
    type: '',
    tempTech: [] as Array<Technology>,
    showDialog: false,
    technology: {} as Technology,
    loadingAction: false,
    registerTechnology: false,
    area: '',
    tech: '',
    message: '',
    messageType: '',
  }),
  computed: {
    ...mapGetters(['technologies', 'areas']),
  },
  methods: {
    ...mapActions(['getTechnologies', 'getAreas', 'deleteTechnology', 'createTechnologies']),
    searchTechnology() {
      this.tempTech = this.technologies
        .filter((t: Technology) => t.name.toUpperCase().includes(this.search.toUpperCase())
          && t.area.name === this.type);
    },
    confirmationDialog(selected: Technology) {
      this.showDialog = true;
      this.technology = selected;
    },
    async removeTechnology() {
      this.loadingAction = true;
      await this.deleteTechnology(this.technology.id);
      await this.getTechnologies();
      this.loadingAction = false;
      this.showDialog = false;
    },
    async addNewTechnology() {
      this.loadingAction = true;
      let hasTechnology = false;
      hasTechnology = this.tempTech
        .filter((tech: Technology) => tech.area.id === this.area
          && tech.name.toUpperCase().includes(this.tech.toUpperCase())).length > 0;
      if (!hasTechnology) {
        const technology = { technologies: [{ name: this.tech, area: this.area }] };
        await this.createTechnologies(technology);
      } else {
        this.messageType = 'warning';
        this.message = 'Tecnologia já cadastrada no sistema.';
      }
      this.loadingAction = false;
      this.showDialog = false;
    },
  },
  async mounted() {
    this.loading = true;
    await this.getTechnologies();
    await this.getAreas();
    this.tempTech = this.technologies;
    this.loading = false;
  },
  watch: {
    technologies: {
      handler(curr) {
        this.tempTech = curr;
      },
      deep: true,
      immediate: true,
    },
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
    &__loading {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      margin-top: 2%;
    }
    &__search {
      margin-top: 2%;
      display: flex;
      gap: 2%;
    }
    &__content {
      margin-top: 2%;
      font-size: 0.90rem;
      font-family: 'Roboto', sans-serif;
    }
    &__item {
      padding: 1.5%;
      margin-bottom: 2%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .new-technology {
    &__options {
      padding: 5%;
    }
    &__message {
      margin: 0 5% 5% 5%;
    }
  }
</style>
