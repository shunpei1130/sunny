<template>
  <HeaderView />
    <div class="sunny-top">
          
      <div class="setting-item" @click="toggleNavBar('terms')">
      <div class="rectangle-parent">
        <div class="group-child"></div>
        <div class="item-text">規約一覧</div>
        <img class="icons-arrow-right" alt="arrow" src="../assets/arrow_right.png" />
      </div>
      <svg class="item-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M10 18H20C20.55 18 21 17.55 21 17C21 16.45 20.55 16 20 16H10C9.45 16 9 16.45 9 17C9 17.55 9.45 18 10 18ZM3 7C3 7.55 3.45 8 4 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6H4C3.45 6 3 6.45 3 7ZM10 13H20C20.55 13 21 12.55 21 12C21 11.45 20.55 11 20 11H10C9.45 11 9 11.45 9 12C9 12.55 9.45 13 10 13Z" fill="white"/>
</svg>
    </div>
    <div v-if="activeItem === 'terms'" class="rectangle-div">
      <div class="nav-item" @click="navigate('privacy')">プライバシーポリシー</div>
      <div class="nav-item" @click="navigate('terms')">利用規約</div>
    </div>

    <div class="setting-item" @click="toggleNavBar('help')">
      <div class="rectangle-parent">
        <div class="group-child"></div>
        <div class="item-text">ヘルプ</div>
        <img class="icons-arrow-right" alt="arrow" src="../assets/arrow_right.png" />
      </div>
      <svg class="item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.95 18C12.3 18 12.596 17.879 12.838 17.637C13.0793 17.3957 13.2 17.1 13.2 16.75C13.2 16.4 13.0793 16.1043 12.838 15.863C12.596 15.621 12.3 15.5 11.95 15.5C11.6 15.5 11.304 15.621 11.062 15.863C10.8207 16.1043 10.7 16.4 10.7 16.75C10.7 17.1 10.8207 17.3957 11.062 17.637C11.304 17.879 11.6 18 11.95 18ZM11.05 14.15H12.9C12.9 13.6 12.9627 13.1667 13.088 12.85C13.2127 12.5333 13.5667 12.1 14.15 11.55C14.5833 11.1167 14.925 10.704 15.175 10.312C15.425 9.92067 15.55 9.45 15.55 8.9C15.55 7.96667 15.2083 7.25 14.525 6.75C13.8417 6.25 13.0333 6 12.1 6C11.15 6 10.3793 6.25 9.788 6.75C9.196 7.25 8.78333 7.85 8.55 8.55L10.2 9.2C10.2833 8.9 10.471 8.575 10.763 8.225C11.0543 7.875 11.5 7.7 12.1 7.7C12.6333 7.7 13.0333 7.84567 13.3 8.137C13.5667 8.429 13.7 8.75 13.7 9.1C13.7 9.43333 13.6 9.74567 13.4 10.037C13.2 10.329 12.95 10.6 12.65 10.85C11.9167 11.5 11.4667 11.9917 11.3 12.325C11.1333 12.6583 11.05 13.2667 11.05 14.15ZM12 22C10.6167 22 9.31667 21.7373 8.1 21.212C6.88333 20.6873 5.825 19.975 4.925 19.075C4.025 18.175 3.31267 17.1167 2.788 15.9C2.26267 14.6833 2 13.3833 2 12C2 10.6167 2.26267 9.31667 2.788 8.1C3.31267 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31233 8.1 2.787C9.31667 2.26233 10.6167 2 12 2C13.3833 2 14.6833 2.26233 15.9 2.787C17.1167 3.31233 18.175 4.025 19.075 4.925C19.975 5.825 20.6873 6.88333 21.212 8.1C21.7373 9.31667 22 10.6167 22 12C22 13.3833 21.7373 14.6833 21.212 15.9C20.6873 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6873 15.9 21.212C14.6833 21.7373 13.3833 22 12 22Z" fill="white"/>
        </svg>
    </div>
    <div v-if="activeItem === 'help'" class="rectangle-div">
      <div class="nav-item" @click="navigate('faq')">FAQ</div>
      <div class="nav-item" @click="navigate('support')">サポート</div>
    </div>


  
    <div class="setting-item" @click="toggleNavBar('notifications')">
      <div class="rectangle-parent">
        <div class="group-child"></div>
        <div class="item-text">通知設定</div>
        <img class="icons-arrow-right" alt="arrow" src="../assets/arrow_right.png" />
      </div>
      <svg class="item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9996 23C13.0996 23 13.9896 22.11 13.9896 21.01H10.0096C10.0096 22.11 10.8996 23 11.9996 23ZM20.2896 18.29L18.9996 17V11C18.9996 7.65 16.6396 4.85 13.4996 4.17V3C13.4996 2.17 12.8296 1.5 11.9996 1.5C11.1696 1.5 10.4996 2.17 10.4996 3V4.17C7.35956 4.85 4.99956 7.65 4.99956 11V17L3.70956 18.29C3.07956 18.92 3.51956 20 4.40956 20H19.5796C20.4796 20 20.9196 18.92 20.2896 18.29ZM12.9996 16H10.9996V14H12.9996V16ZM12.9996 11C12.9996 11.55 12.5496 12 11.9996 12C11.4496 12 10.9996 11.55 10.9996 11V9C10.9996 8.45 11.4496 8 11.9996 8C12.5496 8 12.9996 8.45 12.9996 9V11Z" fill="white"/>
        </svg>
    </div>
    <div v-if="activeItem === 'notifications'" class="rectangle-div">
      <div class="nav-item" @click="navigate('email')">メール通知</div>
      <div class="nav-item" @click="navigate('sms')">SMS通知</div>
    </div>
     
        
  
    <div class="setting-item" @click="toggleNavBar('logout')">
      <div class="rectangle-parent">
        <div class="group-child"></div>
        <div class="item-text">ログアウトを確認</div>
        <img class="icons-arrow-right" alt="arrow" src="../assets/arrow_right.png" />
      </div>
      <svg class="item-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.75 7.5H5.25C4.65345 7.5006 4.0815 7.73784 3.65967 8.15967C3.23784 8.5815 3.0006 9.15345 3 9.75V14.25C3.0004 14.6477 3.15856 15.029 3.43978 15.3102C3.721 15.5914 4.1023 15.7496 4.5 15.75V21C4.5004 21.3977 4.65856 21.779 4.93978 22.0602C5.221 22.3414 5.6023 22.4996 6 22.5H9C9.3977 22.4996 9.779 22.3414 10.0602 22.0602C10.3414 21.779 10.4996 21.3977 10.5 21V12H9V21H6V14.25H4.5V9.75C4.5 9.55109 4.57902 9.36032 4.71967 9.21967C4.86032 9.07902 5.05109 9 5.25 9H18.75C18.9489 9 19.1397 9.07902 19.2803 9.21967C19.421 9.36032 19.5 9.55109 19.5 9.75V14.25H18V21H15V12H13.5V21C13.5004 21.3977 13.6586 21.779 13.9398 22.0602C14.221 22.3414 14.6023 22.4996 15 22.5H18C18.3977 22.4996 18.779 22.3414 19.0602 22.0602C19.3414 21.779 19.4996 21.3977 19.5 21V15.75C19.8977 15.7496 20.279 15.5914 20.5602 15.3102C20.8414 15.029 20.9996 14.6477 21 14.25V9.75C20.9994 9.15345 20.7622 8.5815 20.3403 8.15967C19.9185 7.73784 19.3466 7.5006 18.75 7.5ZM7.5 6.75C6.90666 6.75 6.32664 6.57405 5.83329 6.24441C5.33994 5.91477 4.95542 5.44623 4.72836 4.89805C4.5013 4.34987 4.44189 3.74667 4.55764 3.16473C4.6734 2.58279 4.95912 2.04824 5.37868 1.62868C5.79824 1.20912 6.33279 0.923401 6.91473 0.807646C7.49667 0.69189 8.09987 0.7513 8.64805 0.978363C9.19623 1.20543 9.66476 1.58994 9.99441 2.08329C10.3241 2.57664 10.5 3.15666 10.5 3.75C10.4992 4.54541 10.1829 5.30801 9.62044 5.87044C9.05801 6.43288 8.29541 6.74921 7.5 6.75ZM7.5 2.25C7.20333 2.25 6.91332 2.33797 6.66664 2.5028C6.41997 2.66762 6.22771 2.90189 6.11418 3.17598C6.00065 3.45007 5.97094 3.75167 6.02882 4.04264C6.0867 4.33361 6.22956 4.60088 6.43934 4.81066C6.64912 5.02044 6.91639 5.1633 7.20736 5.22118C7.49834 5.27906 7.79994 5.24935 8.07403 5.13582C8.34811 5.02229 8.58238 4.83003 8.7472 4.58336C8.91203 4.33668 9 4.04667 9 3.75C8.9996 3.3523 8.84144 2.971 8.56022 2.68978C8.279 2.40856 7.8977 2.2504 7.5 2.25ZM16.5 6.75C15.9067 6.75 15.3266 6.57405 14.8333 6.24441C14.3399 5.91477 13.9554 5.44623 13.7284 4.89805C13.5013 4.34987 13.4419 3.74667 13.5576 3.16473C13.6734 2.58279 13.9591 2.04824 14.3787 1.62868C14.7982 1.20912 15.3328 0.923401 15.9147 0.807646C16.4967 0.69189 17.0999 0.7513 17.6481 0.978363C18.1962 1.20543 18.6648 1.58994 18.9944 2.08329C19.3241 2.57664 19.5 3.15666 19.5 3.75C19.4992 4.54541 19.1829 5.30801 18.6204 5.87044C18.058 6.43288 17.2954 6.74921 16.5 6.75ZM16.5 2.25C16.2033 2.25 15.9133 2.33797 15.6666 2.5028C15.42 2.66762 15.2277 2.90189 15.1142 3.17598C15.0006 3.45007 14.9709 3.75167 15.0288 4.04264C15.0867 4.33361 15.2296 4.60088 15.4393 4.81066C15.6491 5.02044 15.9164 5.1633 16.2074 5.22118C16.4983 5.27906 16.7999 5.24935 17.074 5.13582C17.3481 5.02229 17.5824 4.83003 17.7472 4.58336C17.912 4.33668 18 4.04667 18 3.75C17.9996 3.3523 17.8414 2.971 17.5602 2.68978C17.279 2.40856 16.8977 2.2504 16.5 2.25Z" fill="white"/>
        </svg>
    </div>
    <div v-if="activeItem === 'logout'" class="rectangle-div">
      <div class="nav-item" @click="confirmLogout">ログアウトする</div>
    </div>
        
        
  
    <div class="setting-item" @click="toggleNavBar('privacy')">
      <div class="rectangle-parent">
        <div class="group-child"></div>
        <div class="item-text">公開範囲</div>
        <img class="icons-arrow-right" alt="arrow" src="../assets/arrow_right.png" />
      </div>
      <svg class="item-icon" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="ic:baseline-logout">
            <path id="Vector" d="M16.292 6.70833L14.9407 8.05958L17.4132 10.5417H7.66699V12.4583H17.4132L14.9407 14.9308L16.292 16.2917L21.0837 11.5L16.292 6.70833ZM3.83366 4.79167H11.5003V2.875H3.83366C2.77949 2.875 1.91699 3.7375 1.91699 4.79167V18.2083C1.91699 19.2625 2.77949 20.125 3.83366 20.125H11.5003V18.2083H3.83366V4.79167Z" fill="white"/>
          </g>
        </svg>
    </div>
    <div v-if="activeItem === 'privacy'" class="rectangle-div">
      <div class="nav-item" @click="navigate('public')">公開</div>
      <div class="nav-item" @click="navigate('private')">非公開</div>
    </div>
        

  
    </div>
  </template>
  
  <script>
  import HeaderView from './HeaderView.vue';
  import { getAuth, signOut } from 'firebase/auth';
  import { useRouter } from 'vue-router';

  export default {
    components: {
      HeaderView,
    },
    name: "SettingView",
    data() {
      return {
        activeItem: null
      };
    },
    methods: {
      toggleNavBar(item) {
        this.activeItem = this.activeItem === item ? null : item;
      },
      navigate(action) {
        console.log(`Navigating to ${action}`);
        // ここにナビゲーションのコードを追加
      },
      goToHome() {
        // ホームページに遷移するロジック
        this.$router.push('/');
      }
    },
    setup() {
    const router = useRouter();
    const auth = getAuth();

    const confirmLogout = async () => {
      try {
        await signOut(auth);
        router.push('/login');
      } catch (error) {
        console.error('ログアウトエラー:', error);
      }
    };

    return {
      confirmLogout
    };
  }
    
  };
  </script>
  
  <style scoped>


