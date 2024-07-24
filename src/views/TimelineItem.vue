<template>
  <div class="timelineItem-container">
    <div class="overlay-text">
      <div class="description">{{ description }}</div>
      <div class="username">{{ username }}</div>
    </div>
    <div class="timelineItem">
      <img 
        :src="imageUrl" 
        :alt="description" 
        class="image" 
        @click="openModal"
      >
      <div class="count">{{ count }}</div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: "TimelineItem",
  props: {
    imageUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      required: true
    },
    count: Number,
    username: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = useStore()

    const formattedTimestamp = computed(() => {
      return props.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    })

    const openModal = () => {
      store.commit('setSelectedImage', props.imageUrl)
      console.log('Opening modal')
    }

    return { 
      formattedTimestamp,
      openModal
    }
  }
}
</script>

<style scoped>
.timelineItem-container {
  width: 100%;
  margin-bottom: 20px;
  position: relative;
}

.overlay-text {
  position: absolute;
  top: -19px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  margin: 0px 23px;
}

.timelineItem {
  position: relative;
  border-radius: 21.93px;
  background-color: #d3d3d3;
  height: 223px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}

.count {
  font-size: 90px;
  font-weight: 800;
  font-family: Commissioner, sans-serif;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 2;
  position: relative;
}

.description {
  font-size: 9px;
  color: #ffffff;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: Inter;
}

.username {
  font-size: 9px;
  color: #ffffff;
  padding: 5px 10px;
  border-radius: 5px;
  font-family: Inter;
}

.timestamp {
  font-size: 0.8em;
  color: #999;
  text-align: right;
  margin-top: 5px;
}
</style>