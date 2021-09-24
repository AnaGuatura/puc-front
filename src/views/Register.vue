<template>
    <main class="register">
      <h1>Seja bem-vindo!</h1>
      <div class="register__form">
        <section>
          <v-text-field
              label="Nome"
              v-model="user.name"
              solo
            ></v-text-field>
            <v-text-field
              label="Sobrenome"
              v-model="user.lastname"
              solo
            ></v-text-field>
            <v-text-field
              label="E-mail"
              v-model="user.email"
              solo
            ></v-text-field>
            <v-text-field
              label="Senha"
              v-model="user.password"
              type="password"
              solo
            ></v-text-field>
             <v-text-field
              label="Telefone"
              v-model="user.phone"
              solo
            ></v-text-field>
             <v-text-field
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
                ></v-radio>
                <v-radio
                  label="Mentorado"
                  value="mentorado"
                ></v-radio>
              </v-radio-group>
            </div>
            <div v-if="user.role === 'mentor'">
              <label>Sobre você</label>
              <v-textarea
                solo
                name="input-7-4"
                label="Escreva uma breve descrição sobre você"
              ></v-textarea>

              <label>Experiências</label>
              <v-textarea
                solo
                name="input-7-4"
                label="Fale brevemente sobre suas experiências profissionais"
              ></v-textarea>
            </div>
        </section>
        <article class="register__terms">
          <h4>Termos de Uso</h4>
          <span>Um textão aqui.</span>
         <v-checkbox
            v-model="hasAccepted"
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

import { User } from '../utils/types';

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
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'userCreated', 'areas', 'payments']),
  },
  methods: {
    ...mapActions(['register', 'login', 'getAreas', 'getPayments']),
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
  },
  created() {
    this.getAreas();
    this.getPayments();
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
 }
</style>
