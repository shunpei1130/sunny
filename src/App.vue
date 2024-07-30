<template>
  <div id="app">
    <SplashScreen v-if="isLoading" />
    <router-view v-else />
    <ImageModal />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SplashScreen from './components/SplashScreen.vue';
import ImageModal from './components/ImageModal.vue';

export default {
  name: 'App',
  components: {
    SplashScreen,
    ImageModal
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoading = computed(() => store.state.isLoading);
    const isRegistered = computed(() => store.state.isRegistered);
    const agreedToPolicy = computed(() => store.state.agreedToPolicy);

    onMounted(async () => {
  try {
    await store.dispatch('initializeApp');
    
    // initializeApp が成功した後に条件分岐を行う
    if (!isRegistered.value) {
      if (!agreedToPolicy.value) {
        router.push('/welcome');
      } else {
        router.push('/sms-verification');
      }
    } else {
      // ユーザーが登録済みの場合、ホーム画面にリダイレクト
      router.push('/');
    }
  } catch (error) {
    console.error('Initialization error:', error);
    // エラーハンドリング（例：エラーページへのリダイレクトなど）
    router.push('/error'); // エラーページへのリダイレクト
  }
});

    return {
      isLoading
    };
  }
}
</script>

<style>
#app {
  text-align: center;
}

nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #333;
  padding: 10px;
  text-align: center;
}

nav a {
  color: white;
  margin: 0 15px;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>