<template>
  <div class="edit-profile">
    <div class="profile-photo" @click="triggerFileInput">
      <img v-if="editProfile.photo" :src="editProfile.photo" alt="プロフィール写真" class="photo-circle"/>
      <div v-else class="photo-circle-placeholder">
        <svg class="camera-icon" width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="48" cy="48" r="48" fill="#D3D3D3"/>
          <path d="M63.6562 36.9336H57.4141L55.927 32.766C55.8242 32.4808 55.6359 32.2343 55.3878 32.0602C55.1397 31.886 54.8439 31.7927 54.5408 31.793H40.4592C39.8396 31.793 39.2842 32.1831 39.0776 32.766L37.5859 36.9336H31.3438C29.315 36.9336 27.6719 38.5768 27.6719 40.6055V61.5352C27.6719 63.5639 29.315 65.207 31.3438 65.207H63.6562C65.685 65.207 67.3281 63.5639 67.3281 61.5352V40.6055C67.3281 38.5768 65.685 36.9336 63.6562 36.9336ZM47.5 57.8633C43.4426 57.8633 40.1562 54.577 40.1562 50.5195C40.1562 46.4621 43.4426 43.1758 47.5 43.1758C51.5574 43.1758 54.8438 46.4621 54.8438 50.5195C54.8438 54.577 51.5574 57.8633 47.5 57.8633ZM43.0938 50.5195C43.0938 51.6881 43.558 52.8089 44.3843 53.6352C45.2106 54.4616 46.3314 54.9258 47.5 54.9258C48.6686 54.9258 49.7894 54.4616 50.6157 53.6352C51.442 52.8089 51.9062 51.6881 51.9062 50.5195C51.9062 49.3509 51.442 48.2302 50.6157 47.4038C49.7894 46.5775 48.6686 46.1133 47.5 46.1133C46.3314 46.1133 45.2106 46.5775 44.3843 47.4038C43.558 48.2302 43.0938 49.3509 43.0938 50.5195Z" fill="white"/>
        </svg>
      </div>
      <input type="file" ref="fileInput" @change="onFileChange" style="display: none;" />
    </div>
    <div class="photo-text" @click="triggerFileInput">プロフィール写真を設定する</div>
    <svg class="back-icon" width="28" height="26" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg" @click="goProfile">
      <rect width="28" height="26" rx="10" fill="#BDBDBD"/>
      <path d="M16.1358 20.5838C15.9615 20.5843 15.7893 20.5486 15.6319 20.4793C15.4744 20.4099 15.3356 20.3087 15.2258 20.183L9.59084 13.683C9.41925 13.4891 9.32544 13.246 9.32544 12.995C9.32544 12.7441 9.41925 12.501 9.59084 12.3071L15.4242 5.80713C15.6222 5.58589 15.9068 5.44677 16.2153 5.42036C16.5238 5.39394 16.8309 5.48241 17.0692 5.66629C17.3074 5.85018 17.4573 6.11442 17.4857 6.40088C17.5141 6.68734 17.4189 6.97256 17.2208 7.19379L12.0058 13.0005L17.0458 18.8071C17.1885 18.9661 17.2791 19.1598 17.307 19.3651C17.3348 19.5705 17.2988 19.7789 17.203 19.9658C17.1073 20.1527 16.9559 20.3103 16.7668 20.4198C16.5777 20.5293 16.3587 20.5862 16.1358 20.5838Z" fill="white"/>
    </svg>

    <form @submit.prevent="saveProfile">
      <div class="form-group" v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}</label>
        <input 
          :id="field.id" 
          v-model="editProfile[field.id]" 
          type="text" 
          :placeholder="field.placeholder"
          @focus="openModal(field)"
        />
        <svg class="next-icon" width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg" @focus="openModal(field)">
          <path d="M6.05641 2.1875L4.9585 3.54375L10.5897 10.5L4.9585 17.4563L6.05641 18.8125L12.7502 10.5L6.05641 2.1875Z" fill="#D3D3D3"/>
        </svg>
      </div>

      <button type="submit" class="save-button">
        <b>保存する</b>
      </button>
    </form>

    <!-- フルスクリーンオーバーレイ -->
    <transition name="fade">
      <div v-if="showModal" class="fullscreen-overlay" @click="closeModal"></div>
    </transition>

    <!-- 入力用モーダル -->
    <transition name="slide-fade">
      <div v-if="showModal" class="modal-container">
        <div class="modal-content" @click.stop>
          <div class="rectangle-div">
            <h3>{{ currentField.label }}</h3>
            <input 
              ref="modalInput"
              v-model="editProfile[currentField.id]" 
              type="text" 
              :placeholder="currentField.placeholder"
              @keyup.enter="closeModal"
            />
            <button @click="closeModal">完了</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: "EditProfile",
  setup() {
    const router = useRouter();
    const store = useStore();
    const fileInput = ref(null);
    const modalInput = ref(null);
    const editProfile = reactive({
      hashtag: store.state.profile.hashtag || '',
      username: store.state.profile.username || '',
      bio: store.state.profile.bio || '',
      age: store.state.profile.age || '',
      photo: store.state.profile.photo || ''
    });

    const fields = [
      { id: 'hashtag', label: '#', placeholder: '' },
      { id: 'username', label: 'ID', placeholder: '' },
      { id: 'bio', label: 'profile', placeholder: '' },
      { id: 'age', label: 'age', placeholder: '' }
    ];

    const showModal = ref(false);
    const currentField = ref({});

    const openModal = (field) => {
      currentField.value = field;
      showModal.value = true;
      nextTick(() => {
        modalInput.value.focus();
      });
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const onFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          editProfile.photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const saveProfile = () => {
      console.log('保存されたプロフィール:', editProfile);
      store.dispatch('saveProfile', editProfile);
      router.push('/profile');
    };

    const goHome = () => {
      router.push('/');
    };
    const goProfile = () => {
      router.push('/Profile');
    };

    return {
      editProfile,
      fields,
      showModal,
      currentField,
      openModal,
      closeModal,
      saveProfile,
      triggerFileInput,
      onFileChange,
      fileInput,
      modalInput,
      goHome,
      goProfile
    };
  }
});
</script>

