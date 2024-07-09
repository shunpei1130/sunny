<template>
  <div class="top">
    <HeaderView />
    <div class="content">
      <div class="existing-content">
        <b class="date">{{ currentDate }}</b>
        <div v-for="(category, index) in categories" :key="category.name" class="category" :class="`category-${index + 1}`">
          <div class="category-title">#{{ category.name }}</div>
          <div class="category-details">
            <div class="add-photo" @click="() => onAddPhotoClick(category.name)">
              <img class="add-a-photo-icon" alt="" src="add_a_photo.svg" />
              <div class="category-count">{{ category.count }}</div>
              <!-- 右下にSVGを追加 -->
              <svg @click.stop="showPhotoComponent" class="camera-icon"  width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.2123 9.71613H25.8562L23.3414 6.96776H15.0963V9.71613H22.1321L24.6469 12.4645H30.2123V28.9547H8.22541V16.587H5.47704V28.9547C5.47704 30.4663 6.71381 31.7031 8.22541 31.7031H30.2123C31.7239 31.7031 32.9607 30.4663 32.9607 28.9547V12.4645C32.9607 10.9529 31.7239 9.71613 30.2123 9.71613ZM12.348 20.7096C12.348 24.5023 15.4261 27.5805 19.2189 27.5805C23.0116 27.5805 26.0898 24.5023 26.0898 20.7096C26.0898 16.9168 23.0116 13.8387 19.2189 13.8387C15.4261 13.8387 12.348 16.9168 12.348 20.7096ZM19.2189 16.587C21.4863 16.587 23.3414 18.4422 23.3414 20.7096C23.3414 22.977 21.4863 24.8321 19.2189 24.8321C16.9515 24.8321 15.0963 22.977 15.0963 20.7096C15.0963 18.4422 16.9515 16.587 19.2189 16.587ZM8.22541 9.71613H12.348V6.96776H8.22541V2.84521H5.47704V6.96776H1.35449V9.71613H5.47704V13.8387H8.22541V9.71613Z" fill="white"/>
              </svg>

            </div>
          </div>
          <div class="category-items">
            <div v-for="(item, i) in getFilteredItems(category)" :key="item.id" class="category-item" :class="`item-${4 - i}`" :style="{ zIndex: 3 - i }">
              <span>{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="timeline-section">
        <div class="timeline">
          <div v-for="column in [leftColumnItems, rightColumnItems]" :key="column" class="timeline-column">
            <TimelineItem
              v-for="item in column"
              :key="item.id"
              :imageUrl="item.imageUrl"
              :description="item.description"
              :timestamp="item.timestamp"
            />
          </div>
        </div>
      </div>
    </div>
    <FooterView />
  </div>
</template>




<script>
import { ref, computed } from 'vue';
import HeaderView from './HeaderView.vue';
import FooterView from './FooterView.vue';
import TimelineItem from './TimelineItem.vue';

export default {
  name: 'HomeView',
  components: {
    HeaderView,
    FooterView,
    TimelineItem
  },
  setup() {
    const currentDate = ref(new Date().toISOString().split('T')[0].replace(/-/g, '.'));
    
    const categories = ref([
      { name: 'training', count: 0, items: [] },
      { name: 'book', count: 0, items: [] }
    ]);

    const timelineItems = ref([
      { id: 1, imageUrl: 'path/to/image1.jpg', description: 'First upload', timestamp: new Date('2024-06-15T10:00:00') },
    ]);

    const leftColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 === 0));
    const rightColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 !== 0));

    const getFilteredItems = (category) => {
      return category.items.slice(0, 4).map((item, i) => {
        const count = category.count - i - 1;
        return count > 0 ? { ...item, count } : null;
      }).filter(item => item !== null);
    };

    const onAddPhotoClick = (categoryName) => {
      const category = categories.value.find(cat => cat.name === categoryName);
      if (category) {
        category.count += 1;
        const newItem = {
          id: timelineItems.value.length + 1,
          imageUrl: 'path/to/new-image.jpg',
          description: `New upload for ${categoryName}`,
          timestamp: new Date()
        };
        timelineItems.value.unshift(newItem);
        category.items.unshift(newItem);
        if (category.items.length > 4) {
          category.items.pop(); // 最後のアイテムを削除
        }
      }
    };

    const showPhotoComponent = () => {
      console.log('Show photo component');
      // ここに写真を撮るためのコンポーネント表示処理を追加します。
    };

    return {
      currentDate,
      categories,
      leftColumnItems,
      rightColumnItems,
      getFilteredItems,
      onAddPhotoClick,
      showPhotoComponent
    };
  }
};
</script>




<style scoped>
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
  align-items: flex-start;
}

.category-1 {
  top: 5%;
  left: 10%;
}

.category-2 {
  top: 40%;
  left: 10%;
}

.category-title {
  font-size: 18.52px;
  letter-spacing: -0.32px;
  line-height: 34.37px;
  font-weight: 500;
  font-family: Inter, sans-serif;
}

.category-details {
  position: relative;
  display: flex;
  align-items: center;
}

.add-photo {
  position: relative;
  width: 138.7px;
  height: 173.4px;
  background-color: #d3d3d3;
  border-radius: 17.06px;
  box-shadow: 0px 4.55px 4.55px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
}

.add-a-photo-icon {
  width: 8.8%;
  height: 3.86%;
}

.category-count {
  padding-bottom: 15px;
  position: absolute;
  font-size: 90.98px;
  font-weight: 800;
  z-index: 5;
  color: rgba(255, 255, 255, 0.9);
  font-family: "Commissioner", sans-serif;
}

.camera-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 35px;
  height: 28px;
  cursor: pointer;
}

.category-items {
  display: flex;
  gap: 0px;
  margin-left: 140px;
  margin-top: -100px;
}

.category-item {
  width: 77.3px;
  height: 96.7px;
  background-color: #d3d3d3;
  border-radius: 9.51px;
  box-shadow: 0px 2.54px 2.54px rgba(0, 0, 0, 0.25);
  transform: rotate(10deg);
  display: flex;
  align-items: flex-end; /* 下部に寄せる */
  justify-content: flex-end; /* 右に寄せる */
  margin-left: -30px;
  z-index: 3;
  padding: 5px; /* 数値が右下に寄りすぎないように調整 */
  position: relative; /* 数値の位置を調整するために必要 */
}

.category-item span {
  transform: rotate(-10deg); /* 数値を元の角度に戻す */
  font-size: 28px; /* 数値の大きさを調整 */
  font-weight: 800;
  position: absolute; /* 数値を固定する */
  bottom: 5px; /* 数値を下に寄せる */
  right: 5px; /* 数値を右に寄せる */
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
