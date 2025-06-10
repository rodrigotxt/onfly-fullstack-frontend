// src/stores/travel-orders.js
import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useTravelOrdersStore = defineStore('travelOrders', {
  state: () => ({
    // Array para armazenar os dados dos pedidos
    orders: [],
    // Objeto para armazenar os metadados da paginação
    pagination: {
      sortBy: null, // Campo de ordenação
      descending: false, // Direção da ordenação
      page: 1, // Página atual
      rowsPerPage: 15, // Itens por página
      rowsNumber: 0 // Total de itens (meta.total da API)
    },
    loading: false, // Estado de carregamento
    error: null // Objeto de erro, se houver
  }),

  actions: {
    // Ação assíncrona para buscar os pedidos da API
    async fetchTravelOrders (params) {
      this.loading = true
      this.error = null

      try {
        // Mapeia os parâmetros da tabela para os parâmetros da API
        const apiParams = {
          page: params.pagination.page,
          per_page: params.pagination.rowsPerPage,
          // Adicione ordenação se precisar e sua API suportar
          // sort_by: params.pagination.sortBy,
          // descending: params.pagination.descending ? 'desc' : 'asc',
          // ...outros filtros
        };

        const response = await api.get('/travel/orders', { params: apiParams });

        // Atualiza o estado com os dados da API
        this.orders = response.data.data;

        // Atualiza os metadados da paginação
        this.pagination.page = response.data.meta.current_page;
        this.pagination.rowsPerPage = response.data.meta.per_page;
        this.pagination.rowsNumber = response.data.meta.total;
        // Mantenha sortBy e descending do request original se sua API suportar ordenação
        this.pagination.sortBy = params.pagination.sortBy;
        this.pagination.descending = params.pagination.descending;

      } catch (err) {
        this.error = 'Erro ao carregar pedidos: ' + (err.response?.data?.message || err.message);
        console.error('Erro ao carregar pedidos:', err);
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus (id, status) {
      this.loading = true
      this.error = null
      let payload = {
        status: status
      };

      try {
        if(status == 'cancelado'){
          payload.cancel_reason = prompt('Digite a razão do cancelamento');
          if(payload.cancel_reason == null || payload.cancel_reason == '') return;
        }
        await api.put(`/travel/order/${id}/status`, payload);
        this.fetchTravelOrders({ pagination: this.pagination });
      } catch (err) {
        this.error = 'Erro ao atualizar status do pedido: ' + (err.response?.data?.message || err.message);
        console.error('Erro ao atualizar status do pedido:', err);
      } finally {
        this.loading = false;
      }
  },
  },

  getters: {
    // Opcional: getters para acessar dados de forma computada
    getOrders: (state) => state.orders,
    getPagination: (state) => state.pagination,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  }
})