// src/stores/travel-orders.js
import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useTravelOrdersStore = defineStore('travelOrders', {
  state: () => ({
    orders: [],
    pagination: {
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: 15,
      rowsNumber: 0
    },
    loading: false,
    error: null
  }),

  actions: {
    // Ação assíncrona para buscar os pedidos da API
    async fetchTravelOrders (params) {
      this.loading = true
      this.error = null

      try {
        const { page, rowsPerPage, sortBy, descending, filters } = params;

        // Mapeia os parâmetros da tabela e os filtros para os parâmetros da API
        const apiParams = {
          page: page,
          per_page: rowsPerPage,
          sort_by: sortBy,
          order: descending ? 'desc' : 'asc'
        };

        // Adiciona os filtros se eles existirem e não forem vazios/nulos
        if (filters && filters.destination) {
          apiParams.destination = filters.destination;
        }
        if (filters && filters.status) {
          apiParams.status = filters.status;
        }

        // Faz a chamada à API com os parâmetros construídos
        const response = await api.get('/travel/orders', { params: apiParams });

        // Atualiza o estado com os dados da API
        this.orders = response.data.data;

        // Atualiza os metadados da paginação
        this.pagination.page = response.data.meta.current_page;
        this.pagination.rowsPerPage = response.data.meta.per_page;
        this.pagination.rowsNumber = response.data.meta.total;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;

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
          // Verifica se o prompt foi cancelado (null) ou deixado em branco
          if(payload.cancel_reason === null || payload.cancel_reason.trim() === '') {
            this.loading = false; // Importante resetar o loading
            return; // Aborta a operação se o usuário cancelar ou não digitar nada
          }
        }
        await api.put(`/travel/order/${id}/status`, payload);
        
      } catch (err) {
        this.error = 'Erro ao atualizar status do pedido: ' + (err.response?.data?.message || err.message);
        console.error('Erro ao atualizar status do pedido:', err);
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getOrders: (state) => state.orders,
    getPagination: (state) => state.pagination,
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error
  }
})