import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue'),
        },
        {
          path: 'expenses',
          name: 'expenses',
          component: () => import('@/views/Expenses.vue'),
        },
        {
          path: 'expenses/new',
          name: 'expense-new',
          component: () => import('@/views/ExpenseNew.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/Categories.vue'),
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/Reports.vue'),
        },
        {
          path: 'accounts',
          name: 'accounts',
          component: () => import('@/views/Accounts.vue'),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    if (!authStore.isAuthenticated()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    if (to.path === '/login' && authStore.isAuthenticated()) {
      next('/');
    } else {
      next();
    }
  }
});

export default router; 