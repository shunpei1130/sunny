<template>
    <div class="notification-view">
      <h1>通知</h1>
      <div class="notification-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <div class="notification-content">
            <strong>{{ notification.user }}</strong> {{ notification.action }}
          </div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotificationView',
    data() {
      return {
        notifications: [
          { id: 1, user: 'ユーザー1', action: 'があなたの投稿にいいねしました', time: '5分前' },
          { id: 2, user: 'ユーザー2', action: 'があなたをフォローしました', time: '1時間前' },
          { id: 3, user: 'ユーザー3', action: 'があなたの投稿にコメントしました', time: '2時間前' },
          // 他の通知をここに追加
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .notification-view {
    padding: 20px;
  }
  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .notification-item {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  .notification-content {
    margin-bottom: 5px;
  }
  .notification-time {
    font-size: 0.8em;
    color: #888;
  }
  </style>