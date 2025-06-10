// src/boot/auth-init.js
import { boot } from 'quasar/wrappers';
import { useAuthStore } from 'stores/auth';

export default boot(({ app }) => {
  const authStore = useAuthStore();
  authStore.checkAuth();
});