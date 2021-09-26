<template>
  <div class="landing">
    <section class="landing__cta">
      <article class="landing__cta-text">
        <h4>Arquitetura & Desenvolvimento</h4>
        <h1>Aqui para desenvolver você<span>.</span></h1>
        <p>Procurando por algum mentor que te ajude a evoluir e a
          alcançar os próximos passos da sua carreira? Aqui é o lugar para você!
        </p>
        <section class="landing__cta-buttons">
           <router-link :to="'register'">
            <v-btn depressed>
              Inscreva-se
            </v-btn>
          </router-link>
          <router-link :to="'login'">
            <v-btn depressed :scroll-to="'#about'">
              O que fazemos?
            </v-btn>
          </router-link>
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
        Oi! Eu sou a Ana, trabalho com desenvolvimento há mais de 5 anos e nessa vida de
        programadora,
        me deparei com muitos momentos em que eu precisava saber como trabalhar
        com certas tecnologias em um período muito muito de tempo <span>quem nunca?</span> e por
        muitas vezes me perguntei ou até pensei em contratar alguém que me ensinasse os primeiros
        passos ou me indicasse por onde seguir, mas... onde encontrar alguém que tivesse um domínio
        sobre um assunto muito específico e que estivesse disposto a falar sobre esse assunto
        durante 1 horinha que fosse? E desse pensamento nasceu o MADS.
        Aqui é o lugar para encontrar essa pessoa que
        possa te ajudar e te explicar tim tim por tim tim sobre um
        determinado assunto em um período curtinho
        de tempo (ou não né!). Seja bem vindo!
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
.landing {
  width: 100%;
  height: 100vh;
  font-family: 'Raleway', sans-serif;
  &__header {
    padding: 0 5%;
    display: flex;
    width: 100%;
    height: 50px;
    font-size: 0.80rem;
    align-items: center;
    hr {
      margin-left: 20px;
      margin-top: 17px;
    }
    span {
      font-size: 1rem;
      font-weight: bold;
      margin-left: 25px;
      letter-spacing: 5px;
    }
    nav {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      ul {
        a {
          text-decoration: none;
          color: inherit;
        }
        li {
          text-transform: uppercase;
          font-weight: bold;
          color: #fb8a69;
          display: inline;
          margin: 0.5rem;
        }
      }
    }
  }
  &__cta {
    padding: 5%;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    article {
      width: 45%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      h1 {
        font-size: 3.2rem;
        span {
          color: #6bb6b6;
          font-weight: bold;
        }
      }

      h4 {
        text-transform: uppercase;
        color: #fb8a69;
        margin-bottom: 20%;
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
    :first-child {
      width: 40%;
    }
    article {
      width: 60%;
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
  }
}
</style>
