import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import FoodPage from '../pages/FoodPage.vue';
import authRotes from './auth';
import boardRotes from './board';
import travelRoutes from './travel';
import galleryRoutes from './gallery';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/food/list', name: 'food', component: FoodPage },

    // {
    //   path: '/auth/login',
    //   name: 'login',
    //   component: () => import('../pages/auth/LoginPage.vue'),
    // },
    // {
    //   path: '/auth/join',
    //   name: 'join',
    //   component: () => import('../pages/auth/JoinPage.vue'),
    // },
    // {
    //   path: '/auth/profile',
    //   name: 'profile',
    //   component: () => import('../pages/auth/ProfilePage.vue'),
    // },
    // {
    //   path: '/auth/changepassword',
    //   name: 'changepassword',
    //   component: () => import('../pages/auth/ChangePasswordPage.vue'),
    // }, //이 코드들을 ...authRotes 로 대체한 것이다
    ...authRotes, // spread 연산자
    ...boardRotes,
    ...travelRoutes,
    ...galleryRoutes,
  ],
});
export default router;
