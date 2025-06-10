// src/router/index.js
import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth';

/*
 * If not building with SSR, you may need to import global Quasar components here.
 * For example:
 * import { QBtn } from 'quasar';
 *
 * export default provide => {
 * provide('globals', {
 * QBtn
 * });
 * };
 */
/** disable-eslint */
export default route(function ({ store }) { // Adicione 'store' se precisar acessar Pinia aqui
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  // --- GUARDA DE ROTA ---
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Acessa o store
    authStore.checkAuth(); // Verifica o status de autenticação na mudança de rota

    const isAuthenticated = authStore.getIsAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
      // Se a rota exige autenticação e o usuário NÃO está autenticado, redireciona para login
      next({ name: 'login' });
    } else if (to.name === 'login' && isAuthenticated) {
      // Se o usuário está na página de login e JÁ está autenticado, redireciona para a home/dashboard
      next({ name: 'home' }); // Ou 'dashboard', o que for sua página inicial
    } else {
      next(); // Permite que a navegação continue
    }
  });
  // ----------------------

  return Router;
});