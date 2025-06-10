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
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge v-if="props.row.status"
            :color="getStatusColor(props.row.status)"
            text-color="white"
            class="q-px-sm q-py-xs"
            rounded
          >
            {{ props.row.status }}
          </q-badge>
          <span v-if="!props.row.status">{{ props.row.status }}</span>
        </q-td>
      </template>
      <template v-slot:body-cell-start_date="props">
        <q-td :props="props">
          {{ formatDate(props.row.start_date, 'dd/MM/yyyy') }}
        </q-td>
      </template>
      <template v-slot:body-cell-end_date="props">
        <q-td :props="props">
          {{ formatDate(props.row.end_date, 'dd/MM/yyyy') }}
        </q-td>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          {{ formatDate(props.row.created_at, 'dd/MM/yyyy HH:mm:ss') }}
        </q-td>
      </template>
      <template v-slot:body-cell-updated_at="props">
        <q-td :props="props">
          {{ formatDate(props.row.updated_at, 'dd/MM/yyyy HH:mm:ss') }}
        </q-td>
      </template>
    </q-table>
    <q-banner v-if="travelOrdersStore.hasError" class="bg-red-2 text-red-10 q-mt-md">
      {{ travelOrdersStore.error }}
    </q-banner>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTravelOrdersStore } from 'stores/travel-orders';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Instancia o store Pinia
const travelOrdersStore = useTravelOrdersStore();

// Definição das colunas da tabela
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
    field: 'updated_by',
    sortable: true
  }
];

// Função para retornar a cor do q-badge com base no status
function getStatusColor(status) {
  switch (status) {
    case 'solicitado':
      return 'blue-grey';
    case 'aprovado':
      return 'green';
    case 'cancelado':
      return 'red';
    default:
      return 'grey';
  }}
  function formatDate(dateString, formatPattern) {
  if (!dateString) {
    return '';
  }
  try {
    const date = parseISO(dateString.replace(' ', 'T'));
    return format(date, formatPattern, { locale: ptBR });
  } catch (e) {
    console.error('Erro ao formatar data:', dateString, e);
    return dateString;
  }
}

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