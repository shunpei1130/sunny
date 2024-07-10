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
              <div v-if="!category.items.length" class="item a empty-item" @click="() => onAddPhotoClick(category.name)">
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
                    <b class="training1">#{{ category.name }}</b>
                  </div>
                  <img class="ui-child" alt="" src="Ellipse 1365.svg" />
                  <img class="add-a-photo-icon" alt="" src="add_a_photo.svg" />
                </div>
              </div>
              <div v-else v-for="(item, i) in getFilteredItems(category)" :key="item.id" 
                   class="item" :class="getItemClass(i)" @click="() => onAddPhotoClick(category.name)">
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
  width: 130px;  /* empty-itemの幅に合わせて調整 */
  height: 213.9px;  /* empty-itemの高さに合わせて調整 */
  position: relative;
  perspective: 1500px;
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

.empty-item {
  width: 227px;
  height: 213.9px;
  position: relative;
  overflow: visible;
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
  width: 100%;
  height: 100%;
}

.div1 {
  position: absolute;
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

.training1 {
  position: absolute;
  top: 0%;
  left: 0%;
}

.training {
  position: absolute;
  top: 21.55px;
  left: 82.79px;
  width: 62px;
  height: 18px;
  font-size: 12.31px;
  color: #5c5c5c;
}

.ui-child {
  position: absolute;
  bottom: 13px;
  left: 79px;
  width: 70px;
  height: 70px;
}

.add-a-photo-icon {
  position: absolute;
  bottom: 26px;
  left: 91px;
  width: 41px;
  height: 41px;
}

.ui {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: transparent;
  overflow: hidden;
  text-align: center;
  font-size: 9.23px;
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