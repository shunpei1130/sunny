<template>
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="rectangleDiv">
          <img :src="imageUrl" alt="Enlarged image" class="enlarged-image" />
        </div>
        <button class="close-button" @click="closeModal">閉じる</button>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default defineComponent({
    name: 'ImageModal',
    setup() {
      const store = useStore()
  
      const showModal = computed(() => store.state.selectedImage !== null)
      const imageUrl = computed(() => store.state.selectedImage)
  
      const closeModal = () => {
        store.commit('setSelectedImage', null)
      }
  
      return {
        showModal,
        imageUrl,
        closeModal
      }
    }
  })
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    position: relative;
    width: 90%;
    max-width: 500px;
  }
  
  .rectangleDiv {
    width: 100%;
    position: relative;
    border-radius: 46.11px;
    background-color: #d3d3d3;
    height: 468.7px;
    overflow: hidden;
  }
  
  .enlarged-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .close-button {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background-color: #008080;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>