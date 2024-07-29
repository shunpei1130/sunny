<template>
    <div class="chat-view">
      <h2>チャット</h2>
      
      <!-- 検索窓 -->
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @input="searchUsers" 
          placeholder="ユーザー名を検索..."
        >
      </div>
  
      <!-- 検索結果 -->
      <div v-if="searchResults.length > 0" class="search-results">
        <div 
          v-for="user in searchResults" 
          :key="user.id" 
          class="user-item"
          @click="startChat(user)"
        >
          <img :src="user.photo" :alt="user.username" class="user-avatar">
          <span>{{ user.username }}</span>
        </div>
      </div>
  
      <!-- チャットリスト -->
      <div v-else class="chat-list">
        <div 
          v-for="chat in chats" 
          :key="chat.id" 
          class="chat-item"
          @click="openChat(chat)"
        >
          <img :src="chat.userPhoto" :alt="chat.username" class="user-avatar">
          <div class="chat-info">
            <span class="username">{{ chat.username }}</span>
            <span class="last-message">{{ chat.lastMessage }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { getFirestore, collection, query, where, getDocs, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
  import { auth } from '../firebase';
  
  export default {
    name: 'ChatView',
    setup() {
      const store = useStore();
      const router = useRouter();
      const searchQuery = ref('');
      const searchResults = ref([]);
      const chats = ref([]);
  
      const searchUsers = async () => {
        if (searchQuery.value.length < 2) {
          searchResults.value = [];
          return;
        }
  
        const db = getFirestore();
        const followingUsers = store.state.following;
        const usersRef = collection(db, 'profiles');
        const q = query(
          usersRef, 
          where('username', '>=', searchQuery.value),
          where('username', '<=', searchQuery.value + '\uf8ff')
        );
  
        const querySnapshot = await getDocs(q);
        searchResults.value = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => followingUsers.includes(user.id));
      };
  
      const startChat = async (user) => {
        const db = getFirestore();
        const currentUser = auth.currentUser;
        
        // チャットルームが既に存在するか確認
        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(
          chatRoomsRef,
          where('participants', '==', [currentUser.uid, user.id].sort())
        );
        const querySnapshot = await getDocs(q);
  
        let chatRoomId;
        if (querySnapshot.empty) {
          // 新しいチャットルームを作成
          const newChatRoom = await addDoc(chatRoomsRef, {
            participants: [currentUser.uid, user.id].sort(),
            createdAt: new Date()
          });
          chatRoomId = newChatRoom.id;
        } else {
          chatRoomId = querySnapshot.docs[0].id;
        }
  
        // チャットルームに遷移
        router.push(`/chat/${chatRoomId}`);
      };
  
      const openChat = (chat) => {
        router.push(`/chat/${chat.id}`);
      };
  
      onMounted(async () => {
        const db = getFirestore();
        const currentUser = auth.currentUser;
        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(
          chatRoomsRef,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('lastMessageAt', 'desc')
        );
  
        onSnapshot(q, (snapshot) => {
          chats.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        });
      });
  
      return {
        searchQuery,
        searchResults,
        chats,
        searchUsers,
        startChat,
        openChat,
      };
    }
  }
  </script>
  
  
  <style scoped>
  .chat-view {
    padding: 20px;
  }
  
  .search-bar {
    margin-bottom: 20px;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .user-item, .chat-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
  }
  
  .user-item:hover, .chat-item:hover {
    background-color: #f5f5f5;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .chat-info {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-weight: bold;
  }
  
  .last-message {
    color: #666;
    font-size: 0.9em;
  }
  </style>