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
            ></v-text-field>
            <v-text-field
              dense
              label="Sobrenome"
              v-model="user.lastname"
              solo
            ></v-text-field>
            <v-text-field
              dense
              label="E-mail"
              v-model="user.email"
              solo
            ></v-text-field>
            <v-text-field
              dense
              label="Senha"
              v-model="user.password"
              type="password"
              solo
            ></v-text-field>
             <v-text-field
              dense
              label="Telefone"
              v-model="user.phone"
              solo
            ></v-text-field>
             <v-text-field
              dense
              label="Data de Nascimento"
              v-model="user.birthday"
              solo
            ></v-text-field>

            <div class="register__usertype">
              <span>Você deseja ser um usuário:</span>
              <v-radio-group
                class="register__checkbox-usertype"
                v-model="user.role"
                row
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
                  name="input-7-4"
                  label="Escreva uma breve descrição sobre você"
                ></v-textarea>

                <label>Experiências</label>
                <v-textarea
                  dense
                  solo
                  name="input-7-4"
                  label="Fale brevemente sobre suas experiências profissionais"
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
                        @change="updateTechnologies"
                      ></v-select>
                      <v-autocomplete
                        dense
                        v-model="skill.technology.name"
                        :items="technologies.filter((f) => f.area === skill.technology.area)"
                        :loading="false"
                        color="white"
                        hide-no-data
                        hide-selected
                        item-text="name"
                        label="Technologia"
                        item-value="id"
                        solo
                        @change="verifyIfOther"
                      ></v-autocomplete>
                    </div>
                    <v-text-field v-if="insertOther"
                      dense
                      v-model="skill.technology.name"
                      label="Tecnologia"
                      solo
                    ></v-text-field>
                    <div class="skill__info">
                      <v-text-field
                        dense
                        v-model="skill.experience_time"
                        label="Tempo de Experiência"
                        filled
                        solo
                      ></v-text-field>
                      <v-text-field
                        dense
                        v-model="skill.price"
                        label="Preço médio por mentoria de 1h"
                        filled
                        solo
                      ></v-text-field>
                    </div>
                  </div>

                  <div class="payments">
                    <label>Formas de Pagamento Aceitas</label>
                      <div v-for="payment in payments" :key="payment.id">
                        <v-checkbox
                          color="#fb8a69"
                          v-model="payments"
                          :label="payment.type"
                        ></v-checkbox>
                      </div>
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
    </main>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { User, Technology, Skill } from '../utils/types';

export default Vue.extend({
  name: 'register',
  data: () => ({
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
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'userCreated', 'areas', 'payments', 'technologies']),
  },
  methods: {
    ...mapActions(['register', 'login', 'getAreas', 'getPayments', 'getTechnologies', 'createTechnologies', 'createSkills']),
    validationFields(): boolean {
      const isValid = true;

      return isValid;
    },
    async registerUser() {
      if (!this.hasAccepted) return;

      if (this.validationFields()) {
        this.loading = true;

        await this.register(this.user);

        if (this.userCreated) {
          if (this.user.role === 'mentor') {
            const hasNewTechnologies = this.technologies.filter((t) => !t.id);

            if (hasNewTechnologies) {
              const technologies = await this.createTechnologies(hasNewTechnologies);
              if (technologies) {
                await this.createSkills(this.skills);
              }
            }
          }

          await this.login({
            email: this.user.email,
            password: this.user.password,
          });

          if (this.isAuthenticated) {
            this.$router.push({ path: '/home', params: { type: this.user.role } });
          }
        } else {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    },
    verifyIfOther(value: Technology) {
      if (value.id === 'OUTRA') {
        this.insertOther = true;
      } else {
        this.insertOther = false;
      }
    },
    addSkill() {
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

      console.log(this.skills);
    },
    updateTechnologies() {
      this.technologies.push({ id: '', name: 'OUTRA', area: '' });
    },
  },
  created() {
    this.getAreas();
    this.getPayments();
    this.getTechnologies();
  },
});
</script>

<style lang="scss" scoped>
 .register {
   padding: 5%;
   font-family: 'Raleway', sans-serif;
   width: 100%;
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
</style>
