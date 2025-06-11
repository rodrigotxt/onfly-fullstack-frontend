<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-grey text-white shadow-2 rounded-borders q-mb-md">
      <q-icon name="card_travel" size="md" />
      <q-toolbar-title>
        Pedidos de Viagens
      </q-toolbar-title>
      <q-space />
      <q-btn flat round icon="add" label="Novo Pedido" to="/travel-order/new" />
    </q-toolbar>

    <!-- Seção de Filtros -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              filled
              v-model="filterDestination"
              label="Filtrar por Destino"
              clearable
              @clear="applyFilters"
              @keyup.enter="applyFilters"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-select
              filled
              v-model="filterStatus"
              :options="statusOptions"
              label="Filtrar por Status"
              clearable
              @clear="applyFilters"
              @update:model-value="applyFilters"
            >
              <template v-slot:append>
                <q-icon name="filter_alt" />
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-mt-md justify-end">
          <q-btn label="Aplicar Filtros" color="primary" @click="applyFilters" />
        </div>
      </q-card-section>
    </q-card>
    <!-- Fim Seção de Filtros -->

    <q-table
      class="my-sticky-virtscroll-table"
      flat
      bordered
      :rows="travelOrdersStore.orders"
      :columns="columns"
      row-key="id"
      v-model:pagination="travelOrdersStore.pagination"
      :loading="travelOrdersStore.loading"
      @request="onRequest"
      no-data-label="Nenhum pedido encontrado"
      no-results-label="Nenhum resultado corresponde à sua busca"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>
            {{ message }}
            <span v-if="filter"> para "{{ filter }}"</span>
          </span>
          <q-icon size="2em" :name="icon" />
        </div>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="q-mt-md">
            <q-fab
              :label="props.row.status"
              vertical-actions-align="left"
              :color="getStatusColor(props.row.status)"
              icon="keyboard_arrow_down"
              direction="down"
              padding="xs"
            >
              <q-fab-action :color="getStatusColor('aprovado')" @click="updateOrderStatus(props.row.id, 'aprovado')" label="Aprovado" />
              <q-fab-action :color="getStatusColor('cancelado')" @click="updateOrderStatus(props.row.id, 'cancelado')" label="Cancelado" />
              <q-fab-action :color="getStatusColor('solicitado')" @click="updateOrderStatus(props.row.id, 'solicitado')" label="Solicitado" />
            </q-fab>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-order_id="props">
        <q-td :props="props">
          <router-link
            :to="{ name: 'order-detail', params: { id: props.row.id } }"
            class="text-primary">
          {{ props.row.order_id }}
        </router-link>
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
      <template v-slot:body-cell-updated_by="props">
        <q-td :props="props">
          {{ props.row.updated_by?.name }}
        </q-td>
      </template>
    </q-table>
    <q-banner v-if="travelOrdersStore.hasError" class="bg-red-2 text-red-10 q-mt-md">
      {{ travelOrdersStore.error }}
    </q-banner>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTravelOrdersStore } from 'stores/travel-orders';
import { useRouter } from 'vue-router';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const travelOrdersStore = useTravelOrdersStore();
const router = useRouter();

const filterDestination = ref('');
const filterStatus = ref(null); // q-select com `value: null` para "Todos"

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Solicitado', value: 'solicitado' },
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Cancelado', value: 'cancelado' }
];

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

function updateOrderStatus(orderId, newStatus) {
  // Ação que está no store Pinia
  travelOrdersStore.updateOrderStatus(orderId, newStatus)
    .then(() => {
      // Após a atualização do status, recarrega a tabela com os filtros e paginação atuais
      onRequest({ pagination: travelOrdersStore.pagination });
    });
}

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
  }
}

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

function getOrderDetailsLink(orderId) {
  return router.resolve({ name: 'order-detail', params: { id: orderId } }).href;
}

// Função para aplicar os filtros. Ela reinicia a paginação para a primeira página.
function applyFilters() {
  travelOrdersStore.pagination.page = 1; // Sempre volta para a primeira página ao aplicar filtros
  onRequest({ pagination: travelOrdersStore.pagination }); // Dispara a requisição com os novos filtros
}

// Função que será chamada quando a tabela solicitar novos dados (paginação, ordenação, etc.)
async function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;

  const filters = {
    destination: filterDestination.value,
    // Extrai o 'value' do objeto selecionado no q-select ou mantém null se "Todos"
    status: filterStatus.value ? filterStatus.value.value : null
  };

  // Chama a ação no store Pinia para buscar os pedidos com os parâmetros e filtros
  await travelOrdersStore.fetchTravelOrders({
    page,
    rowsPerPage: parseInt(rowsPerPage),
    sortBy,
    descending,
    filters
  });
}

// Ao montar o componente, faz a primeira requisição para carregar os dados
onMounted(() => {
  onRequest({ pagination: travelOrdersStore.pagination });
});
</script>

<style lang="sass">
.my-sticky-virtscroll-table
  height: 400px
.q-fab--opened
    z-index: 999
</style>