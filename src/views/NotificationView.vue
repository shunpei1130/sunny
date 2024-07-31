<template>
  <HeaderView />
  <div class="notification-view">
    <h2>通知</h2>
    <div v-if="notificationsWithProfiles && notificationsWithProfiles.length === 0" class="no-notifications">
      新しい通知はありません
    </div>
    <ul v-else-if="notificationsWithProfiles && notificationsWithProfiles.length > 0" class="notification-list">
      <li v-for="notification in notificationsWithProfiles" :key="notification.id" class="notification-item">
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
    <div v-else class="loading">
      読み込み中...
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getFirestore, collection, query, where, onSnapshot, orderBy, limit, updateDoc, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';
import HeaderView from './HeaderView.vue';

export default {
  components: {
    HeaderView
  },
  name: 'NotificationView',
  setup() {
    const router = useRouter();
    const notifications = ref([]);
    const profiles = ref({});
    let unsubscribe = null;

    const fetchNotifications = () => {
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user');
        return;
      }

      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('recipientId', '==', user.uid),
        where('read', '==', false),
        orderBy('timestamp', 'desc'),
        limit(20)
      );

      unsubscribe = onSnapshot(q, async (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Fetch profiles for each unique sender
        const uniqueSenderIds = [...new Set(notificationsData.map(n => n.senderId))];
        for (const senderId of uniqueSenderIds) {
          if (!profiles.value[senderId]) {
            const profileDoc = await getDoc(doc(db, 'profiles', senderId));
            if (profileDoc.exists()) {
              profiles.value[senderId] = profileDoc.data();
            }
          }
        }

        notifications.value = notificationsData;
      }, (error) => {
        console.error('Error fetching notifications:', error);
      });
    };

    const notificationsWithProfiles = computed(() => {
      return notifications.value.map(notification => ({
        ...notification,
        senderName: profiles.value[notification.senderId]?.username || 'Unknown User',
        senderPhoto: profiles.value[notification.senderId]?.photoURL || 'default-avatar.png'
      }));
    });

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
      notificationsWithProfiles,
      handleNotificationClick,
      truncateMessage,
      formatTime,
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
  text-align: left;
}

.sender-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 27px;
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