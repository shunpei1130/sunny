import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' // Vuexストアをインポート
import './assets/global.css'

createApp(App)
  .use(router)
  .use(store) // ストアを使用
  .mount('#app')
