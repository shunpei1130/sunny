<template>
  <div class="top" @touchstart="handlePullTouchStart" @touchmove="handlePullTouchMove" @touchend="handlePullTouchEnd">
    <div class="pull-to-refresh" :style="{ transform: `translateY(${pullDistance - 50}px)` }">
      <div v-if="isRefreshing" class="loading-spinner"></div>
    </div>
    <HeaderView />
    <div class="content">
      <div class="existing-content">
        <b class="date">{{ currentDate }}</b>
        <div v-for="(category, index) in [category1, category2]" :key="category.name" class="category" :class="`category-${index + 1}`">
          <div class="category-title">#{{ index === 0 ? profile.hashtag1 : profile.hashtag2 || category.name }}</div>

          <div class="container" ref="categoryContainer" @touchstart="handleCarouselTouchStart" @touchmove="handleCarouselTouchMove" @touchend="(e) => handleCarouselTouchEnd(e, category, index + 1)">
            <div class="carousel" :style="{ transform: `rotateY(${category.currdeg}deg)` }">
              <div v-if="!category.items.length" class="item a empty-item" @click="() => addPhotoToCategory(category, index + 1)">
                <!-- Empty item content -->
                <div class="ui">
                  <div class="ui-inner">
                    <div class="component-child" />
                  </div>
                  <div class="div">
                    <div class="div1">まだ写真がアップロードされていません</div>
                  </div>
                  <div class="div2">
                    <div class="div1">
                      <p class="p">初めての写真をシェアして</p>
                      <p class="p">仲間と継続目標を達成しよう!!</p>
                    </div>
                  </div>
                  <div class="training">
                    <b class="training1">#{{ index === 0 ? profile.hashtag1 : profile.hashtag2 || category.name }}</b>
                  </div>
                  <div class="ui-child">
                    <img class="child-image" src="../assets/Component1.png" alt="Add a photo icon" />
                  </div>
                </div>
              </div>
              <div v-else v-for="(item, i) in getLatestItems(category.items, 6)" :key="item.id" class="item" :class="getItemClass(i)" @click="() => addPhotoToCategory(category, index + 1)">
                <img :src="item.imageUrl" alt="" class="category-image" />
                <span class="item-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="timeline-section">
        <div class="timeline">
          <div class="timeline-column">
            <TimelineItem v-for="item in leftColumnItems" :key="item.id" :imageUrl="item.imageUrl" :description="item.description" :timestamp="item.timestamp" :count="item.count" :username="item.username" />
          </div>
          <div class="timeline-column">
            <TimelineItem v-for="item in rightColumnItems" :key="item.id" :imageUrl="item.imageUrl" :description="item.description" :timestamp="item.timestamp" :count="item.count" :username="item.username" />
          </div>
        </div>
      </div>
    </div>

    <ChatRoomSelectDialog 
    v-if="showChatRoomDialog"
    :chatRooms="chatRooms"
    @select="handleChatRoomSelect"
    @close="showChatRoomDialog = false"
  />
    <FooterView />
  </div>
  
  <!-- 非表示のファイル入力要素 -->
  <input type="file" ref="fileInput" style="display: none;" accept="image/*">
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import HeaderView from './HeaderView.vue';
import FooterView from './FooterView.vue';
import TimelineItem from './TimelineItem.vue';
import ChatRoomSelectDialog from './ChatRoomSelectDialog.vue';

