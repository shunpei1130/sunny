<template>
  <HeaderView />
  <div class="profile-view" v-if="profile">
    <!-- プロフィール画像 -->
    <div class="profile-image">
      <img v-if="profile.photo" :src="profile.photo" alt="プロフィール写真" class="photo-circle"/>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="32" fill="#D9D9D9"/>
      </svg>
    </div>

    <!-- ユーザーネーム -->
    <div class="username">{{ profile.username }}</div>

    <!-- 自己紹介 -->
    <div class="description">{{ profile.bio }}</div>

    <!-- プロフィールを編集するボタン（自分のプロフィールの場合のみ表示） -->
    <button v-if="isCurrentUser" class="edit-profile" @click="goToEditProfile()">プロフィールを編集する</button>

    <!-- フォロー/アンフォローボタン（他人のプロフィールの場合のみ表示） -->
    <button v-if="!isCurrentUser" @click="toggleFollow" class="follow-button">
      {{ isFollowing ? 'フォロー解除' : 'フォローする' }}
    </button>

    <!-- フォロー・フォロワー -->
  <div class="follow-info">
    <div class="follow" @click="openFollowModal('following')">
      <div class="follow-count">{{ followingCount }}</div>
      <div class="follow-text">フォロー中</div>
    </div>
    <div class="follower" @click="openFollowModal('followers')">
      <div class="follower-count">{{ followersCount }}</div>
      <div class="follower-text">フォロワー</div>
    </div>
  </div>

    <!-- 画像コンテンツセット1 -->
    <div class="content-set">
      <div class="hashtags">
        <div class="hashtag">#{{ profile.hashtag1 }}</div>
      </div>
      <div class="content">
        <template v-if="filteredCategory1Items && filteredCategory1Items.length">
          <div v-for="item in filteredCategory1Items" :key="item.id" class="content-box">
            <img :src="item.imageUrl" class="content-image" />
            <div class="content-count">{{ item.count }}</div>
          </div>
          <!-- 空きスロットの数を計算して表示 -->
          <div v-for="i in emptySlots1" :key="'empty-' + i" class="content-box">+</div>
        </template>
        <template v-else>
          <div class="content-box">0</div>
          <div class="content-box">+</div>
          <div class="content-box">+</div>
        </template>
      </div>
    </div>

    <!-- 画像コンテンツ追加セット2 -->
    <div class="content-set">
      <div class="hashtags">
        <div class="hashtag">#{{ profile.hashtag2 }}</div>
      </div>
      <div class="content">
        <template v-if="filteredCategory2Items && filteredCategory2Items.length">
          <div v-for="item in filteredCategory2Items" :key="item.id" class="content-box">
            <img :src="item.imageUrl" class="content-image" />
            <div class="content-count">{{ item.count }}</div>
          </div>
          <div v-for="i in emptySlots2" :key="'empty2-' + i" class="content-box">+</div>
        </template>
        <template v-else>
          <div class="content-box">0</div>
          <div class="content-box">+</div>
          <div class="content-box">+</div>
        </template>
      </div>
    </div>
  </div>

  <!-- 統合されたフォローリストモーダル -->
  <FollowListModal
    :show="showFollowModal"
    :following="followingUsers"
    :followers="followerUsers"
    @close="closeFollowModal"
  />
</template>



<script>
import { ref, computed, onMounted, watch } from 'vue';
import HeaderView from './HeaderView.vue';
import { useRouter, useRoute } from 'vue-router';
import { doc, getDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase';
import { useStore } from 'vuex';
import { onAuthStateChanged } from 'firebase/auth';
import FollowListModal from './FollowListModal.vue';

export default {
  components: {
    HeaderView,
    FollowListModal
  },
  name: 'UserProfile',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const profile = ref(null);
    const category1 = ref({ items: [] });
    const category2 = ref({ items: [] });
    const userId = ref(null);
    const isCurrentUser = computed(() => userId.value === auth.currentUser?.uid);

    const isFollowing = computed(() => store.state.following.includes(userId.value));
    const followingCount = ref(0);
    const followersCount = ref(0);

    const fetchUserData = async (uid) => {
  try {
    const db = getFirestore();
    
    // プロファイル情報の取得
    const profileRef = doc(db, 'profiles', uid);
    const profileSnap = await getDoc(profileRef);
    
    if (profileSnap.exists()) {
      profile.value = profileSnap.data();
      console.log("Profile data:", profile.value);
    } else {
      console.log("No profile found for this user");
      profile.value = null; // プロファイルが存在しない場合は null をセット
    }

    // カテゴリー1のアイテムを取得
    const category1Ref = collection(db, 'profiles', uid, 'category1');
    const category1Snap = await getDocs(category1Ref);
    category1.value.items = category1Snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Category 1 items:", category1.value.items);

    // カテゴリー2のアイテムを取得
    const category2Ref = collection(db, 'profiles', uid, 'category2');
    const category2Snap = await getDocs(category2Ref);
    category2.value.items = category2Snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log("Category 2 items:", category2.value.items);

    // フォロー/フォロワー情報の取得
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      followingCount.value = userData.following.length || 0; 
      followersCount.value = userData.followers.length || 0;
      // 自分自身を除外するため、-1 しています
      console.log("Follow data:", { following: followingCount.value, followers: followersCount.value });
    } else {
      console.log("No user document found for follow data");
      followingCount.value = 0;
      followersCount.value = 0;
    }

  } catch (error) {
    console.error("Error fetching user data:", error);
    if (error.code === 'permission-denied') {
      console.error("Permission denied. Check security rules.");
    }
    // エラーが発生した場合、各値をリセットまたはデフォルト値を設定
    profile.value = null;
    category1.value.items = [];
    category2.value.items = [];
    followingCount.value = 0;
    followersCount.value = 0;
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = route.params.userId || user.uid;
      fetchUserData(userId.value);
      store.dispatch('fetchFollowData');
    } else {
      console.log('User is not authenticated');
      router.push('/login');
    }
  });
});

