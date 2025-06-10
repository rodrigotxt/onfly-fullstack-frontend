// src/router/routes.js
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      { path: 'order/new', name: 'order-new', component: () => import('pages/TravelOrderPage.vue'), meta: { requiresAuth: true } },
      { path: 'order/:id?', name: 'order-detail', component: () => import('pages/TravelOrderPage.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue')
  },


  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes