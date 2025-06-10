// src/boot/pinia-router-connector.js
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'stores/auth';
import { routerInstance } from 'src/router';

export default boot(({ app }) => {
  // app.pinia é a instância raiz do Pinia.
  const authStore = useAuthStore(app.pinia);

  if (routerInstance) {
    authStore.setRouter(routerInstance);
  } else {
    console.warn('Router instance not available in pinia-router-connector boot file.');
  }
});