export default {
  name: 'HomeView',
  components: {
    HeaderView,
    FooterView,
    TimelineItem,
    ChatRoomSelectDialog
  },
  setup() {
    const store = useStore();
    const fileInput = ref(null);
    const profile = computed(() => store.state.profile);
    const category1 = computed(() => store.state.category1);
    const category2 = computed(() => store.state.category2);
    const timelineItems = computed(() => store.state.timelineItems);
    const currentDate = computed(() => new Date().toISOString().split('T')[0].replace(/-/g, '.'));




    const carouselTouchStart = ref({ x: 0, y: 0 });
    const isHorizontalScroll = ref(false);


    // プルトゥリフレッシュ用のタッチイベント
    const pullTouchStart = ref({ x: 0, y: 0 });
    const pullDistance = ref(0);
    const isPulling = ref(false);
    const isRefreshing = ref(false);
    const pullThreshold = 60;

    const chatRooms = ref([]);
    const selectedChatRoomId = ref(null);
    const showChatRoomDialog = ref(false);
    let resolveSelectPromise = null;

    onMounted(async() => {
      console.log('Profile fetched:', store.state.profile);
      console.log('store!!!:', JSON.parse(JSON.stringify(store.state)));
    });



    const rotateCarousel = (category, categoryNumber, direction) => {
      if (direction === 'left') {
        category.currdeg -= 60;
      } else {
        category.currdeg += 60;
      }
      store.dispatch('updateCategoryRotation', {
        categoryNumber,
        currdeg: category.currdeg
      });
    };


    const handleCarouselTouchStart = (event) => {
      carouselTouchStart.value.x = event.touches[0].clientX;
      carouselTouchStart.value.y = event.touches[0].clientY;
      isHorizontalScroll.value = false;
    };

    const handleCarouselTouchMove = (event) => {
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const diffX = carouselTouchStart.value.x - currentX;
      const diffY = carouselTouchStart.value.y - currentY;

      if (!isHorizontalScroll.value) {
        isHorizontalScroll.value = Math.abs(diffX) > Math.abs(diffY);
      }

      if (isHorizontalScroll.value) {
        event.preventDefault();
      }
    };

    const handleCarouselTouchEnd = (event, category, categoryNumber) => {
      if (!isHorizontalScroll.value) {
        return;
      }

      const endX = event.changedTouches[0].clientX;
      const diffX = carouselTouchStart.value.x - endX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          rotateCarousel(category, categoryNumber, 'left');
        } else {
          rotateCarousel(category, categoryNumber, 'right');
        }
      }
    };

    const handlePullTouchStart = (event) => {
      pullTouchStart.value.x = event.touches[0].clientX;
      pullTouchStart.value.y = event.touches[0].clientY;
      isPulling.value = window.scrollY === 0;
    };

    const handlePullTouchMove = (event) => {
      if (!isPulling.value) return;

      const currentY = event.touches[0].clientY;
      pullDistance.value = Math.max(0, Math.min((currentY - pullTouchStart.value.y) / 2, pullThreshold * 1.5));
    };

    const handlePullTouchEnd = async () => {
      if (isPulling.value) {
        if (pullDistance.value >= pullThreshold && !isRefreshing.value) {
          isRefreshing.value = true;
          await refresh();
        }
        pullDistance.value = 0;
        isPulling.value = false;
        isRefreshing.value = false;
      }
    };

    const refresh = async () => {
      try {
        await store.dispatch('fetchTimelineItems');
        console.log('App refreshed successfully');
      } catch (error) {
        console.error('Error refreshing app:', error);
      }
    };

    const getLatestItems = (items, count) => {
      return [...items].sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
    };

    const addPhotoToCategory = async (category, categoryNumber) => {
      if (fileInput.value) {
        fileInput.value.click();
        fileInput.value.onchange = async (event) => {
          const file = event.target.files[0];
          if (file) {
            const hashtag = categoryNumber === 1 ? profile.value.hashtag1 : profile.value.hashtag2;
            const description = `#${hashtag || `Category${categoryNumber}`}`;
            
            // 写真をアップロードし、URLを取得
            const imageUrl = await store.dispatch('uploadPhoto', { file, description });
            
            // チャットルーム一覧を取得し、選択ダイアログを表示
            const selectedChatRoom = await selectChatRoom();
            
            if (selectedChatRoom) {
              // 選択されたチャットルームに写真を追加
              await store.dispatch('addPhotoToChatRoom', { 
                chatRoomId: selectedChatRoom.id, 
                imageUrl, 
                description 
              });
            }
            
            // カテゴリーに写真を追加（既存の機能）
            await store.dispatch('addPhotoToCategory', { 
              categoryNumber, 
              file, 
              description 
            });
          }
        }
      }
    };

    const selectChatRoom = async () => {
      chatRooms.value = await store.dispatch('fetchChatRooms');
      console.log('Chat rooms in component:', chatRooms.value);
      showChatRoomDialog.value = true;
      
      return new Promise((resolve) => {
        resolveSelectPromise = resolve;
      });
    };

    const handleChatRoomSelect = (roomId) => {
      selectedChatRoomId.value = roomId;
      showChatRoomDialog.value = false;
      if (resolveSelectPromise) {
        resolveSelectPromise(chatRooms.value.find(room => room.id === roomId));
        resolveSelectPromise = null;
      }
    };

    

    const getItemClass = (index) => {
      const classes = ['a', 'b', 'c', 'd', 'e', 'f'];
      return classes[index % classes.length];
    };

    const leftColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 === 0));
    const rightColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 !== 0));

    return {
      profile,
      currentDate,
      category1,
      category2,
      leftColumnItems,
      rightColumnItems,
      fileInput,
      addPhotoToCategory,
      getItemClass,
      getLatestItems,
      pullDistance,
      handleChatRoomSelect,
      isRefreshing,
      chatRooms,
      selectedChatRoomId,
      showChatRoomDialog,
      handleCarouselTouchStart,
      handleCarouselTouchMove,
      handleCarouselTouchEnd,
      handlePullTouchStart,
      handlePullTouchMove,
      handlePullTouchEnd,
      onChatRoomSelect: (roomId) => onChatRoomSelect.value(roomId),
    };
  }
};
</script>



