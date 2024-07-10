<template>
  <div class="top">
    <HeaderView />
    <div class="content">
      <div class="existing-content">
        <b class="date">{{ currentDate }}</b>
        <div v-for="(category, index) in categories" :key="category.name" class="category" :class="`category-${index + 1}`">
          <div class="category-title">#{{ profile.hashtag || category.name }}</div>
          <div class="container" ref="container" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
            <div class="carousel" :style="{ transform: `rotateY(${currdeg}deg)` }">
              <div class="item a" @click="() => onAddPhotoClick(category.name)">
                <div v-if="!category.items.length" class="add-photo">
                  <div class="category-count">{{ category.count }}</div>
                  <svg @click.stop="showPhotoComponent" class="camera-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.2123 9.71613H25.8562L23.3414 6.96776H15.0963V9.71613H22.1321L24.6469 12.4645H30.2123V28.9547H8.22541V16.587H5.47704V28.9547C5.47704 30.4663 6.71381 31.7031 8.22541 31.7031H30.2123C31.7239 31.7031 32.9607 30.4663 32.9607 28.9547V12.4645C32.9607 10.9529 31.7239 9.71613 30.2123 9.71613ZM12.348 20.7096C12.348 24.5023 15.4261 27.5805 19.2189 27.5805C23.0116 27.5805 26.0898 24.5023 26.0898 20.7096C26.0898 16.9168 23.0116 13.8387 19.2189 13.8387C15.4261 13.8387 12.348 16.9168 12.348 20.7096ZM19.2189 16.587C21.4863 16.587 23.3414 18.4422 23.3414 20.7096C23.3414 22.977 21.4863 24.8321 19.2189 24.8321C16.9515 24.8321 15.0963 22.977 15.0963 20.7096C15.0963 18.4422 16.9515 16.587 19.2189 16.587ZM8.22541 9.71613H12.348V6.96776H8.22541V2.84521H5.47704V6.96776H1.35449V9.71613H5.47704V13.8387H8.22541V9.71613Z" fill="white"/>
                  </svg>
                </div>
                <img v-else :src="category.items[0].imageUrl" alt="Category Photo" class="category-image" />
                <span v-if="category.items.length" class="item-count">{{ category.count }}</span>
              </div>
              <div v-for="(item, i) in getFilteredItems(category).slice(1, 6)" :key="item.id" 
                   class="item" :class="getItemClass(i + 1)">
                <img :src="item.imageUrl" alt="Item Photo" class="category-image" />
                <span class="item-count">{{ item.count }}</span>
              </div>
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
import { useStore } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    HeaderView,
    FooterView,
    TimelineItem
  },
  setup() {
    const store = useStore();
    const profile = computed(() => store.state.profile);
    const currentDate = ref(new Date().toISOString().split('T')[0].replace(/-/g, '.'));
    
    const categories = ref([
      { name: 'training', count: 0, items: [] },
      { name: 'book', count: 0, items: [] }
    ]);

    const timelineItems = ref([]);

    const leftColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 === 0));
    const rightColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 !== 0));

   

    const onAddPhotoClick = (categoryName) => {
      const category = categories.value.find(cat => cat.name === categoryName);
      if (category) {
        category.count += 1;
        const newItem = {
          id: timelineItems.value.length + 1,
          imageUrl: 'path/to/new-image.jpg',
          description: `New upload for ${categoryName}`,
          timestamp: new Date(),
          count: category.count
        };
        timelineItems.value.unshift(newItem);
        category.items.unshift(newItem);
        if (category.items.length > 6) {
          category.items.pop();
        }
      }
    };

    const getFilteredItems = (category) => {
      return category.items;
    };

    const showPhotoComponent = () => {
      console.log('Show photo component');
    };

    const currdeg = ref(0);
    const startX = ref(0);
    const container = ref(null);

    const touchStart = (event) => {
      startX.value = event.touches[0].clientX;
    };

    const touchMove = (event) => {
      event.preventDefault();
    };

    const touchEnd = (event) => {
      const endX = event.changedTouches[0].clientX;
      const diff = startX.value - endX;
      if (Math.abs(diff) > 50) { // 50pxのしきい値を設定
        if (diff > 0) {
          // 左スワイプ
          currdeg.value -= 60;
        } else {
          // 右スワイプ
          currdeg.value += 60;
        }
      }
    };

    const getItemClass = (index) => {
  const classes = ['a', 'b', 'c', 'd', 'e', 'f'];
  return classes[index];
};

    return {
      currentDate,
      categories,
      leftColumnItems,
      rightColumnItems,
      getFilteredItems,
      onAddPhotoClick,
      showPhotoComponent,
      profile,
      currdeg,
      container,
      touchStart,
      touchMove,
      touchEnd,
      getItemClass,
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
  align-items: center;
  width: 100%;
}

.category-1 {
  top: 5%;
}

.category-2 {
  top: 40%; 
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
  width: 138.7px;
  height: 173.4px;
  position: relative;
  perspective: 1500px; /* perspectiveを増やして3D効果を強調 */
}

.carousel {
  height: 100%;
  width: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.5s;
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

.add-photo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;
}


/* 回転半径を大きくし、各itemの角度を調整 */
.a { transform: rotateY(0deg) translateZ(180px); }
.b { transform: rotateY(60deg) translateZ(180px); }
.c { transform: rotateY(120deg) translateZ(180px); }
.d { transform: rotateY(180deg) translateZ(180px); }
.e { transform: rotateY(240deg) translateZ(180px); }
.f { transform: rotateY(300deg) translateZ(180px); }



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