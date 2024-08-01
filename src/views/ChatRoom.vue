<template>
  <div class="chat-room">
    <div class="chat-header">
    <button class="back-button" @click="goBack">＜</button>
    <h2>{{ otherUser.username }}</h2>
  </div>
    <div class="messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" :class="['message', message.senderId === currentUser.uid ? 'own-message' : 'other-message']">
        <div class="message-wrapper">
          <div v-if="message.senderId !== currentUser.uid" class="user-info">
            <img :src="otherUserPhoto" alt="User Icon" class="user-icon">
          </div>
          <div class="message-content-wrapper">
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ formatTime(message.createdAt) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="message-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="メッセージを入力...">
      <button @click="sendMessage">送信</button>
    </div>
  </div>
</template>

  
  <script>
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { useRoute } from 'vue-router';
  import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc,updateDoc } from 'firebase/firestore';
  import { auth } from '../firebase';
  
  export default {
    name: 'ChatRoom',
    methods: {
    // ... 既存のメソッド ...
    goBack() {
      // ここに戻る機能を実装
      this.$router.go(-1);
    }
  },
    setup() {
      const route = useRoute();
      const db = getFirestore();
      const messages = ref([]);
      const newMessage = ref('');
      const currentUser = auth.currentUser;
      const otherUser = ref({});
      const otherUserPhoto = ref('');
      const messagesContainer = ref(null);
  
      const chatRoomId = route.params.id;
  
      const loadMessages = () => {
        const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
        const q = query(messagesRef, orderBy('createdAt'));
  
        onSnapshot(q, (snapshot) => {
          messages.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        });
      };
  
      const sendMessage = async () => {
  if (newMessage.value.trim() === '') return;

  const db = getFirestore();
  
  try {
    // メッセージの送信
    const messagesRef = collection(db, 'chatRooms', chatRoomId, 'messages');
    await addDoc(messagesRef, {
      content: newMessage.value,
      senderId: currentUser.uid,
      createdAt: new Date()
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    return;
  }

  try {
    // チャットルームの最後のメッセージを更新
    await updateDoc(doc(db, 'chatRooms', chatRoomId), {
      lastMessage: newMessage.value,
      lastMessageTime: new Date()
    });
    console.log('Chat room last message updated');
  } catch (error) {
    console.error('Error updating chat room:', error);
  }

  try {
    // 通知の作成
    const notificationsRef = collection(db, 'notifications');
    const notificationData = {
      recipientId: otherUser.value.id,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderPhoto: currentUser.photoURL,
      message: newMessage.value,
      chatRoomId: chatRoomId,
      timestamp: new Date(),
      read: false
    };
    console.log('Attempting to create notification with data:', notificationData);
    const notificationDoc = await addDoc(notificationsRef, notificationData);
    console.log('Notification created successfully with ID:', notificationDoc.id);
  } catch (error) {
    console.error('Error creating notification:', error);
  }

  newMessage.value = '';
};
  
      const formatTime = (date) => {
        return new Date(date.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      };
  
      onMounted(async () => {
        loadMessages();
  
        // 相手のユーザー情報を取得
        // 相手のユーザー情報を取得
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
      const chatRoomSnap = await getDoc(chatRoomRef);
      if (chatRoomSnap.exists()) {
        const participants = chatRoomSnap.data().participants;
        const otherUserId = participants.find(id => id !== currentUser.uid);
        const userRef = doc(db, 'profiles', otherUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          otherUser.value = { id: userSnap.id, ...userSnap.data() };
          otherUserPhoto.value = userSnap.data().photo || userSnap.data().photoURL;
        }
      }
    });
  
      watch(messages, () => {
        nextTick(() => {
          if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
          }
        });
      }, { deep: true });
  
      return {
        messages,
        newMessage,
        sendMessage,
        formatTime,
        currentUser,
        otherUser,
        messagesContainer,
        otherUserPhoto
      };
    }
  }
  </script>
  


  <style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}
  
  .chat-header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 10px 0 0;
  color: #333;
}

h2 {
  margin: 0;
  flex-grow: 1;
  text-align: center;
}
  
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  
  .message {
    margin-bottom: 15px;
    max-width: 70%;
  }
  
  .message-wrapper {
    display: flex;
  }
  
  .own-message {
    align-self: flex-end;
  }
  
  .other-message {
    align-self: flex-start;
  }
  
  .user-info {
    margin-right: 10px;
  }
  
  .user-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .message-content-wrapper {
    display: flex;
    flex-direction: column;
    max-width: 100%;
  }
  
  .username {
    font-size: 0.8em;
    margin-bottom: 5px;
    color: #888;
  }
  
  .message-content {
    padding: 10px 15px;
    border-radius: 18px;
    word-wrap: break-word;
    max-width: 100%;
  }
  
  .own-message .message-content {
    background-color: #DCF8C6;
    margin-left: auto;
    border-radius: 18px;
  }
  
  .other-message .message-content {
  position: relative;
  background-color: #dfd9d9;
  margin-right: auto;
  margin-left: 15px; /* 左側にスペースを追加 */
}

.other-message .message-content::before {
  content: "";
  position: absolute;
  left: -9px; /* 左側に移動 */
  top: 15px; /* 上部に移動 */
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-right-color: #dfd9d9;
  border-left: 0;
  border-top: 0; /* 上部を平らにする */
}
  
  .message-time {
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
  }
  
  .own-message .message-time {
    text-align: right;
  }
  
  .message-input {
    display: flex;
    margin: 20px;
  }
  
  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    margin-right: 10px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>