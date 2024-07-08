<template>
  <div class="top">
    <HeaderView />
    <div class="content">
      <div class="existing-content">
        <!-- 既存のコンテンツ -->
        <div class="top-child"></div>
        <div class="top-item"></div>
        <div class="top-inner"></div>
        <div class="rectangle-div"></div>
        <div class="top-child1"></div>
        <div class="top-child2"></div>
        <div class="top-child3"></div>
        <div class="top-child4"></div>
        <div class="div">20</div>
        <div class="div1">19</div>
        <div class="div2">18</div>
        <div class="div3">17</div>
        <b class="b">{{ currentDate }}</b>
        <div class="training">#training</div>
        <div class="top-child5"></div>
        <div class="div4">21</div>
        <div class="book">#book</div>
        <img class="add-a-photo-icon" alt="" src="add_a_photo.svg" />
        <div class="top-child6" @click="onAddPhotoClick"></div>
        <img class="add-a-photo-icon1" alt="" src="add_a_photo.svg" />
        <div class="div5">82</div>
        <div class="div6">81</div>
        <div class="div7">80</div>
        <div class="div8">79</div>
        <div class="div9">78</div>
      </div>
      
      <!-- タイムラインセクション -->
      <div class="timeline-section">
        <div class="timeline">
          <div class="timeline-column">
            <TimelineItem
              v-for="item in leftColumnItems"
              :key="item.id"
              :imageUrl="item.imageUrl"
              :description="item.description"
              :timestamp="item.timestamp"
            />
          </div>
          <div class="timeline-column">
            <TimelineItem
              v-for="item in rightColumnItems"
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
    
    const timelineItems = ref([
      { id: 1, imageUrl: 'path/to/image1.jpg', description: 'First upload', timestamp: new Date('2024-06-15T10:00:00') },
      { id: 2, imageUrl: 'path/to/image2.jpg', description: 'Second upload', timestamp: new Date('2024-06-15T11:30:00') },
      { id: 3, imageUrl: 'path/to/image3.jpg', description: 'Third upload', timestamp: new Date('2024-06-15T14:15:00') },
    ]);

    const leftColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 === 0));
    const rightColumnItems = computed(() => timelineItems.value.filter((_, index) => index % 2 !== 0));

    const onAddPhotoClick = () => {
      console.log('Add photo clicked');
      const newItem = {
        id: timelineItems.value.length + 1,
        imageUrl: 'path/to/new-image.jpg',
        description: 'New upload',
        timestamp: new Date()
      };
      timelineItems.value.unshift(newItem);
    };

    return {
      currentDate,
      leftColumnItems,
      rightColumnItems,
      onAddPhotoClick
    };
  }
};
</script>

<style scoped>
.top {
  width: 100%;
  position: relative;
  background-color: #2f4f4f;
  min-height: 100vh;
  overflow-x: hidden;
  text-align: center;
  font-size: 24.22px;
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
  padding-top: 60px; /* 固定ヘッダーのスペース */
  padding-bottom: 80px; /* 固定フッターのスペース */
}

.existing-content {
  position: relative;
  height: 700px; /* 既存のコンテンツの高さを固定 */
}

.timeline-section {
  padding: 20px;
}

