<template>
    <div class="privacy-policy">
      <div class="content">
        <h2>プライバシーポリシー</h2>
        <div class="policy-container">
          <div class="rectangleDiv">
            <!-- プライバシーポリシーの内容をここに記述 -->
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            <p>ここにプライバシーポリシーの詳細な内容を記述します。</p>
            
          </div>
        </div>
        <div class="checkbox-container">
          <input type="checkbox" id="agree" v-model="agreed">
          <label for="agree">プライバシーポリシーに同意します</label>
        </div>
        <button @click="onAgree" :disabled="!agreed">同意して始める</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  
  export default {
    name: 'PrivacyPolicyView',
    setup() {
      const agreed = ref(false)
      const router = useRouter()
      const store = useStore()
  
      const onAgree = () => {
        if (agreed.value) {
          store.commit('setAgreedToPolicy', true)
          router.push('/')
        }
      }
  
      return {
        agreed,
        onAgree
      }
    }
  }
  </script>
  
  <style scoped>
  .privacy-policy {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #2f4f4f;
    color: #d3d3d3;
    font-family: Poppins, sans-serif;
  }
  
  .content {
    width: 80%;
    max-width: 600px;
  }
  
  .policy-container {
    margin-bottom: 20px;
  }
  
  .rectangleDiv {
    position: relative;
    border-radius: 45px;
    background-color: #fff;
    height: 278px;
    overflow-y: auto;
    padding: 20px;
    color: #333;
    text-align: left;
  }
  
  .checkbox-container {
    margin-bottom: 20px;
  }
  
  button {
    background-color: #008080;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>