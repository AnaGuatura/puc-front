<template>
    <main class="register">
      <h1>Seja bem-vindo!</h1>
      <div class="register__form">
        <v-form v-model="isValid">
          <v-text-field
            dense
            label="Nome"
            v-model="user.name"
            solo
            required
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            dense
            label="Sobrenome"
            v-model="user.lastname"
            solo
            required
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            dense
            label="E-mail"
            v-model="user.email"
            :rules="[rules.required, rules.email]"
            solo
            required
          ></v-text-field>
          <v-text-field
            dense
            label="Senha"
            v-model="user.password"
            type="password"
            solo
            required
            :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
            dense
            label="Telefone"
            v-model="user.phone"
            solo
            required
            :rules="[rules.required]"
          ></v-text-field>
           <v-menu
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            dark
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                solo
                v-model="dateFormatted"
                label="Date"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                @blur="date = parseDate(dateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              max="2021-NaN-NaN"
              no-title
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
          <div class="register__usertype">
            <span>Você deseja ser um usuário:</span>
            <v-radio-group
              class="register__checkbox-usertype"
              v-model="user.role"
              row
              required
              :rules="[rules.required]"
            >
              <v-radio
                  label="Mentor"
                  value="mentor"
                  color="#fb8a69"
                ></v-radio>
                <v-radio
                  label="Mentorado"
                  value="mentorado"
                  color="#fb8a69"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="user.role === 'mentor'">
              <div class="mentor">
                <label>Sobre você</label>
                <v-textarea
                  v-model="user.about_user_description"
                  dense
                  solo
                  label="Seu texto de apresentação na plataforma"
                  required
                  :rules="[rules.required]"
                ></v-textarea>

                <label>Experiências</label>
                <v-textarea
                  v-model="user.experiences_description"
                  dense
                  solo
                  label="Fale brevemente sobre suas experiências profissionais"
                  required
                  :rules="[rules.required]"
                ></v-textarea>

                <div class="register__skill">
                  <div class="register__add">
                    <label>Áreas de Atuação</label>
                    <v-btn icon @click="addSkill"><v-icon color="#fb8a69">mdi-plus</v-icon></v-btn>
                  </div>
                  <div class="skill" v-for="(skill, index) in skills" :key="index">
                    <div class="skill__delete" @click="removeSkill(index)">
                      <v-btn icon x-small><v-icon color="#fb8a69">mdi-close</v-icon></v-btn>
                      <span>Remover</span>
                    </div>
                    <div class="skill__tech">
                      <v-select
                        dense
                        v-model="skill.technology.area"
                        :loading="!areas.length"
                        :items="areas"
                        item-text="name"
                        item-value="id"
                        label="Área"
                        solo
                        required
                        :rules="[rules.required]"
                      ></v-select>
                      <v-autocomplete
                        dense
                        v-model="skill.technology.name"
                        :items="listTechnologies.filter((f) => f.area === skill.technology.area)"
                        :loading="false"
                        color="white"
                        hide-no-data
                        hide-selected
                        item-text="name"
                        label="Technologia"
                        item-value="id"
                        solo
                        @change="verifyIfOther"
                        required
                        :rules="[rules.required]"
                      ></v-autocomplete>
                    </div>
                    <v-text-field v-if="insertOther"
                      dense
                      v-model="skill.technology.other"
                      label="Tecnologia"
                      solo
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                    <div class="skill__info">
                      <v-text-field
                        dense
                        type="number"
                        v-model="skill.experience_time"
                        label="Tempo de Experiência"
                        filled
                        solo
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        dense
                        type="number"
                        prefix="R$"
                        v-model="skill.price"
                        label="Preço médio por mentoria de 1h"
                        filled
                        solo
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="payments">
                    <label>Formas de Pagamento Aceitas</label>
                    <v-container>
                      <div v-for="payment in payments" :key="payment.id">
                        <v-checkbox
                          color="#fb8a69"
                          v-model="paymentsMethods"
                          :label="payment.type"
                          :value="payment.id"
                          required
                         :rules="[rules.required]"
                        ></v-checkbox>
                      </div>
                    </v-container>
                  </div>
                </div>
              </div>
            </div>
        </v-form>
        <article class="register__terms">
          <h4>Termos de Uso</h4>
          <span> {{ terms }}</span>
         <v-checkbox
            v-model="hasAccepted"
            color="#fb8a69"
            label="Aceito as condições e os termos de uso."
            required
            :rules="[rules.required]"
          ></v-checkbox>
        </article>
      </div>
      <footer class="register__cta">
        <v-btn
          depressed
          color="orange lighten-2"
          :loading="loading"
          @click="registerUser">
          Cadastrar
        </v-btn>
      </footer>
      <div class="register__error">
        <v-alert
          v-if="error !== ''"
          dismissible
          color="#ef4054"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-alert-circle"
        >
          {{ error }}
        </v-alert>
      </div>
    </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';

