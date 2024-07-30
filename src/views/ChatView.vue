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
    <div v-if="isSearching" class="search-results">
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

    <!-- チャットリストと特定のチャットルーム情報 -->
    <div v-else>
      <!-- チャットリスト -->
      <div class="chat-list">
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

      <!-- 特定のチャットルーム情報 -->
      <div v-if="specificChatRoom && !isSearching" class="specific-chat-room">
    <div 
      v-for="participant in participants" 
      :key="participant.id" 
      class="participant"
      @click="openChatWithUser(participant.id)"
    >
      <img :src="participant.photo" :alt="participant.username" class="user-avatar">
      <div class="participant-info">
        <span class="username">{{ participant.username }}</span>
        <span class="last-message">{{ participant.lastMessage || 'メッセージがありません' }}</span>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>



<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getFirestore, collection, query, where, getDocs, addDoc, onSnapshot, orderBy, doc } from 'firebase/firestore';
import { auth } from '../firebase';

export default {
  name: 'ChatView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const searchQuery = ref('');
    const searchResults = ref([]);
    const chats = ref([]);
    const specificChatRoom = ref(null);
    const participants = ref([]);

    const isSearching = computed(() => searchQuery.value.length >= 1);

    const searchUsers = async () => {
      if (!isSearching.value) {
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
      
      const chatRoomsRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomsRef,
        where('participants', '==', [currentUser.uid, user.id].sort())
      );
      const querySnapshot = await getDocs(q);

      let chatRoomId;
      if (querySnapshot.empty) {
        const newChatRoom = await addDoc(chatRoomsRef, {
          participants: [currentUser.uid, user.id].sort(),
          createdAt: new Date(),
          lastMessageAt: new Date(),
          lastMessage: ''
        });
        chatRoomId = newChatRoom.id;
      } else {
        chatRoomId = querySnapshot.docs[0].id;
      }

      router.push(`/chat/${chatRoomId}`);
    };

    const openChat = (chat) => {
      router.push(`/chat/${chat.id}`);
    };

    const openChatWithUser = async (userId) => {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      
      const chatRoomsRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomsRef,
        where('participants', '==', [currentUser.uid, userId].sort())
      );
      const querySnapshot = await getDocs(q);

      let chatRoomId;
      if (querySnapshot.empty) {
        const newChatRoom = await addDoc(chatRoomsRef, {
          participants: [currentUser.uid, userId].sort(),
          createdAt: new Date(),
          lastMessageAt: new Date(),
          lastMessage: ''
        });
        chatRoomId = newChatRoom.id;
      } else {
        chatRoomId = querySnapshot.docs[0].id;
      }

      router.push(`/chat/${chatRoomId}`);
    };

    const fetchChatRooms = () => {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      const chatRoomsRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomsRef,
        where('participants', 'array-contains', currentUser.uid),
        orderBy('lastMessageAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatPromises = snapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
          
          const profilesRef = collection(db, 'profiles');
          const profileQuery = query(profilesRef, where('userId', '==', otherUserId));
          const profileSnapshot = await getDocs(profileQuery);
          
          let userData = { username: 'Unknown User', photo: '' };
          if (!profileSnapshot.empty) {
            userData = profileSnapshot.docs[0].data();
          }

          return {
            id: doc.id,
            username: userData.username,
            userPhoto: userData.photo,
            lastMessage: chatData.lastMessage || '',
            lastMessageAt: chatData.lastMessageAt ? chatData.lastMessageAt.toDate() : new Date(),
          };
        });

        chats.value = await Promise.all(chatPromises);
      });

      onUnmounted(() => unsubscribe());
    };

    const fetchSpecificChatRoom = () => {
  const db = getFirestore();
  const currentUser = auth.currentUser;
  const chatRoomRef = doc(db, 'chatRooms', 'ycV46bEag2YEUTDzKcSP');

  const unsubscribe = onSnapshot(chatRoomRef, async (chatRoomSnap) => {
    if (chatRoomSnap.exists()) {
      specificChatRoom.value = chatRoomSnap.data();
      
      const participantIds = specificChatRoom.value.participants.filter(id => id !== currentUser.uid);
      const profilesRef = collection(db, 'profiles');
      
      const participantPromises = participantIds.map(async (userId) => {
        const userQuery = query(profilesRef, where('userId', '==', userId));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          
          // 各参加者とのチャットルームを取得
          const chatRoomsRef = collection(db, 'chatRooms');
          const chatQuery = query(
            chatRoomsRef,
            where('participants', '==', [currentUser.uid, userId].sort())
          );
          const chatSnapshot = await getDocs(chatQuery);
          let lastMessage = '';
          if (!chatSnapshot.empty) {
            const chatData = chatSnapshot.docs[0].data();
            lastMessage = chatData.lastMessage || '';
          }
          
          return {
            id: userId,
            username: userData.username,
            photo: userData.photo,
            lastMessage: lastMessage
          };
        }
        return null;
      });

      participants.value = (await Promise.all(participantPromises)).filter(p => p !== null);
    } else {
      console.log("指定されたチャットルームが見つかりません");
    }
  });

  onUnmounted(() => unsubscribe());
};

    onMounted(() => {
      fetchChatRooms();
      fetchSpecificChatRoom();
    });

    const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

    return {
      searchQuery,
      searchResults,
      chats,
      specificChatRoom,
      participants,
      isSearching,
      searchUsers,
      startChat,
      openChat,
      openChatWithUser,
      formatTime,
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
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.user-item, .chat-item, .participant {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  margin-bottom: 15px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-item:hover, .chat-item:hover, .participant:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.chat-info, .participant-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 3px;
}

.last-message {
  color: #666;
  font-size: 0.9em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.specific-chat-room {
  margin-top: 20px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}
</style>