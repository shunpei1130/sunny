<template>
  <div class="timelineItem">
    <img 
      :src="imageUrl" 
      :alt="description" 
      class="image" 
      @click="openModal"
    >
    <div class="description">{{ description }}</div>
    <div class="timestamp">{{ formattedTimestamp }}</div>
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
    }
  },
  setup(props) {
    const store = useStore()

    const formattedTimestamp = computed(() => {
      return props.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
    })

    const openModal = () => {
      store.commit('setSelectedImage', props.imageUrl)
    }

    return { 
      formattedTimestamp,
      openModal
    }
  }
}
</script>

<style scoped>
.timelineItem {
  width: 100%;
  position: relative;
  border-radius: 21.93px;
  background-color: #d3d3d3;
  height: 223px;
  overflow: hidden;
  margin-bottom: 20px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.description {
  position: absolute;
  bottom: 30px;
  left: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
}

.timestamp {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 0.8em;
}
</style>