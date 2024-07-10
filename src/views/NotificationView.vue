<template>
  <HeaderView />
    <div class="notification-view">
        <svg class="svg-icon" idth="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5016 24.4688C14.7391 24.4688 15.7516 23.4562 15.7516 22.2188H11.2516C11.2516 23.4562 12.2528 24.4688 13.5016 24.4688ZM20.2516 17.7188V12.0938C20.2516 8.64 18.4066 5.74875 15.1891 4.98375V4.21875C15.1891 3.285 14.4353 2.53125 13.5016 2.53125C12.5678 2.53125 11.8141 3.285 11.8141 4.21875V4.98375C8.58533 5.74875 6.75158 8.62875 6.75158 12.0938V17.7188L5.30033 19.17C4.59158 19.8788 5.08658 21.0938 6.08783 21.0938H20.9041C21.9053 21.0938 22.4116 19.8788 21.7028 19.17L20.2516 17.7188Z" fill="#008080"/>
        </svg>

      <div class="notification-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <div class="notification-content">
            <img :src="notification.profileImage" :alt="notification.user" class="profile-image">
            <div class="notification-text">
              <div><strong>{{ notification.user }}</strong></div>
              <div>{{ notification.action }}</div>
            </div>
          </div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import HeaderView from './HeaderView.vue';
  export default {
    components: {
      HeaderView,
    },
    name: 'NotificationView',
    data() {
      return {
        notifications: [
          { id: 1, user: 'ユーザー1', action: 'があなたの投稿にいいねしました', time: '5分前', profileImage: 'path/to/image1.jpg' },
          { id: 2, user: 'ユーザー2', action: 'があなたをフォローしました', time: '1時間前', profileImage: 'path/to/image2.jpg' },
          { id: 3, user: 'ユーザー3', action: 'があなたの投稿にコメントしました', time: '2時間前', profileImage: 'path/to/image3.jpg' },
          // 他の通知をここに追加
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .svg-icon {
    padding-bottom: 10px;
  }
  .notification-view {
    padding: 40px;
    text-align: left;
  }
  
  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .notification-item {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .notification-content {
    display: flex;
    align-items: flex-start;
    margin-bottom: 5px;
  }
  
  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
  }
  
  .notification-text {
    flex: 1;
  }
  
  .notification-time {
    font-size: 0.8em;
    color: #888;
    align-self: flex-end;
  }
  </style>