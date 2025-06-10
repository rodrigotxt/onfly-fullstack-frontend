// src/router/index.js
import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth';

/** disable-eslint */

let routerInstance;

export default route(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  // Atribua o roteador à variável externa routerInstance
  routerInstance = createRouter({ // <-- Certifique-se de que a atribuição está aqui
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });


  routerInstance.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    authStore.checkAuth();

    const isAuthenticated = authStore.getIsAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'login' });
    } else if (to.name === 'login' && isAuthenticated) {
      next({ name: 'home' });
    } else {
      next();
    }
  });
  // ----------------------

  return routerInstance;
});

export { routerInstance };