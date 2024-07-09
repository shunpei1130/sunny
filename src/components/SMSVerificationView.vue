<template>
    <div class="sms-verification">
      <h2>SMS認証</h2>
      <div v-if="step === 'phone'">
        <p>電話番号を入力してください</p>
        <input v-model="phoneNumber" type="tel" placeholder="+81 90 1234 5678" />
        <button @click="sendSMS" :disabled="!isValidPhoneNumber || isLoading">SMSを送信</button>
        <div id="recaptcha-container"></div> <!-- reCAPTCHAコンテナ -->
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
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import { auth } from '../firebase';
  import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
  
  export default {
    name: 'SMSVerificationView',
    setup() {
      const router = useRouter();
      const store = useStore();
  
      const step = ref('phone');
      const phoneNumber = ref('');
      const verificationCode = ref('');
      const error = ref('');
      const isLoading = ref(false);
      let confirmationResult = null;
      let recaptchaVerifier = null;
  
      const isValidPhoneNumber = computed(() => {
        return phoneNumber.value.length >= 10;
      });
  
      const isValidCode = computed(() => {
        return verificationCode.value.length === 6;
      });
  
      const sendSMS = async () => {
        isLoading.value = true;
        error.value = '';
        try {
          if (!recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
              size: 'invisible',
            }, auth);
          }
          confirmationResult = await signInWithPhoneNumber(auth, phoneNumber.value, recaptchaVerifier);
          step.value = 'code';
        } catch (e) {
          error.value = e.message;
        } finally {
          isLoading.value = false;
        }
      };
  
      const verifyCode = async () => {
        isLoading.value = true;
        error.value = '';
        try {
          const credential = PhoneAuthProvider.credential(
            confirmationResult.verificationId,
            verificationCode.value
          );
          await signInWithCredential(auth, credential);
          completeVerification();
        } catch (e) {
          error.value = e.message;
          console.error(e)
        } finally {
          isLoading.value = false;
        }
      };
  
      const skipVerification = () => {
        completeVerification();
      };
  
      const completeVerification = () => {
        store.commit('setIsRegistered', true);
        router.push('/'); // ホーム画面に遷移
      };
  
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
        skipVerification,
      };
    },
  };
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
  