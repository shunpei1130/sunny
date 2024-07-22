import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WelcomeView from '../components/WelcomeView.vue'
import PrivacyPolicyView from '../components/PrivacyPolicyView.vue'
import SMSVerificationView from '../components/SMSVerificationView.vue'
import UserProfile from '../views/UserProfile.vue'
import SearchView from '../views/SearchView.vue'
import NotificationView from '../views/NotificationView.vue'
import SettingView from '../views/SettingView.vue'
import EditProfile from '../views/EditProfile.vue'
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { auth } from '../firebase';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomeView
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyView
  },
  {
    path: '/sms-verification',
    name: 'sms-verification',
    component: SMSVerificationView
  },
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingView
  },
  {
    path: '/EditProfile',
    name: 'EditProfile',
    component: EditProfile
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router