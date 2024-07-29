<template>
  <footer class="footer">
    <div class="vector-icon" @click="goToChat">
      <img src="../assets/search.png" alt="search icon" width="88" height="88" />
      
    </div>
  </footer>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'FooterView',
  setup() {
    const router = useRouter();

    const goToChat = () => {
      router.push('/chat');
    };

    return {
      goToChat
    };
  }
}
</script>

<style scoped>
footer {
position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 80px;
display: flex;
justify-content: center;
align-items: center;
background-color: transparent; /* 背景色を透明に */
}

.vector-icon {
width: 80px;
height: 80px;
flex-shrink: 0;
filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
cursor: pointer;
position: absolute;
right: 10px; /* 右に10px移動 */
bottom: 10px; /* 下に10px移動 */
}


</style>