.timeline-section h2 {
  margin-bottom: 20px;
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

/* 既存のスタイル */
.top-child,
.top-item,
.top-inner,
.rectangle-div {
  position: absolute;
  top: 243.35px;
  box-shadow: 0px 2.5355188846588135px 2.54px rgba(0, 0, 0, 0.25);
  border-radius: 9.51px;
  background-color: #d3d3d3;
  width: 77.3px;
  height: 96.7px;
  transform: rotate(10deg);
  transform-origin: 0 0;
}

.top-child { left: 266.06px; }
.top-item { left: 227.39px; }
.top-inner { left: 188.73px; }
.rectangle-div { left: 150.06px; }

.top-child1,
.top-child2,
.top-child3,
.top-child4 {
  position: absolute;
  top: 471.45px;
  box-shadow: 0px 2.5438289642333984px 2.54px rgba(0, 0, 0, 0.25);
  border-radius: 9.54px;
  background-color: #d3d3d3;
  width: 77.6px;
  height: 97px;
  transform: rotate(10deg);
  transform-origin: 0 0;
}

.top-child1 { left: 266.8px; }
.top-child2 { left: 228px; }
.top-child3 { left: 189.21px; }
.top-child4 { left: 150.42px; }

.div, .div1, .div2, .div3 {
  position: absolute;
  top: 547px;
  font-weight: 800;
}

.div { left: 180px; }
.div1 { left: 219.93px; }
.div2 { left: 258.73px; }
.div3 { left: 298.66px; }

.sunny1-icon {
  position: absolute;
  top: 50px;
  left: 144px;
  width: 88px;
  height: 34.1px;
  object-fit: cover;
}

.sort-icon {
  position: absolute;
  height: 2.81%;
  width: 6.4%;
  top: 6.67%;
  right: 5.07%;
  bottom: 90.53%;
  left: 88.53%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  cursor: pointer;
}

.b {
  position: absolute;
  top: 112px;
  left: 153px;
  font-size: 11.9px;
  font-family: Inter, sans-serif;
  color: #fff;
  text-align: left;
}

.training {
  position: absolute;
  top: 16.02%;
  left: 14.13%;
  font-size: 18.52px;
  letter-spacing: -0.32px;
  line-height: 34.37px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  color: #fff;
  text-align: left;
}

.top-child5 {
  position: absolute;
  top: 401px;
  left: 41px;
  box-shadow: 0px 4.563928604125977px 4.56px rgba(0, 0, 0, 0.25);
  border-radius: 17.11px;
  background-color: #d3d3d3;
  width: 139.2px;
  height: 174px;
}

.div4 {
  position: absolute;
  top: 421.54px;
  left: 62.68px;
  font-size: 91.28px;
  font-weight: 800;
  color: #fff;
}

.book {
  position: absolute;
  top: 42.81%;
  left: 14.4%;
  font-size: 18.52px;
  letter-spacing: -0.32px;
  line-height: 34.37px;
  font-weight: 500;
  font-family: Inter, sans-serif;
  color: #fff;
  text-align: left;
}

.add-a-photo-icon {
  position: absolute;
  height: 3.87%;
  width: 8.83%;
  top: 62.51%;
  right: 54.38%;
  bottom: 33.61%;
  left: 36.8%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}

.top-child6 {
  position: absolute;
  top: 172px;
  left: 41px;
  box-shadow: 0px 4.5490193367004395px 4.55px rgba(0, 0, 0, 0.25);
  border-radius: 17.06px;
  background-color: #d3d3d3;
  width: 138.7px;
  height: 173.4px;
  cursor: pointer;
}

.add-a-photo-icon1 {
  position: absolute;
  height: 3.86%;
  width: 8.8%;
  top: 35.41%;
  right: 54.49%;
  bottom: 60.73%;
  left: 36.71%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
}

.div5 {
  position: absolute;
  top: 192.47px;
  left: 55.78px;
  font-size: 90.98px;
  font-weight: 800;
  color: #fff;
}

.div6, .div7, .div8, .div9 {
  position: absolute;
  top: 319px;
  font-size: 24.14px;
  font-weight: 800;
}

.div6 { left: 182px; }
.div7 { left: 218.39px; }
.div8 { left: 259.33px; }
.div9 { left: 296.86px; }

.vector-icon {
  position: absolute;
  top: 746px;
  left: 277px;
  width: 80px;
  height: 80px;
  cursor: pointer;
}

.search-icon, .notifications-icon {
  position: absolute;
  height: 3.27%;
  width: 7.47%;
  top: 6.2%;
  max-width: 100%;
  overflow: hidden;
  max-height: 100%;
  cursor: pointer;
}

.search-icon {
  right: 70.93%;
  bottom: 90.53%;
  left: 21.6%;
}

.notifications-icon {
  right: 15.2%;
  bottom: 90.53%;
  left: 78.4%;
}
</style>