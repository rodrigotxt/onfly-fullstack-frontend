// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { LocalStorage, Notify } from 'quasar' // Para recuperar o token do localStorage
// Importe o store de autenticação (se precisar acessar o token diretamente dele)
import { useAuthStore } from 'stores/auth';

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost/api';

const api = axios.create({ baseURL: apiBaseUrl })

api.interceptors.request.use(config => {
  // Recupera o token do localStorage ou do Pinia store
  // A prioridade aqui é do localStorage pois ele persiste entre refreshes
  const token = LocalStorage.getItem('jwt_token');

  // Se houver um token, adicione-o ao cabeçalho Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers.Accept = 'application/json';

  return config;
}, error => {
  return Promise.reject(error);
});

// Opcional: Adicione um interceptador de resposta para lidar com erros de autenticação (401)
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Se a resposta for 401 Unauthorized e o usuário estiver autenticado,
  // isso pode indicar que o token expirou ou é inválido.
  // Neste caso, deslogue o usuário.
  if (error.response?.status === 401 && LocalStorage.getItem('jwt_token')) {
    const authStore = useAuthStore(); // Acessa o store
    authStore.logout(); // Chama a ação de logout
    Notify.create({
      type: 'negative',
      message: 'Sessão expirada ou inválida. Por favor, faça login novamente.',
      timeout: 3000,
    });
  }
  return Promise.reject(error);
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }