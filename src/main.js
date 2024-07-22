import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Vuexストアをインポート
import './assets/global.css';
import { auth } from './firebase'; // Firebaseの認証をインポート

let app;

// Firebaseの認証状態を監視
auth.onAuthStateChanged(user => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .use(store) // ストアを使用
      .mount('#app');
  }
  // 認証状態が変わった際にVuexストアのユーザー情報を更新
  store.commit('setUser', user);
});