<style scoped>
.edit-profile {
  width: 100%;
  position: relative;
  background-color: #ececec;
  height: 812px;
  overflow: hidden;
  font-family: Poppins, sans-serif;
  color: #848484;
  text-align: center;
}

.profile-photo {
  position: relative;
  margin: 111px auto 0;
  width: 96px;
  height: 96px;
}

.photo-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.photo-circle-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  color: #ffffff;
  text-align: center;
}

.camera-icon {
  position: absolute;
  top: 25px;
  left: 25px;
  width: 47px;
  height: 47px;
}

.photo-text {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #008080;
}

.back-icon {
  position: absolute;
  top: 53px;
  left: 18px;
  width: 28px;
  height: 26px;
  cursor: pointer;
}

.form-group {
  position: relative;
  margin: 20px 0;
  padding: 10px 0;
  border-bottom: 1px solid #bdbdbd;
}

.form-group label {
  position: absolute;
  left: 20px;
  font-weight: 500;
}

.form-group input {
  width: calc(100% - 100px);
  margin-left: 80px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #848484;
}

.next-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 21px;
  cursor: pointer;
}

.save-button {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 263px;
  height: 57px;
  border-radius: 12px;
  background-color: #008080;
  color: #fff;
  font-size: 15px;
  border: none;
  cursor: pointer;
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-container {
  position: fixed;
  bottom: 30%;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1001;
}

.modal-content {
  width: 100%;
}

.rectangle-div {
  width: 100%;
  position: relative;
  border-radius: 35px;
  background-color: #fff;
  height: 300px;
  padding: 20px;
  box-sizing: border-box;
}

.rectangle-div h3 {
  margin-bottom: 20px;
  color: #333;
}

.rectangle-div input {
  width: 80%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.rectangle-div button {
  padding: 10px 20px;
  background-color: #008080;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 70%;
  margin-top: 50px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
