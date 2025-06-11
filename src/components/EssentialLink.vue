<template>
  <q-item
    clickable
    tag="a"
    :target="props.target || '_self'"
    :href="props.link"
    @click="handleClick"
  >
    <q-item-section
      v-if="props.icon"
      avatar
    >
      <q-icon :name="props.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.title }}</q-item-label>
      <q-item-label caption>{{ props.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps } from 'vue';
import { useTravelOrdersStore } from 'stores/travel-orders'; // Importa o store
import { useRouter } from 'vue-router'; // Importa o router (útil, mesmo que não seja usado para 'push' diretamente aqui)

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: '#' // Padrão para '#' se nenhum link específico for fornecido
  },
  icon: {
    type: String,
    default: ''
  },
  filter: {
    type: Object,
    default: null
  }
});

const travelOrdersStore = useTravelOrdersStore();
const router = useRouter();

const handleClick = async (event) => {
  // Verifica se a prop 'filter' está presente e não é nula
  if (props.filter) {
    event.preventDefault();

    // Redefine a paginação para a primeira página ao aplicar um novo filtro
    travelOrdersStore.pagination.page = 1;

    // Chama a ação no store para buscar os pedidos com o filtro fornecido
    await travelOrdersStore.fetchTravelOrders({
      pagination: travelOrdersStore.pagination,
      filters: props.filter // Usa o objeto de filtro fornecido na prop
    });

  }
};
</script>