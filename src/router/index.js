import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import WelcomeView from '../components/WelcomeView.vue';
import PrivacyPolicyView from '../components/PrivacyPolicyView.vue';
/*
import SMSVerificationView from '../components/SMSVerificationView.vue';
*/
import UserProfile from '../views/UserProfile.vue';
import SearchView from '../views/SearchView.vue';
import NotificationView from '../views/NotificationView.vue';
import SettingView from '../views/SettingView.vue';
import EditProfile from '../views/EditProfile.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  /*一旦SMS認証は保留
  {
    path: '/sms-verification',
    name: 'sms-verification',
    component: SMSVerificationView
  },
  */
  {
    path: '/profile',
    name: 'profile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:userId',
    name: 'userProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingView,
    meta: { requiresAuth: true }
  },
  {
    path: '/EditProfile',
    name: 'EditProfile',
    component: EditProfile,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (isAuthenticated) {
    try {
      const user = auth.currentUser;
      const profileRef = doc(db, "profiles", user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists() && to.name !== 'EditProfile') {
        next('/EditProfile');
      } else {
        // 自分のプロフィールページにリダイレクトするための処理
        if (to.name === 'profile' && !to.params.userId) {
          next({ name: 'userProfile', params: { userId: user.uid } });
        } else {
          next();
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      next('/login'); // エラーが発生した場合はログインページにリダイレクト
    }
  } else {
    next();
  }
});

export default router;