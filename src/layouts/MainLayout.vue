<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          App | Viagens
        </q-toolbar-title>

        <div>
          <span v-if="authStore.getUser" class="q-mr-sm">{{authStore.getUser.name}}</span> 
          <span><q-btn @click="authStore.logout" color="dark" size="sm" icon-right="close" label="Sair" /></span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Navegação
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
const authStore = useAuthStore();
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: '',
    icon: 'dashboard',
    link: ''
  },
  {
    title: 'Novo Pedido',
    caption: '',
    icon: 'chat',
    link: '#/order/new'
  },
  {
    title: 'Aprovados',
    caption: 'Pedidos aprovados',
    icon: 'check',
    link: '#/orders/approved',
    filter: { status: 'aprovado' }
  },
  {
    title: 'Cancelados',
    caption: 'Pedidos cancelados',
    icon: 'cancel',
    link: '#/orders/canceled',
    filter: { status: 'cancelado' }
  },
  {
    title: 'Feito com carinho.',
    caption: 'por @rodrigotxt',
    icon: 'favorite',
    target: '_blank',
    link: 'https://github.com/rodrigotxt'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
