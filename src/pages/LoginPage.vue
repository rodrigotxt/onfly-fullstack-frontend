<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Login</div>
            <div class="text-grey-8">Insira suas credenciais para acessar</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="email"
                label="Email"
                type="email"
                outlined
                required
                :rules="[val => !!val || 'Email é obrigatório']"
              />
              <q-input
                v-model="password"
                label="Senha"
                type="password"
                outlined
                required
                :rules="[val => !!val || 'Senha é obrigatória']"
              />
              <q-card-actions align="right">
                <q-btn
                  label="Entrar"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="authStore.isLoading"
                  :disable="authStore.isLoading"
                />
              </q-card-actions>
            </q-form>
          </q-card-section>
          <q-card-section v-if="authStore.getError" class="text-center text-negative q-pt-none">
            {{ authStore.getError }}
          </q-card-section>
          <q-card-section class="text-center q-pt-none">
            <div class="text-grey-8">
              Ainda não tem conta? <a href="#" class="text-weight-bold text-primary">Registre-se</a>
            </div>
          </q-card-section>
        </q-card>
        <div class="airplane">

          <img src="https://i.imgur.com/3BGEqFQ.png" class ="plane">
          <img src="https://i.imgur.com/6tncGeG.png" class ="cloud1">
          <img src="https://i.imgur.com/6tncGeG.png" class ="cloud2">
          <img src="https://i.imgur.com/6tncGeG.png" class ="cloud3">
          <img src="https://i.imgur.com/6tncGeG.png" class ="cloud4">
          <img src="https://i.imgur.com/6tncGeG.png" class ="cloud5">
            
          <div class="sun"></div>
          <div class="moon"></div>          
                  
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const onSubmit = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  });
};
</script>

