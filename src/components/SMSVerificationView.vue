<template>
    <div class="sms-verification">
      <h2>SMS認証</h2>
      <div v-if="step === 'phone'">
        <p>電話番号を入力してください</p>
        <input v-model="phoneNumber" type="tel" placeholder="+81 90 1234 5678" />
        <button @click="sendSMS" :disabled="!isValidPhoneNumber || isLoading">SMSを送信</button>
      </div>
      <div v-else-if="step === 'code'">
        <p>SMSで送信された6桁のコードを入力してください</p>
        <input v-model="verificationCode" type="text" placeholder="123456" maxlength="6" />
        <button @click="verifyCode" :disabled="!isValidCode || isLoading">認証する</button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="isLoading">処理中...</p>
      
      <!-- スキップボタンを追加 -->
      <button @click="skipVerification" class="skip-button">認証をスキップ（開発用）</button>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  
  export default {
    name: 'SMSVerificationView',
    setup() {
      const router = useRouter()
      const store = useStore()
  
      const step = ref('phone')
      const phoneNumber = ref('')
      const verificationCode = ref('')
      const error = ref('')
      const isLoading = ref(false)
  
      const isValidPhoneNumber = computed(() => {
        // 簡単な電話番号バリデーション（実際はもっと厳密に）
        return phoneNumber.value.length >= 10
      })
  
      const isValidCode = computed(() => {
        return verificationCode.value.length === 6
      })
  
      const sendSMS = async () => {
        // SMS送信のモック処理
        console.log('SMS sent to', phoneNumber.value)
        step.value = 'code'
      }
  
      const verifyCode = async () => {
        // 認証のモック処理
        console.log('Verification successful')
        completeVerification()
      }
  
      const skipVerification = () => {
        // 認証をスキップしてホーム画面に遷移
        completeVerification()
      }
  
      const completeVerification = () => {
        store.commit('setIsRegistered', true)
        router.push('/') // ホーム画面に遷移
      }
  
      return {
        step,
        phoneNumber,
        verificationCode,
        error,
        isLoading,
        isValidPhoneNumber,
        isValidCode,
        sendSMS,
        verifyCode,
        skipVerification
      }
    }
  }
  </script>
  
  <style scoped>
  .sms-verification {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #2f4f4f;
    color: #d3d3d3;
    font-family: Poppins, sans-serif;
  }
  
  input {
    margin: 10px 0;
    padding: 10px;
    width: 250px;
    border-radius: 5px;
    border: none;
  }
  
  button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #008080;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error {
    color: #ff6b6b;
    margin-top: 10px;
  }
  
  .skip-button {
    margin-top: 20px;
    background-color: #ff6b6b;
  }
  </style>