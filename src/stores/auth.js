// src/stores/auth.js
import { defineStore } from 'pinia';
import { api } from 'boot/axios'; // Importa a instância do Axios configurada
import { LocalStorage, Notify } from 'quasar'; // Para armazenar o token e notificações
import { useRouter } from 'vue-router'; // Para redirecionar

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: LocalStorage.getItem('jwt_token') || null, // Carrega token do localStorage
    user: LocalStorage.getItem('user_data') || null,   // Carrega dados do usuário
    isAuthenticated: !!LocalStorage.getItem('jwt_token'), // Verifica se há token
    loading: false,
    error: null,
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user ? JSON.parse(state.user) : null, // Parseia user data
    getIsAuthenticated: (state) => state.isAuthenticated,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    // Ação de login
    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        // Envia as credenciais para o endpoint de login da sua API
        const response = await api.post('/login', credentials); // Substitua '/login' pelo endpoint real

        // Assumindo que a API retorna { access_token: '...', user: {...} }
        const { access_token, user } = response.data;

        // Salva o token no estado e no localStorage
        this.token = access_token;
        LocalStorage.set('jwt_token', access_token);

        // Salva os dados do usuário (opcional, mas recomendado)
        this.user = JSON.stringify(user);
        LocalStorage.set('user_data', JSON.stringify(user));

        this.isAuthenticated = true;

        Notify.create({
          type: 'positive',
          message: 'Login realizado com sucesso!',
          timeout: 2000,
        });

        // Opcional: Redirecionar após o login
        const router = useRouter();
        router.push('/'); // Redireciona para a página inicial ou dashboard

      } catch (err) {
        this.error = err.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
        this.isAuthenticated = false;
        Notify.create({
          type: 'negative',
          message: this.error,
          timeout: 3000,
        });
        console.error('Erro de login:', err);
      } finally {
        this.loading = false;
      }
    },

    // Ação de logout
    async logout() {
      // Opcional: Notifique o backend que o usuário está saindo, invalidando o token
      // try {
      //   await api.post('/logout'); // Seu endpoint de logout na API, se houver
      // } catch (error) {
      //   console.error('Erro ao deslogar no backend:', error);
      // } finally {
      // Limpa o estado e o localStorage
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        LocalStorage.remove('jwt_token');
        LocalStorage.remove('user_data');

        Notify.create({
          type: 'info',
          message: 'Você foi desconectado.',
          timeout: 2000,
        });

        // Redireciona para a página de login
        const router = useRouter();
        router.push('/login');
      // }
    },

    // Ação para carregar o usuário e o token na inicialização da aplicação
    // (Útil para manter o usuário logado após um refresh da página)
    checkAuth() {
      const token = LocalStorage.getItem('jwt_token');
      const userData = LocalStorage.getItem('user_data');

      if (token && userData) {
        this.token = token;
        this.user = userData;
        this.isAuthenticated = true;
      } else {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
      }
    }
  },
});