<style scoped>

.pull-to-refresh {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  pointer-events: none;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.child-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top {
  width: 100%;
  min-height: 100vh;
  background-color: #2f4f4f;
  color: rgba(255, 255, 255, 0.9);
  font-family: Commissioner, sans-serif;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 60px 0 80px;
}

.existing-content {
  position: relative;
  height: 700px;
}

.date {
  text-align: center;
  font-size: 12px;
  font-family: Inter, sans-serif;
}

.category {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.category-1 {
  top: 5%;
}

.category-2 {
  top: 50%; 
}

.category-title {
  font-size: 18.52px;
  line-height: 34.37px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  padding: 5%;
}

.container {
  margin: 0 auto;
  width: 130px;
  height: 213.9px;
  position: relative;
  perspective: 1500px;
}

.carousel {
  height: 100%;
  width: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.3s;
}

.item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: #d3d3d3;
  width: 138.7px;
  height: 173.4px;
  font-size: 3em;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  opacity: 0.95;
  border-radius: 17.06px;
  box-shadow: 0px 4.55px 4.55px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  cursor: pointer;
}

.empty-item {
  width: 227px;
  height: 213.9px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotateY(0deg) translateZ(180px) !important;
  overflow: visible;
}

.a { transform: rotateY(0deg) translateZ(180px); }
.b { transform: rotateY(60deg) translateZ(180px); }
.c { transform: rotateY(120deg) translateZ(180px); }
.d { transform: rotateY(180deg) translateZ(180px); }
.e { transform: rotateY(240deg) translateZ(180px); }
.f { transform: rotateY(300deg) translateZ(180px); }

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-count {
  position: absolute;
  font-size: 90px;
  font-weight: bold;
  font-family: Commissioner, sans-serif;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.component-child {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  left: 0%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 34.63px;
  background-color: #d3d3d3;
}

.ui-inner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.div1 {
  top: 0%;
  left: 0%;
  font-weight: 600;
}

.div {
  position: absolute;
  top: 50px;
  left: 30px;
  width: 166px;
  height: 14px;
  text-align: left;
}

.p {
  margin: 0;
  font-size: 9px;
}

.div2 {
  position: absolute;
  top: 79px;
  left: 29px;
  width: 169px;
  height: 36px;
  font-size: 12.27px;
  color: #686868;
}

.training {
  position: relative;
  width: 62px;
  height: 18px;
  font-size: 12.31px;
  color: #5c5c5c;
  top: 21.55px;
  left: 82.79px;
}

.training1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ui-child {
  position: absolute;
    bottom: 6px;
    left: 62px;
    width: 100px;
    height: 100px;
}

.add-a-photo-icon {
  position: absolute;
  bottom: 26px;
  left: 91px;
  width: 41px;
  height: 57px;
}

.ui {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: transparent;
  overflow: hidden;
  text-align: center;
  font-size: 9px;
  color: #898a8d;
  font-family: Poppins;
}

.timeline-section {
  padding: 20px;
}

.timeline {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.timeline-column {
  flex: 1;
  max-width: 48%;
}
</style>