.home-button {
  background-color: #008080;
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  
}



  .sunny-top {
    width: 100%;
    position: relative;
    background-color: #ffffff;
    overflow: hidden;
    text-align: center;
    font-size: 14px;
    color: #fff;
    font-family: 'Noto Sans JP', sans-serif;
  }
  
  h3 {
    color: black;
    margin-top: 20px;
  }
  
  .setting-item {
    position: relative;
    width: 304px;
    height: 57px;
    margin: 40px 55px 10px 55px;
    cursor: pointer;
  }
  
  .rectangle-parent {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background-color: #008080;
    border-radius: 28.5px;
  }
  
  .group-child {
    width: 100%;
    height: 100%;
    border-radius: 28.5px;
    background-color: #008080;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .item-text {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 15px;
    font-weight: 500;
    color: white;
    z-index: 1;
  }
  
  .icons-arrow-right {
    position: absolute;
    right: 20px;
    width: 24px;
    height: 24px;
    z-index: 1;
  }
  
  .item-icon {
    width: 24px;
    height: 24px;
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
  }
  
  .rectangle-div {
    width: 304px;
    position: relative;
    border-radius: 29px;
    background-color: #fff;
    margin: 0px auto 20px;
    padding: 0 10px 10px 10px;
  }
  
  .nav-item {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    color: black; /* テキストカラーを黒に変更 */
  }
  
  .nav-item:last-child {
    border-bottom: none;
    margin-bottom: -40px;
  }
  </style>
  