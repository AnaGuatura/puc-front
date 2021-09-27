<template>
    <main class="register">
      <h1>Seja bem-vindo!</h1>
      <div class="register__form">
        <section>
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
            <v-text-field
            dense
            label="Data de Nascimento"
            v-model="user.birthday"
            solo
            required
            :rules="[rules.required]"
          ></v-text-field>

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
                  dense
                  solo
                  label="Escreva uma breve descrição sobre você"
                  required
                  :rules="[rules.required]"
                ></v-textarea>

                <label>Experiências</label>
                <v-textarea
                  dense
                  solo
                  label="Fale brevemente sobre suas experiências profissionais"
                  required
                  :rules="[rules.required]"
                ></v-textarea>

                <div class="register__skill">
                  <div class="register__add">
                    <label>Áreas de Atuação</label>
                    <v-btn icon @click="addSkill"><v-icon>mdi-plus</v-icon></v-btn>
                  </div>
                  <div class="skill" v-for="(skill, index) in skills" :key="index">
                    <div class="skill__delete" @click="removeSkill(index)">
                      <v-btn icon x-small><v-icon>mdi-close</v-icon></v-btn>
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
        </section>
        <article class="register__terms">
          <h4>Termos de Uso</h4>
          <span>Um textão aqui.</span>
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

import {
  User,
  Technology,
  Skill,
  Skills,
  Payment,
} from '../utils/types';

export default Vue.extend({
  name: 'register',
  data: () => ({
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
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'userCreated', 'areas', 'payments', 'technologies']),
  },
  methods: {
    ...mapActions(['register', 'login', 'getAreas', 'getPayments', 'getTechnologies', 'createTechnologies', 'createSkills', 'createPayments']),
    ...mapMutations(['setTechnologies']),
    validationFields(): boolean {
      const isValid = true;

      return isValid;
    },
    async registerUser() {
      if (!this.hasAccepted) return;

      if (this.validationFields()) {
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
            this.technologies.forEach((t: Technology) => {
              skills = this.skills.map((skill) => {
                const s = skill;
                s.user = this.userCreated.id;
                if (s.technology.area === t.area && s.technology.name === t.id) {
                  s.technology = t.id;
                }
                return s;
              });
            });

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

          if (this.error !== '') {
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
        if (curr.length > 0) {
          const others = [
            {
              id: '0',
              area: '1c3a8768-b46a-4e20-9e90-a609210173d5',
              name: 'OUTRA',
            },
            {
              id: '0',
              area: '443eba90-15f7-4113-8e6d-8836489df903',
              name: 'OUTRA',
            },
            {
              id: '0',
              area: 'c0d2b142-f40f-4a36-8f74-6f48d5eb22a9',
              name: 'OUTRA',
            },
          ] as Array<Technology>;

          this.listTechnologies = [...curr, ...others];
        }
      },
      deep: true,
      immediate: true,
    },
  },
});
</script>

<style lang="scss" scoped>
 .register {
   padding: 5%;
   font-family: 'Raleway', sans-serif;
   width: 100%;
   &__error {
    padding-top: 5%;
    position: fixed;
    bottom: 0px;
    width: 90%;
   }
   &__form {
     margin-top: 2%;
     display: flex;
     section {
       width: 60%;
     }
     article {
       width: 35%;
       margin-left: 5%;
     }
   }
   &__usertype{
     display: flex;
     align-items: center;
     justify-content: space-between;
     width: 100%;
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
     justify-content: flex-end;
     z-index: 10;
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
         gap: 10%;
       }
       &__info {
         display: flex;
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
  }

  .skill__info > div {
    width: 45% !important;
  }
</style>
