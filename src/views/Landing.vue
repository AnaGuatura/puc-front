<template>
  <div class="landing">
    <section class="landing__cta">
      <article class="landing__cta-text">
        <h4>Arquitetura & Desenvolvimento</h4>
        <h1>Aqui para desenvolver você<span>.</span></h1>
        <p>Procurando por algum mentor que te ajude a evoluir e a
          alcançar os próximos passos da sua carreira? Aqui é o lugar certo para você!
        </p>
        <section class="landing__cta-buttons">
           <router-link :to="'register'">
            <v-btn color="orange lighten-2" depressed>
              Inscreva-se
            </v-btn>
          </router-link>
          <v-btn color="orange lighten-2" depressed @click="$vuetify.goTo('#about')">
            O que fazemos?
          </v-btn>
        </section>
      </article>
      <aside class="landing__cta-image">
        <img :src="require(`@/assets/landing.jpeg`)" alt class="icon" />
      </aside>
    </section>

    <section id="about" class="landing__about">
      <article>
        <h4>Sobre nós</h4>
        <h1>
          O que fazemos?
        </h1>
      </article>
      <article>
        Oi! O MADS (Mentoria em Arquitetura e Desenvolvimento de Software) surgiu
        com o objetivo de ajudar profissionais da área de TI que possuem pouco tempo
        (ou quase nenhum) para aprender sobre um determinado assunto. Nesse sentido,
        essa plataforma oferece uma lista de profissionais que podem ajudar esse profissional
        a evoluir em sua carreira oferecendo mentorias personalizadas, que ofereçam de forma
        individual aquilo que o profissional mentorado precisa. A procura de um mentor para
        te ajudar a evoluir seus conhecimentos sobre determinada tecnologia? Esse é o lugar!
        Deseja ajudar alguém com seus conhecimentos? Esse também é o seu lugar!
      </article>
    </section>
    <hr>
    <section class="landing__areas">
      <article>
        <h4>NOSSOS SERVIÇOS</h4>
        <h1>
          Áreas de Expertise
        </h1>
      </article>
      <section class="areas">
        <div class="areas__front-end">Front-end</div>
        <div class="areas__back-end">Back-end</div>
        <div class="areas__banco">Banco de Dados</div>
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapMutations } from 'vuex';

export default Vue.extend({
  name: 'landing',
  methods: {
    ...mapMutations(['setUserAuthentication']),
  },
  watch: {
    '$route.query': {
      handler(curr) {
        if (curr) {
          this.setUserAuthentication(false);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
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

.landing {
  width: 100%;
  height: 100vh;
  font-family: 'Raleway', sans-serif;
  &__cta {
    padding: 5%;
    padding-top: 2%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    @media screen and (max-width: $small)
    {
      height: auto;
    }
    article {
      width: 45%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      @media screen and (max-width: $small)
      {
        width: 100%;
      }

      h1 {
        font-size: 3.2rem;
        width: 75%;
        span {
          color: #1cb0a8;
          font-weight: bold;
        }
      }

      h4 {
        text-transform: uppercase;
        color: #fb8a69;
        margin-bottom: 20%;
        @media screen and (max-width: $small)
        {
          margin-bottom: 10%;
        }
      }

      p {
        margin-top: 5%;
        margin-bottom: 0;
      }

      section {
        margin-top: 20%;
        display: flex;
        justify-content: flex-start;
        a {
          text-decoration: none;
          color: inherit;
          margin-right: 10%;
        }
      }

    }
    &-image{
      width: 45%;
      height: 100%;
      display: flex;
      align-items: center;
      @media screen and (max-width: $small)
      {
        display: none;
      }
    }

    aside {
      img {
        width: 100%;
        display: flex;
        border-radius: 3px 150px 150px;
        align-items: center;
        justify-content: center;
      }
    }
  }
  &__about {
    padding: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: $medium)
    {
      flex-direction: column;
      align-items: flex-start;
    }

    :first-child {
      width: 40%;
      @media screen and (max-width: $medium)
      {
        margin-bottom: 5%;
      }
      @media screen and (max-width: $small)
      {
        width: 100%;
        margin-top: 5%;
      }
    }
    article {
      width: 100%;
      font-size: 1.2rem;
      h4 {
        text-transform: uppercase;
        color: #fb8a69;
        font-size: 1rem;
        margin-bottom: 2%;
      }
      h1 {
         font-weight: bold;
         font-size: 2rem;
      }
      span {
        text-decoration: line-through;
      }
    }
  }
  &__areas {
    padding: 5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    article {
      text-align: center;
      h4 {
        text-transform: uppercase;
        color: #fb8a69;
        font-size: 1rem;
        margin-bottom: 2%;
      }
      h1 {
         font-weight: bold;
         font-size: 2rem;
      }
    }
  }
}
.areas {
  padding: 5% 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media screen and (max-width: $small)
  {
    flex-direction: column;
  }
  &__front-end {
    height: 200px;
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(to bottom, #ef4054, #f25162, #f4606f, #f66e7c, #f77b89);
    font-weight: bold;
    font-size: 1.2rem;
    color: #fff;
    ::hover {
      content: "front-end sim";
      background-color: black;
    }
    @media screen and (max-width: $small)
    {
      width: 100%;
      margin-bottom: 5%;
    }
  }
  &__back-end {
    height: 200px;
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(to bottom, #1cb0ab, #47b7b3, #64bfbb, #7bc6c2, #91cdca);
    font-weight: bold;
    font-size: 1.2rem;
    color: #fff;
    @media screen and (max-width: $small)
    {
      width: 100%;
      margin-bottom: 5%;
    }
  }
    &__banco {
    height: 200px;
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(to bottom, #fcb643, #f7b851, #f2ba5e, #edbb6b, #e8bd77);
    font-weight: bold;
    font-size: 1.2rem;
    color: #fff;
    @media screen and (max-width: $small)
    {
      width: 100%;
      margin-bottom: 5%;
    }
  }
}
</style>