watch(() => route.params.userId, (newUserId) => {
  userId.value = newUserId || auth.currentUser?.uid;
  fetchUserData(userId.value);
});

    const toggleFollow = async () => {
  if (!auth.currentUser) {
    console.error('User not authenticated');
    // ここでログインページにリダイレクトするなどの処理を追加
    return;
  }

  try {
    if (isFollowing.value) {
      await store.dispatch('unfollowUser', userId.value);
    } else {
      await store.dispatch('followUser', userId.value);
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
  }
};
    const maxItems = 3;
    const filteredCategory1Items = computed(() => {
      return getLatestItems(category1.value.items, maxItems);
    });
    const filteredCategory2Items = computed(() => {
      return getLatestItems(category2.value.items, maxItems);
    });

    const getLatestItems = (items, count) => {
      return [...items].sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
    };

    const emptySlots1 = computed(() => Math.max(maxItems - filteredCategory1Items.value.length, 0));
    const emptySlots2 = computed(() => Math.max(maxItems - filteredCategory2Items.value.length, 0));

    const goToHome = () => {
      router.push('/');
    };

    const goToEditProfile = () => {
      router.push('/EditProfile');
    };

    const showFollowModal = ref(false);
    const followingUsers = ref([]);
    const followerUsers = ref([]);

    const fetchFollowUsers = async (userIds) => {
      const db = getFirestore();
      const users = [];
      for (const userId of userIds) {
        const userRef = doc(db, 'profiles', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          users.push({ id: userId, ...userSnap.data() });
        }
      }
      return users;
    };

    const openFollowModal = async () => {
      const userRef = doc(getFirestore(), 'users', userId.value);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        followingUsers.value = await fetchFollowUsers(userData.following || []);
        followerUsers.value = await fetchFollowUsers(userData.followers || []);
        showFollowModal.value = true;
      }
    };

    const closeFollowModal = () => {
      showFollowModal.value = false;
    };

    return {
      profile,
      category1,
      category2,
      goToHome,
      goToEditProfile,
      filteredCategory1Items,
      filteredCategory2Items,
      emptySlots1,
      emptySlots2,
      isCurrentUser,
      isFollowing,
      toggleFollow,
      followingCount,
      followersCount,
      showFollowModal,
      followingUsers,
      followerUsers,
      openFollowModal,
      closeFollowModal,
      userId,
    };
  }
};
</script>





<style scoped>

.follow-info {
  cursor: pointer;
}

.follow, .follower {
  transition: background-color 0.3s;
}

.follow:hover, .follower:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.follow-button{
  width: 96.545px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #ECECEC;
  margin-top: 5px;
  color: #000;
  text-align: center;
  font-family: Chenla;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
}

.photo-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  max-width: 96px;  /* 追加 */
  max-height: 96px;  /* 追加 */
}

.profile-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #2F4F4F;
  min-height: 100vh;
}
.profile-image {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  margin-top: 40px;
}
.username {
  color: #FFF;
  text-align: right;
  font-family: Inter;
  font-size: 12.992px;
  font-style: normal;
  font-weight: 400;
  line-height: 13px;
  letter-spacing: -0.291px;
  margin-top: 10px;
}
.description {
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px;
  margin-top: 5px;
}
.edit-profile {
  width: 96.545px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #ECECEC;
  margin-top: 5px;
  color: #000;
  text-align: center;
  font-family: Chenla;
  font-size: 6.191px;
  font-style: normal;
  font-weight: 400;
  line-height: 11.49px;
}
.follow-info {
  display: flex;
  justify-content: space-between;
  width: 30%;
  margin-top: 5px;
}
.follow, .follower {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.follow-count, .follower-count {
  color: #FFF;
  font-family: Commissioner;
  font-size: 19.725px;
  font-style: normal;
  font-weight: 800;
  line-height: 1.2px;
  margin-top: 15px;
}
.follow-text, .follower-text {
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 8.436px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2px;
  letter-spacing: -0.351px;
  margin-top: 15px;
}
.hashtags {
  margin-top: 30px;
  text-align: center;
  width: 100%;
}
.hashtag {
  color: #FFF;
  font-family: Inter;
  font-size: 10.66px;
  font-style: normal;
  font-weight: 400;
  line-height: 10.66px;
  letter-spacing: -0.239px;
  margin-left: 0px;
}
.content-set {
  width: 100%;
}

.content {
  display: flex;
  justify-content: center;
  gap: 5px;
  width: 100%;
  margin-top: 3px;
}

.content-box {
  width: 120px;
  height: 162.5px;
  flex-shrink: 0;
  border-radius: 14.718px;
  background: #D3D3D3;
  color: rgba(255, 255, 255, 0.90);
  text-align: center;
  font-family: Commissioner;
  font-size: 60.39px;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.content-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}

.content-count {
  position: relative;
  font-size: 90px;
  font-family: Commissioner, sans-serif;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 2;
}
</style>
