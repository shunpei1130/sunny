<template>
  <HeaderView />
  <div class="notification-view">
    <h2>通知</h2>
    <div v-if="notifications.length === 0" class="no-notifications">
      新しい通知はありません
    </div>
    <ul v-else class="notification-list">
      <li v-for="notification in notifications" :key="notification.id" class="notification-item">
        <div class="notification-content" @click="handleNotificationClick(notification)">
          <img :src="notification.senderPhoto" :alt="notification.senderName" class="sender-photo">
          <div class="notification-text">
            <strong>{{ notification.senderName }}</strong> からの新しいメッセージ:
            {{ truncateMessage(notification.message) }}
          </div>
        </div>
        <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, query, where, onSnapshot, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase';
import HeaderView from './HeaderView.vue';

export default {
  components: {
    HeaderView
  },
  name: 'NotificationView',
  setup() {
    console.log('NotificationView setup called');
    const router = useRouter();
    const notifications = ref([]);
    let unsubscribe = null;

    const fetchNotifications = () => {
  console.log('Fetching notifications');
  const db = getFirestore();
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user');
    return;
  }
  console.log('Current user ID:', user.uid);

  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('recipientId', '==', user.uid),
    where('read', '==', false),
    orderBy('timestamp', 'desc'),
    limit(20)
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    console.log('Snapshot received, document count:', snapshot.docs.length);
    notifications.value = snapshot.docs.map(doc => {
      console.log('Notification document:', doc.id, doc.data());
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    console.log('Fetched notifications:', notifications.value);
  }, (error) => {
    console.error('Error fetching notifications:', error);
  });
};

    const handleNotificationClick = async (notification) => {
      console.log('Notification clicked:', notification);
      // 通知を既読にする
      const db = getFirestore();
      const notificationRef = doc(db, 'notifications', notification.id);
      try {
        await updateDoc(notificationRef, { read: true });
        console.log('Notification marked as read');
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }

      // チャットルームに遷移する
      router.push(`/chat/${notification.chatRoomId}`);
    };

    const truncateMessage = (message, length = 30) => {
      return message.length > length ? message.substring(0, length) + '...' : message;
    };

    const formatTime = (timestamp) => {
      if (timestamp && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      }
      return 'Invalid date';
    };

    onMounted(() => {
      console.log('NotificationView mounted');
      fetchNotifications();
    });

    onUnmounted(() => {
      console.log('NotificationView unmounted');
      if (unsubscribe) {
        unsubscribe();
      }
    });

    return {
      notifications,
      handleNotificationClick,
      truncateMessage,
      formatTime,
      HeaderView
    };
  }
}
</script>

<style scoped>
.notification-view {
  padding: 20px;
}

.no-notifications {
  text-align: center;
  color: #888;
  margin-top: 20px;
}

.notification-list {
  list-style-type: none;
  padding: 0;
}

.notification-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.notification-content {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.sender-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.notification-text {
  flex-grow: 1;
}

.notification-time {
  font-size: 0.8em;
  color: #888;
  text-align: right;
  margin-top: 5px;
}
</style>