<style scoped>
.my_card{
  width: 100%;
  max-width: 350px;
  z-index: 10;
  background: linear-gradient(#dde6ea73, #fff);
  border-radius: 1em;
  border: none;
}
.cloud1, .cloud2, .cloud3, .cloud4, .cloud5 {
  position:absolute;
  z-index: 0;
}
.plane{
  z-index:3;
}
.moon, .sun {
  z-index: 1;
}
.cloud1{
  z-index: 3;
}
.airplane {
  background-color: #61CADF; 
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-animation: body 33.5s infinite linear !important;
          animation: body 33.5s infinite linear !important;
}
body {
  /*
  background-color: #61CADF !important; 
  width: 100% !important;
  overflow: hidden !important;
  -webkit-animation: body 33.5s infinite linear !important;
          animation: body 33.5s infinite linear !important;
  */
}
.sun {
  position: absolute;
  height: 80px;
  width: 80px;
  border-radius: 80px;
  background-color: #f1c40f;
  margin-top: 20px;
  margin-left: 300px;
  box-shadow: 0px 0px 180px 2px #FFFF75;
  -webkit-animation: sun 33.5s infinite linear;
          animation: sun 33.5s infinite linear;
}
.moon {
  position: absolute;
  height: 80px;
  width: 80px;
  border-radius: 80px;
  background-color: #F7F5C7;
  margin-top: 20px;
  margin-left: 300px;
  box-shadow: 0px 0px 180px 2px #FFFF75;
  -webkit-animation: sun 33.5s infinite linear;
          animation: sun 33.5s infinite linear;
  background-color: #F1EFA5;
  box-shadow: 0px 0px 180px 2px #FFFFE7;
  -webkit-animation: none;
          animation: none;
  margin-left: 1250px;
  z-index: 2;
  -webkit-animation: moon 33.5s infinite linear;
          animation: moon 33.5s infinite linear;
}
.plane {
  margin-left: 50%;
  height: 80px;
  margin-top: 70px;
  position: absolute;
  z-index: 2;
  -webkit-animation: plane 6s infinite;
          animation: plane 6s infinite;
}
.cloud1 {
  height: 100px;
  float: right;
  margin-top: 20px;
  margin-right: 102%;
  -webkit-animation: clouds 10s infinite linear;
          animation: clouds 10s infinite linear;
}
.cloud2 {
  height: 100px;
  float: right;
  margin-right: 102%;
  -webkit-animation: clouds 10s infinite linear;
          animation: clouds 10s infinite linear;
  height: 70px;
  margin-top: 20px;
  margin-right: 115%;
  -webkit-animation: clouds 12s infinite linear;
          animation: clouds 12s infinite linear;
}
.cloud3 {
  height: 100px;
  float: right;
  margin-top: 20px;
  margin-right: 102%;
  -webkit-animation: clouds 10s infinite linear;
          animation: clouds 10s infinite linear;
  height: 80px;
  margin-right: 120%;
  -webkit-animation: clouds 11.5s infinite linear;
          animation: clouds 11.5s infinite linear;
}
.cloud4 {
  height: 100px;
  float: right;
  margin-top: 20px;
  margin-right: 102%;
  -webkit-animation: clouds 10s infinite linear;
          animation: clouds 10s infinite linear;
  height: 50px;
  margin-right: 110%;
  -webkit-animation: clouds 17s infinite linear;
          animation: clouds 17s infinite linear;
}
.cloud5 {
  height: 100px;
  float: right;
  margin-top: 20px;
  margin-right: 102%;
  -webkit-animation: clouds 10s infinite linear;
          animation: clouds 10s infinite linear;
  height: 30px;
  margin-right: 120%;
  -webkit-animation: clouds 31s infinite linear;
          animation: clouds 31s infinite linear;
}
/* animations */
/*******************************************/
@-webkit-keyframes clouds {
  from {
    transform: translateX(-5%);
  }
  to {
    transform: translateX(2900px);
  }
}
@keyframes clouds {
  from {
    transform: translateX(-5%);
  }
  to {
    transform: translateX(2900px);
  }
}
@-webkit-keyframes plane {
  0% {
    /**/
  }
  25% {
    margin-top: 85px;
  }
  50% {
    margin-left: 48%;
  }
  75% {
    margin-left: 46%;
    margin-top: 60px;
  }
  100% {
    margin-top: 70px;
    margin-left: 50%;
  }
}
@keyframes plane {
  0% {
    /**/
  }
  25% {
    margin-top: 85px;
  }
  50% {
    margin-left: 48%;
  }
  75% {
    margin-left: 46%;
    margin-top: 60px;
  }
  100% {
    margin-top: 70px;
    margin-left: 50%;
  }
}
@-webkit-keyframes body {
  0% {
    background-color: #69D2E7;
  }
  5% {
    background-color: #69D2E7;
  }
  25% {
    background-color: #1D2F41;
  }
  75% {
    background-color: #1D2F41;
  }
  100% {
    background-color: #69D2E7;
  }
}
@keyframes body {
  0% {
    background-color: #69D2E7;
  }
  5% {
    background-color: #69D2E7;
  }
  25% {
    background-color: #1D2F41;
  }
  75% {
    background-color: #1D2F41;
  }
  100% {
    background-color: #69D2E7;
  }
}
@-webkit-keyframes sun {
  0% {
    margin-top: 20px;
  }
  10% {
    margin-top: 20px;
  }
  30% {
    margin-top: 101%;
  }
  75% {
    margin-top: 101%;
  }
  100% {
    margin-top: 20px;
  }
}
@keyframes sun {
  0% {
    margin-top: 20px;
  }
  10% {
    margin-top: 20px;
  }
  30% {
    margin-top: 101%;
  }
  75% {
    margin-top: 101%;
  }
  100% {
    margin-top: 20px;
  }
}
@-webkit-keyframes moon {
  0% {
    margin-top: 101%;
  }
  25% {
    margin-top: 20px;
  }
  75% {
    margin-top: 20px;
  }
  100% {
    margin-top: 101%;
  }
}
@keyframes moon {
  0% {
    margin-top: 101%;
  }
  25% {
    margin-top: 20px;
  }
  75% {
    margin-top: 20px;
  }
  100% {
    margin-top: 101%;
  }
}
</style>