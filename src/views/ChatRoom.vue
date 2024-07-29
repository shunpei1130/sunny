<template>
    <div class="chat-room">
      <h2>{{ otherUser.username }}</h2>
      <div class="messages" ref="messagesContainer">
        <div v-for="message in messages" :key="message.id" :class="['message', { 'own-message': message.senderId === currentUser.uid }]">
          <div class="message-content">{{ message.content }}</div>
          <div class="message-time">{{ formatTime(message.createdAt) }}</div>
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
  import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
  import { auth } from '../firebase';
  
  export default {
    name: 'ChatRoom',
    setup() {
      const route = useRoute();
      const db = getFirestore();
      const messages = ref([]);
      const newMessage = ref('');
      const currentUser = auth.currentUser;
      const otherUser = ref({});
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
        const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
        const chatRoomSnap = await getDoc(chatRoomRef);
        if (chatRoomSnap.exists()) {
          const participants = chatRoomSnap.data().participants;
          const otherUserId = participants.find(id => id !== currentUser.uid);
          const userRef = doc(db, 'profiles', otherUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            otherUser.value = { id: userSnap.id, ...userSnap.data() };
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
        messagesContainer
      };
    }
  }
  </script>
  
  <style scoped>
  .chat-room {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .message {
    margin-bottom: 10px;
    max-width: 70%;
  }
  
  .own-message {
    align-self: flex-end;
    background-color: #DCF8C6;
  }
  
  .message-content {
    padding: 10px;
    border-radius: 10px;
    background-color: #F1F0F0;
  }
  
  .message-time {
    font-size: 0.8em;
    color: #888;
    text-align: right;
  }
  
  .message-input {
    display: flex;
    padding: 10px;
  }
  
  .message-input input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
  }
  
  .message-input button {
    margin-left: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  </style>