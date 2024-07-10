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

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
})

export default router