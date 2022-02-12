<template>
  <main class="statistics">
    <h1>Estatísticas</h1>
    <div class="statistics__loading" v-if="loading">
      <loading :active=loading></loading>
    </div>
    <section class="statistics__content" v-else>
      <div class="statistics__roles">
        <v-card class="statistics__role">
          <v-card-title>Total de Usuários</v-card-title>
          <v-card-subtitle>(até o momento)</v-card-subtitle>
          <span>{{ getUsers() }}</span>
        </v-card>
        <v-card class="statistics__role">
          <v-card-title>Mentores</v-card-title>
          <v-card-subtitle>(até o momento)</v-card-subtitle>
          <span>{{ statistics.mentors || 0 }}</span>
        </v-card>
        <v-card class="statistics__role">
          <v-card-title>Mentorados</v-card-title>
          <v-card-subtitle>(até o momento)</v-card-subtitle>
          <span>{{ statistics.students || 0 }}</span>
        </v-card>
      </div>
      <div class="statistics__visual-content">
        <v-card class="statistics__charts">
          <v-card-title>Status das Mentorias</v-card-title>
          <v-card-subtitle>
            {{ `(referente à: ${getCurrentMonth()} )` }}
          </v-card-subtitle>
          <apexchart
            v-if="showMentoringsChart"
            class="chart"
            type="bar"
            height="350"
            :options="chartOptions"
            :series="series"
          />
          <span v-else>Nenhuma solicitação de mentoria realizada até o momento.</span>
        </v-card>
      </div>
      <div class="statistics__visual-content">
        <v-card>
          <v-card-title>Média de Feedbacks</v-card-title>
          <v-card-subtitle>
            {{ `(referente à: ${getCurrentMonth()} )` }}
          </v-card-subtitle>
          <v-simple-table v-if="statistics.feedbacks.length > 0">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Feedback
                  </th>
                  <th class="text-left">
                    Avaliação
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="feedback in statistics.feedbacks"
                  :key="feedback.id"
                >
                  <td>{{ feedback.feedback_text }}</td>
                  <td>{{ feedback.rating }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <span v-else>Nenhum feedback concedido até o momento.</span>
        </v-card>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import VueApexCharts from 'vue-apexcharts';
import { Feedback, Mentoring } from '@/utils/types';
import loading from '@/components/Loading.vue';

export default Vue.extend({
  name: 'statistics',
  components: {
    apexchart: VueApexCharts,
    loading,
  },
  data: () => ({
    loading: true,
    mentorings: [],
    series: [
      {
        data: [] as Array<number>,
        name: 'Quantidade',
      },
    ],
    showMentoringsChart: false,
    chartOptions: {
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [] as Array<string>,
      },
    },
  }),
  computed: {
    ...mapGetters(['statistics']),
  },
  methods: {
    ...mapActions(['getStatistics']),
    renderCharts() {
      const mentorings = this.statistics.mentorings
        .reduce((acc: Record<string, number>, mentoring: Mentoring) => {
          acc[mentoring.status] = acc[mentoring.status] === undefined ? 1
            : (acc[mentoring.status] + 1);
          return acc;
        }, {});

      /* eslint-disable */
      for (const [key, value] of Object.entries(mentorings)) {
        this.chartOptions.xaxis.categories.push(key);
        this.series[0].data.push(value as number);
      }
      if (this.series[0].data.length > 0) this.showMentoringsChart = true;
    },
    getFeedbackMedia() {
      const media = this.statistics.feedbacks.reduce((acc: number, curr: Feedback) => {
        return acc + curr.rating;  
      }, 0) / this.statistics.feedbacks.length;

      this.statistics.feedbacks.push(
        { feedback_text: 'MÉDIA DE AVALIAÇÕES', rating: media.toFixed(2) }
      );
    },
    getUsers() {
      return (this.statistics.mentors + this.statistics.students) || 0;
    },
    getCurrentMonth () {
      return `${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    },
  },
  async mounted() {
    await this.getStatistics();
    this.renderCharts();
    this.getFeedbackMedia();
    this.loading = false;
  },
});
</script>

<style lang="scss" scoped>
  main {
    padding: 0 5%;
    height: 100%;
  }

  .statistics {
    section {
      display: flex;
      height: 100%;
      flex-direction: column;
    }
    &__loading {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__visual-content {
      margin-top: 2%;
    }
    &__roles {
      margin-top: 2%;
      width: 100%;
      display: flex;
      gap: 5%;
      justify-content: space-between;
    }
    &__role {
      width: 45%;
      height: 150px;
      span {
        display: flex;
        justify-content: center;
        font-size: 2.2rem;
        text-align: center;
        font-weight: bold;
        font-family: "Roboto", sans-serif;
      }
    }
    &__charts {
      display: flex;
      flex-direction: column;
    }
  }

  .chart {
    width: 100%;
    height: 200px;
  }

  tbody tr:last-child {
    background-color: #eeeeee;
  }
</style>
