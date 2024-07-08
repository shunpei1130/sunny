<template>
  <div class="user-profile" @touchstart="startTouch" @touchmove="moveTouch">
    <div class="header">
      <button class="back-button" @click="goToHome">←</button>
      <h2>{{ username }}</h2>
    </div>
    <div class="user-info">
      <!-- 他のユーザー情報 -->
    </div>
    <!-- 他のプロフィールページの内容 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserProfile',
  data() {
    return {
      startX: 0,
      endX: 0
    }
  },
  computed: {
    ...mapGetters(['getUsername']),
    username() {
      return this.getUsername;
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    },
    startTouch(event) {
      this.startX = event.touches[0].clientX;
    },
    moveTouch(event) {
      this.endX = event.touches[0].clientX;
      if (this.startX - this.endX > 50) {
        // スワイプが左から右へ50px以上移動した場合
        this.goToHome();
      }
    }
  }
}
</script>


<style scoped>
.user-profile {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  align-items: center;
}
.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}
.user-info {
  margin-bottom: 20px;
}
h2 {
  font-size: 24px;
  margin-bottom: 10px;
}
</style>
