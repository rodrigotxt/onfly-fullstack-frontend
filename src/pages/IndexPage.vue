<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-virtscroll-table"
      flat
      bordered
      title="Pedidos de Viagens"
      :rows="travelOrdersStore.orders"
      :columns="columns"
      row-key="id"
      v-model:pagination="travelOrdersStore.pagination"
      :loading="travelOrdersStore.loading"
      @request="onRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:no-data="{ icon, message }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            {{ message }}
          </span>
          <q-icon size="2em" :name="icon" />
        </div>
      </template>

    </q-table>
    <q-banner v-if="travelOrdersStore.hasError" class="bg-red-2 text-red-10 q-mt-md">
      {{ travelOrdersStore.error }}
    </q-banner>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTravelOrdersStore } from 'stores/travel-orders'; // Importe seu store

// Instancia o store Pinia
const travelOrdersStore = useTravelOrdersStore();

// Definição das colunas da tabela
// Adapte as 'field's para corresponder às chaves do JSON da sua API
const columns = [
  {
    name: 'order_id',
    required: true,
    label: 'ID do Pedido',
    align: 'left',
    field: 'order_id',
    sortable: true
  },
  {
    name: 'customer_name',
    required: true,
    label: 'Cliente',
    align: 'left',
    field: 'customer_name',
    sortable: true
  },
  {
    name: 'destination',
    label: 'Destino',
    align: 'left',
    field: 'destination',
    sortable: true
  },
  {
    name: 'start_date',
    label: 'Data Início',
    align: 'left',
    field: 'start_date',
    sortable: true
  },
  {
    name: 'end_date',
    label: 'Data Fim',
    align: 'left',
    field: 'end_date',
    sortable: true
  },
  {
    name: 'status',
    label: 'Status',
    align: 'center',
    field: 'status',
    sortable: true
  },
  {
    name: 'user_name',
    label: 'Criado Por',
    align: 'left',
    // Para campos aninhados como 'user.name', use uma função para 'field'
    field: row => row.user ? row.user.name : 'N/A',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Criado Em',
    align: 'left',
    field: 'created_at',
    sortable: true
  },
  {
    name: 'updated_by',
    label: 'Atualizado Por',
    align: 'left',
    field: 'updated_by', // Se updated_by for um ID, você precisaria de um relacionamento para mostrar o nome
    sortable: true
  }
];

// Função que será chamada quando a tabela solicitar novos dados (paginação, ordenação)
async function onRequest(props) {
  await travelOrdersStore.fetchTravelOrders(props);
}

// Quando o componente é montado, faz a primeira requisição para carregar os dados
onMounted(() => {
  // Chama onRequest com os valores iniciais de paginação do store
  onRequest({ pagination: travelOrdersStore.pagination });
});
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  /* Exemplo de estilo para tabela, ajuste conforme necessário */
  height: 400px
</style>