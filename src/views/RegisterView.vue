<template>
  <div class="register">
    <h2>ユーザー登録</h2>
    <form @submit.prevent="register">
      <div>
        <label for="username">ユーザー名:</label>
        <input type="text" v-model="username" id="username" required>
      </div>
      <div>
        <label for="password">パスワード:</label>
        <input type="password" v-model="password" id="password" required>
      </div>
      <button type="submit">登録</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RegisterView',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    ...mapActions(['registerUser']),
    register() {
      const newUser = {
        username: this.username,
        password: this.password
      };
      this.registerUser(newUser).then(() => {
        alert('ユーザー登録が完了しました!');
        this.$router.push('/'); // 登録後にホームページにリダイレクト
      }).catch(error => {
        console.error('登録エラー:', error);
      });
    }
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
form div {
  margin-bottom: 10px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
