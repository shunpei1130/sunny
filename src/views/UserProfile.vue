<template>
  <HeaderView />
  <div class="profile-view">
    <!-- プロフィール画像 -->
    <div class="profile-image">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="32" fill="#D9D9D9"/>
      </svg>
    </div>

    <!-- ユーザーネーム -->
    <div class="username">seika_tamukai</div>

    <!-- 自己紹介 -->
    <div class="description">nutsモデルの田向星華です。</div>

    <!-- プロフィールを編集するボタン -->
    <button class="edit-profile" @click="goToEditProfile()">プロフィールを編集する</button>

    <!-- フォロー・フォロワー -->
    <div class="follow-info">
      <div class="follow" @click="goToHome()">
        <div class="follow-count">79</div>
        <div class="follow-text">follow</div>
      </div>
      <div class="follower" @click="goToHome()">
        <div class="follower-count">25k</div>
        <div class="follower-text">follower</div>
      </div>
    </div>

    <!-- 画像コンテンツセット1 -->
    <div class="content-set">
      <!-- ハッシュタグ -->
      <div class="hashtags">
        <div class="hashtag">#training</div>
      </div>
      <div class="content">
        <div class="content-box">80</div>
        <div class="content-box">+</div>
        <div class="content-box">+</div>
      </div>
    </div>

    <!-- 画像コンテンツ追加セット2 -->
    <div class="content-set">
      <!-- ハッシュタグ -->
      <div class="hashtags">
        <div class="hashtag">#training</div>
      </div>
      <div class="content">
        <div class="content-box">80</div>
        <div class="content-box">+</div>
        <div class="content-box">+</div>
      </div>
    </div>

    <!-- 画像コンテンツ追加セット3 -->
    <div class="content-set">
      <!-- ハッシュタグ -->
      <div class="hashtags">
        <div class="hashtag">#training</div>
      </div>
      <div class="content">
        <div class="content-box">80</div>
        <div class="content-box">+</div>
        <div class="content-box">+</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HeaderView from './HeaderView.vue';

export default {
  components: {
    HeaderView
  },
  name: 'UserProfile',
  data() {
    return {
      startX: 0,
      endX: 0
    }
  },
  computed: {
    ...mapGetters(['getUsername']),
    username() {
      return this.getUsername;
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/');
    },
    goToEditProfile() {
      this.$router.push('/EditProfile');
    },
    startTouch(event) {
      this.startX = event.touches[0].clientX;
    },
    moveTouch(event) {
      this.endX = event.touches[0].clientX;
      if (this.startX - this.endX > 50) {
        // スワイプが左から右へ50px以上移動した場合
        this.goToHome();
      }
    }
  }
}
</script>

<style scoped>
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
  margin-top: 3px;
}
.description {
  color: #FFF;
  text-align: center;
  font-family: Inter;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 10px;
  letter-spacing: -0.291px;
  margin-top: 5px;
}
.edit-profile {
  width: 96.545px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #ECECEC;
  margin-top: 20px;
  color: #000;
  text-align: center;
  font-family: Chenla;
  font-size: 6.191px;
  font-style: normal;
  font-weight: 400;
  line-height: 11.49px;
  letter-spacing: -0.105px;
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
.content {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 3px;
  gap: 5px;
}
.content-box {
  width: 130px;
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
}
</style>