import {
  User,
  Technology,
  Skill,
  Skills,
  Payment,
  Area,
} from '../utils/types';

export default Vue.extend({
  name: 'register',
  data: () => ({
    menu: false,
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000))
      .toISOString().substr(0, 10),
    rules: {
      required: (value: string) => !!value || 'Campo obrigatório.',
      email: (value: string) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'E-mail inválido.';
      },
    },
    user: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      phone: '',
      birthday: '',
      role: '',
      about_user_description: '',
      experiences_description: '',
    } as User,
    hasAccepted: false,
    loading: false,
    skills: [] as Array<Skill>,
    insertOther: false,
    paymentsMethods: [],
    listTechnologies: [] as Array<Technology>,
    error: '',
    terms: 'Permito a disponibilidade das informações concedidas nesse cadastro para que os usuários da plataforma possam visualizá-las e, possivelmente, entrarem em contato comigo para tirar dúvidas e discutir sobre outros assuntos. Responsabilizo-me por quaisquer danos ocasionados à minha imagem e informações exibidas.',
    isValid: false,
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'userCreated', 'areas', 'payments', 'technologies']),
    dateFormatted() {
      return moment(this.date).format('DD/MM/YYYY');
    },
  },
  methods: {
    ...mapActions(['register', 'login', 'getAreas', 'getPayments', 'getTechnologies', 'createTechnologies', 'createSkills', 'createPayments']),
    ...mapMutations(['setTechnologies']),
    formatDate(date: string) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    },
    parseDate(date: string) {
      if (!date) return null;

      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },
    validationFields(role: string): boolean {
      let isValid = false;

      isValid = this.user.name !== '' && this.user.lastname !== '' && this.user.email !== ''
        && this.user.password !== '' && this.user.phone !== '' && this.user.birthday !== ''
        && this.user.role !== '';

      if (role === 'mentor') {
        if (isValid) {
          isValid = this.user.about_user_description !== ''
            && this.user.experiences_description !== '' && this.skills.length > 0 && this.hasAccepted
            && this.paymentsMethods.length > 0;
        }
      }

      return isValid;
    },
    async registerUser() {
      this.error = '';
      this.user.birthday = this.date;

      if (this.validationFields(this.user.role)) {
        this.loading = true;

        await this.register(this.user).catch((error) => {
          this.loading = false;
          this.error = error;
        });

        if (this.userCreated.id) {
          if (this.userCreated.role === 'mentor') {
            const others = this.skills.reduce((acc, curr) => {
              if (curr.technology.other) {
                acc.push({
                  name: curr.technology.other,
                  area: curr.technology.area,
                });
              }
              return acc;
            }, [] as Array<Technology>);

            if (others.length > 0) {
              const tech = await this.createTechnologies({ technologies: others })
                .catch((error) => error);
              if (tech.error) {
                this.loading = false;
                this.error = tech.message;
                return;
              }
            }

            let skills = [] as Array<Skills>;
            skills = this.skills.reduce((acc, curr) => {
              const object = {
                user: this.userCreated.id,
                price: curr.price,
                experience_time: curr.experience_time,
                technology: this.technologies.find((t: Technology) => t.area
                  === curr.technology.area && (t.id === curr.technology.name
                    || t.name === curr.technology.other))?.id,
              };

              if (object.technology !== '') acc.push(object);

              return acc;
            }, [] as Array<Skills>);

            const skill = await this.createSkills({ skills }).catch((error) => error);

            if (skill.error) {
              this.loading = false;
              this.error = skill.message;
              return;
            }

            let payments = [];
            payments = this.paymentsMethods.reduce((acc, curr) => {
              acc.push({
                user: this.userCreated.id,
                payment: curr,
              });
              return acc;
            }, [] as Array<Payment>);

            const payment = await this.createPayments({ payments }).catch((error) => error);

            if (payment.error) {
              this.loading = false;
              this.error = payment.message;
              return;
            }
          }

          if (this.error === '') {
            await this.login({
              email: this.user.email,
              password: this.user.password,
            });

            if (this.isAuthenticated) {
              this.$router.push({ path: '/home', params: { type: this.user.role } });
            }
          }
        }
      } else {
        this.loading = false;
        this.error = 'É necessários preencher todos os campos corretamente.';
      }
    },
    verifyIfOther(value: string) {
      this.insertOther = false;
      if (value === '0') {
        this.insertOther = true;
      }
    },
    addSkill() {
      this.insertOther = false;

      const skill = {
        user: '',
        technology: {
          name: '',
          area: '',
        },
        price: null,
        experience_time: null,
      } as Skill;

      this.skills.push(skill);
    },
    removeSkill(index: number) {
      this.skills.splice(index, 1);
    },
  },
  created() {
    this.getAreas();
    this.getPayments();
    this.getTechnologies();
  },
  watch: {
    technologies: {
      handler(curr: Array<Technology>) {
        const others = [] as Array<Technology>;

        this.areas.forEach((area: Area) => {
          const object = {
            id: '0',
            area: area.id,
            name: 'OUTRA',
          };

          others.push(object);
        });

        this.listTechnologies = [...curr, ...others];
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
$small: 600px;
$medium: 768px;

 .register {
   padding: 5%;
   font-family: 'Raleway', sans-serif;
   width: 100%;
   h1 {
     text-align: center;
     margin-bottom: 2%;
   }
   &__error {
    padding-top: 5%;
    bottom: 0px;
    width: 60%;
    margin: 0 auto;
   }
   &__form {
    margin-top: 2%;
    display: flex;
    flex-direction: column;
    width: 60%;
    margin: 0 auto;
    @media screen and (max-width: $small)
    {
      width: 90%;
    }
    section {
      margin-top: 5%;
    }
    article {
      width: 100%;
      display: flex;
      align-items: flex-start;
      padding: 3% 0;
      text-align: left;
    }
   }
   &__usertype{
     display: flex;
     align-items: center;
     justify-content: space-between;
     width: 100%;
    @media screen and (max-width: $small)
    {
      flex-direction: column;
      align-items: flex-start;
    }
  }
   &__checkbox-usertype {
     display: flex;
     width: 60%;
     justify-content: space-between;
   }
   &__terms {
     display: flex;
     flex-direction: column;
     h4 {
       margin-bottom: 2%;
     }
   }
   &__cta {
    margin-top: 2%;
    display: flex;
    justify-content: center;
    z-index: 10;
    width: 60%;
    margin: 0 auto;
   }
   &__skill{
     display: flex;
     flex-direction: column;
   }
   &__add {
     padding-bottom: 2%;
     label {
       padding: 0 !important;
     }
     display: flex;
     align-items: center;
     justify-content: space-between;
   }
   .mentor {
     margin-top: 2%;
     display: flex;
     flex-direction: column;
     label {
       padding-bottom: 2%;;
     }
     .skill {
       display: flex;
       flex-direction: column;
       label {
         padding-bottom: 2%;
       }
       &__tech {
        display: flex;
        @media screen and (max-width: $small)
        {
         flex-direction: column;
        }
         gap: 10%;
       }
       &__info {
         display: flex;
        @media screen and (max-width: $small)
        {
         flex-direction: column;
        }
         gap: 10%;
       }
       &__delete {
         cursor: pointer;
         color: #fb8a69;
         font-size: 0.9rem;
         display: flex;
         align-items: center;
         margin-bottom: 2%;
       }
     }
     .payments {
       margin-top: 2%;
     }
   }
 }

 .skill__tech > div {
    width: 45% !important;
    @media screen and (max-width: $small)
    {
      width: 100% !important;
    }
  }

  .skill__info > div {
    width: 45% !important;
    @media screen and (max-width: $small)
    {
      width: 100% !important;
    }
  }
</style>
