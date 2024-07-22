<template>
  <HeaderView />
  <div class="div">
    <div class="search-container" @click="focusInput">
      <input 
        ref="searchInput"
        v-model="searchQuery" 
        @keyup.enter="performSearch"
        @focus="onInputFocus"
        @blur="onInputBlur"
        type="text" 
        class="search-input" 
        placeholder="検索..."
      >
      <svg 
        @click.stop="performSearch"
        class="search-icon" 
        width="28" 
        height="28" 
        viewBox="0 0 28 28" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.4914 16.8347H17.5954L17.2779 16.5285C18.6388 14.9407 19.3419 12.7746 18.9564 10.4724C18.4233 7.31959 15.7922 4.80189 12.6168 4.4163C7.81952 3.82657 3.78214 7.86396 4.37187 12.6612C4.75746 15.8367 7.27516 18.4678 10.4279 19.0008C12.7302 19.3864 14.8963 18.6832 16.484 17.3223L16.7902 17.6399V18.5358L21.6101 23.3557C22.0751 23.8207 22.835 23.8207 23.2999 23.3557C23.7649 22.8907 23.7649 22.1309 23.2999 21.6659L18.4914 16.8347ZM11.6868 16.8347C8.86289 16.8347 6.58336 14.5551 6.58336 11.7312C6.58336 8.90733 8.86289 6.62779 11.6868 6.62779C14.5107 6.62779 16.7902 8.90733 16.7902 11.7312C16.7902 14.5551 14.5107 16.8347 11.6868 16.8347Z" fill="black"/>
      </svg>
    </div>
    <div v-if="results.length > 0" class="results">
      <div v-for="user in results" :key="user.userId" class="result-item">
        <img :src="user.photo" alt="プロフィール写真" class="profile-photo"/>
        <div class="user-info">
          <div class="username">{{ user.username }}</div>
          <div class="bio">{{ user.bio }}</div>
        </div>
      </div>
    </div>
    <div v-else-if="searchQuery" class="no-results">
      一致するユーザーが見つかりませんでした。
    </div>
  </div>
</template>


<script>
import HeaderView from './HeaderView.vue';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  components: {
    HeaderView,
  },
  name: 'SearchView',
  data() {
    return {
      searchQuery: '',
      isFocused: false,
      results: [] // 検索結果を保存する配列
    }
  },
  methods: {
  async performSearch() {
    console.log('Searching for:', this.searchQuery);
    if (this.searchQuery.trim() === '') {
      this.results = [];
      return;
    }
    try {
      const db = getFirestore();
      const profilesCollection = collection(db, 'profiles'); // 'profiles'コレクションから検索
      const q = query(profilesCollection, where('username', '==', this.searchQuery));
      const querySnapshot = await getDocs(q);
      this.results = querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error searching users:', error);
      this.results = [];
    }
  }
},
}
</script>

<style scoped>
.div {
  width: 100%;
  position: relative;
  background-color: #fff;
  height: 100vh;
  overflow: hidden;
}

.search-container {
  position: fixed;
  bottom: 0px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #c8c8c8;
  z-index: 10;
}

.search-input {
  flex: 1;
  height: 40px;
  border: 1px solid #c8c8c8;
  border-radius: 20px;
  padding: 0 20px;
  font-size: 16px;
  outline: none;
}

.search-icon {
  margin-left: 10px;
  cursor: pointer;
}

.results {
  padding: 20px;
  padding-bottom: 70px; /* search-containerの高さ分の余白を追加 */
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.profile-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.bio {
  color: #666;
}

.no-results {
  padding: 20px;
  color: #888;
}

/* タッチデバイスでの操作性を向上させるためのスタイル */
@media (hover: none) and (pointer: coarse) {
  .search-container {
    cursor: pointer;
  }

  .search-input {
    cursor: text;
  }

  .search-icon {
    padding: 10px; /* タップ領域を広げる */
  }
}
</style>
