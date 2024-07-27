<template>
    <div v-if="show" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <h2>フォロー / フォロワー</h2>
        <div class="tabs">
          <button 
            :class="['tab-button', { active: activeTab === 'following' }]"
            @click="activeTab = 'following'"
          >
            フォロー中
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'followers' }]"
            @click="activeTab = 'followers'"
          >
            フォロワー
          </button>
        </div>
        <ul class="follow-list">
          <li v-for="user in displayUsers" :key="user.id" class="follow-item" @click="goToUserProfile(user.id)">
            <img :src="user.photo" alt="User photo" class="user-photo">
            <span class="user-name">{{ user.username }}</span>
          </li>
        </ul>
        <button @click="close" class="close-button">閉じる</button>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'FollowListModal',
    props: {
      show: Boolean,
      following: Array,
      followers: Array,
    },
    setup(props, { emit }) {
      const router = useRouter();
      const activeTab = ref('following');
  
      const displayUsers = computed(() => {
        return activeTab.value === 'following' ? props.following : props.followers;
      });
  
      const close = () => {
        emit('close');
      };
  
      const goToUserProfile = (userId) => {
        router.push({ name: 'userProfile', params: { userId: userId } });
        close();
      };
  
      return { close, goToUserProfile, activeTab, displayUsers };
    },
  });
  </script>
  
  <style scoped>


.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.tab-button {
  padding: 10px 20px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-button.active {
  background-color: #007bff;
  color: white;
}

.follow-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

.follow-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}



.follow-item {
  cursor: pointer;
  transition: background-color 0.3s;
}

.follow-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }
  
  .follow-list {
    list-style-type: none;
    padding: 0;
  }
  
  .follow-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .user-photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .close-button {
    margin-top: 20px;
  }
  </style>