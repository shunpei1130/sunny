<template>
  <div class="top">
    <HeaderView />
    <div class="content">
      <div class="existing-content">
        <b class="date">{{ currentDate }}</b>
        <div v-for="(category, index) in [category1, category2]" :key="category.name" class="category" :class="`category-${index + 1}`">
          <div class="category-title">#{{ profile.hashtag || category.name }}</div>
          <div class="container" ref="categoryContainer" @touchstart="touchStart" @touchmove="touchMove" @touchend="(e) => touchEnd(e, category, index + 1)">
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
                    <b class="training1">#{{ profile.hashtag || category.name }}</b>
                  </div>
                  <svg class="ui-child" width="106" height="105" viewBox="0 0 106 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_4102_952)">
                      <circle cx="53" cy="47" r="47" fill="#008080"/>
                    </g>
                    <defs>
                      <filter id="filter0_d_4102_952" x="0.628572" y="0" width="104.743" height="104.743" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="5.37143"/>
                        <feGaussianBlur stdDeviation="2.68571"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4102_952"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4102_952" result="shape"/>
                      </filter>
                    </defs>
                  </svg>
                  <svg class="add-a-photo-icon" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.14337 19.9566C8.14337 21.2183 9.17569 22.2506 10.4374 22.2506C11.6991 22.2506 12.7315 21.2183 12.7315 19.9566V15.3685H17.3196C18.5813 15.3685 19.6136 14.3361 19.6136 13.0744C19.6136 11.8127 18.5813 10.7804 17.3196 10.7804H12.7315V6.19227C12.7315 4.93055 11.6991 3.89822 10.4374 3.89822C9.17569 3.89822 8.14337 4.93055 8.14337 6.19227V10.7804H3.55528C2.29355 10.7804 1.26123 11.8127 1.26123 13.0744C1.26123 14.3361 2.29355 15.3685 3.55528 15.3685H8.14337V19.9566Z" fill="white"/>
                    <path d="M31.0838 40.603C34.8848 40.603 37.966 37.5217 37.966 33.7208C37.966 29.9199 34.8848 26.8387 31.0838 26.8387C27.2829 26.8387 24.2017 29.9199 24.2017 33.7208C24.2017 37.5217 27.2829 40.603 31.0838 40.603Z" fill="white"/>
                    <path d="M49.4362 15.3685H42.1641L39.3195 12.2715C38.4707 11.3309 37.2319 10.7804 35.9472 10.7804H21.2653C21.6553 11.4686 21.9077 12.2256 21.9077 13.0744C21.9077 15.5979 19.843 17.6625 17.3196 17.6625H15.0255V19.9566C15.0255 22.48 12.9609 24.5447 10.4374 24.5447C9.58862 24.5447 8.83159 24.2923 8.14337 23.9023V47.4851C8.14337 50.0086 10.208 52.0732 12.7315 52.0732H49.4362C51.9597 52.0732 54.0243 50.0086 54.0243 47.4851V19.9566C54.0243 17.4331 51.9597 15.3685 49.4362 15.3685ZM31.0838 45.1911C24.7523 45.1911 19.6136 40.0524 19.6136 33.7208C19.6136 27.3893 24.7523 22.2506 31.0838 22.2506C37.4154 22.2506 42.5541 27.3893 42.5541 33.7208C42.5541 40.0524 37.4154 45.1911 31.0838 45.1911Z" fill="white"/>
                  </svg>
                </div>
              </div>
              <div v-else v-for="(item, i) in category.items" :key="item.id" class="item" :class="getItemClass(i)" @click="() => addPhotoToCategory(category, index + 1)">
                <img :src="item.imageUrl" alt="Item Photo" class="category-image" />
                <span class="item-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="timeline-section">
        <div class="timeline">
          <div class="timeline-column">
            <TimelineItem v-for="item in leftColumnItems" :key="item.id" :imageUrl="item.imageUrl" :description="item.description" :timestamp="item.timestamp" />
          </div>
          <div class="timeline-column">
            <TimelineItem v-for="item in rightColumnItems" :key="item.id" :imageUrl="item.imageUrl" :description="item.description" :timestamp="item.timestamp" />
          </div>
        </div>
      </div>
    </div>
    <FooterView />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
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
    const store = useStore();
    const profile = computed(() => store.state.profile);
    const category1 = computed(() => store.state.category1);
    const category2 = computed(() => store.state.category2);
    const timelineItems = computed(() => store.state.timelineItems);
    const currentDate = computed(() => new Date().toISOString().split('T')[0].replace(/-/g, '.'));

    const addPhotoToCategory = (category, categoryNumber) => {
      const newItem = {
        id: Date.now(),
        imageUrl: 'path/to/new-image.jpg',
        description: `New upload for ${category.name}`,
        timestamp: new Date()
      };

      store.dispatch('addItemToCategory', { categoryNumber, item: newItem });
      store.commit('ADD_TIMELINE_ITEM', newItem);
    };

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

    const startX = ref(0);
    const startY = ref(0);
    const isHorizontalScroll = ref(false);

    const touchStart = (event) => {
      startX.value = event.touches[0].clientX;
      startY.value = event.touches[0].clientY;
      isHorizontalScroll.value = false;
    };

    const touchMove = (event) => {
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const diffX = startX.value - currentX;
      const diffY = startY.value - currentY;

      if (!isHorizontalScroll.value) {
        isHorizontalScroll.value = Math.abs(diffX) > Math.abs(diffY);
      }

      if (!isHorizontalScroll.value) {
        return;
      }

      event.preventDefault();
    };

    const touchEnd = (event, category, categoryNumber) => {
      if (!isHorizontalScroll.value) {
        return;
      }

      const endX = event.changedTouches[0].clientX;
      const diffX = startX.value - endX;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          rotateCarousel(category, categoryNumber, 'left');
        } else {
          rotateCarousel(category, categoryNumber, 'right');
        }
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
      addPhotoToCategory,
      touchStart,
      touchMove,
      touchEnd,
      getItemClass
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
