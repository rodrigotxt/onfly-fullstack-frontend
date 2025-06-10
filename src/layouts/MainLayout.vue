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

        <div>Dev: Rodrigo Martins</div>
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
    link: '/orders/new'
  },
  {
    title: 'Aprovados',
    caption: 'Pedidos aprovados',
    icon: 'check',
    link: '/orders/approved'
  },
  {
    title: 'Cancelados',
    caption: 'Pedidos cancelados',
    icon: 'cancel',
    link: '/orders/canceled'
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
