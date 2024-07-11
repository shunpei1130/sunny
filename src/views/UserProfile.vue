// UserProfile.vue
<template>
  <HeaderView />
  <div class="profile-view">
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

    <!-- プロフィールを編集するボタン -->
    <button class="edit-profile" @click="goToEditProfile()">プロフィールを編集する</button>

    <!-- フォロー・フォロワー -->
    <div class="follow-info">
      <div class="follow" @click="goToHome()">
        <div class="follow-count">0</div>
        <div class="follow-text">follow</div>
      </div>
      <div class="follower" @click="goToHome()">
        <div class="follower-count">0</div>
        <div class="follower-text">follower</div>
      </div>
    </div>

     <!-- 画像コンテンツセット1 -->
     <div class="content-set">
      <div class="hashtags">
        <div class="hashtag">#{{ profile.hashtag }}</div>
      </div>
      <div class="content">
        <template v-if="profilePhotos && profilePhotos.length">
          <div v-for="photo in profilePhotos" :key="photo.id" class="content-box">
            <img :src="photo.imageUrl" :alt="photo.description" class="content-image" />
            <div class="content-count">{{ photo.count }}</div>
          </div>
          <div v-for="i in (3 - profilePhotos.length)" :key="i" class="content-box">+</div>
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
      <div class="hashtag">#{{ profile.hashtag }}</div>
    </div>
    <div class="content">
      <template v-if="secondContentPhotos && secondContentPhotos.length">
        <div v-for="photo in secondContentPhotos" :key="photo.id" class="content-box">
          <img :src="photo.imageUrl" :alt="photo.description" class="content-image" />
          <div class="content-count">{{ photo.count }}</div>
        </div>
        <div v-for="i in (3 - secondContentPhotos.length)" :key="i" class="content-box">+</div>
      </template>
      <template v-else>
        <div class="content-box">0</div>
        <div class="content-box">+</div>
        <div class="content-box">+</div>
      </template>
    </div>
  </div>


  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import HeaderView from './HeaderView.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    HeaderView
  },
  name: 'UserProfile',
  setup() {
    const store = useStore();
    const router = useRouter();
    const profile = computed(() => store.state.profile);
    const profilePhotos = computed(() => store.state.profilePhotos || []);
    const secondContentPhotos = computed(() => store.state.secondContentPhotos || []); // 追加

    const goToHome = () => {
      router.push('/');
    };

    const goToEditProfile = () => {
      router.push('/EditProfile');
    };

    return {
      profile,
      profilePhotos,
      secondContentPhotos, // 追加
      goToHome,
      goToEditProfile
    };
  },
  data() {
    return {
      startX: 0,
      endX: 0
    };
  },
  methods: {
    startTouch(event) {
      this.startX = event.touches[0].clientX;
    },
    moveTouch(event) {
      this.endX = event.touches[0].clientX;
      if (this.startX - this.endX > 50) {
        this.goToHome();
      }
    }
  }
};
</script>


<style scoped>

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
  width: 22%;
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
  text-align: left;
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
}

.content-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 24px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
