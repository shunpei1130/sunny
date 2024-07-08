<template>
  <div id="app">
    <SplashScreen v-if="isLoading" />
    <router-view v-else />
    <ImageModal />
  </div>
</template>

<script>
import { computed } from 'vue';
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

    store.dispatch('initializeApp').then(() => {
      if (!isRegistered.value) {
        if (!agreedToPolicy.value) {
          router.push('/welcome');
        } else {
          router.push('/sms-verification');
        }
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