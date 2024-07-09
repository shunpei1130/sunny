<template>
    <div class="div">
      <div class="search-container" @click="focusInput">
        <input 
          ref="searchInput"
          v-model="searchQuery" 
          @keyup.enter="performSearch"
          @focus="onInputFocus"
          @blur="onInputBlur"
          type="text" 
          class="search-input" 
          placeholder="検索..."
        >
        <svg 
          @click.stop="performSearch"
          class="search-icon" 
          width="28" 
          height="28" 
          viewBox="0 0 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.4914 16.8347H17.5954L17.2779 16.5285C18.6388 14.9407 19.3419 12.7746 18.9564 10.4724C18.4233 7.31959 15.7922 4.80189 12.6168 4.4163C7.81952 3.82657 3.78214 7.86396 4.37187 12.6612C4.75746 15.8367 7.27516 18.4678 10.4279 19.0008C12.7302 19.3864 14.8963 18.6832 16.484 17.3223L16.7902 17.6399V18.5358L21.6101 23.3557C22.0751 23.8207 22.835 23.8207 23.2999 23.3557C23.7649 22.8907 23.7649 22.1309 23.2999 21.6659L18.4914 16.8347ZM11.6868 16.8347C8.86289 16.8347 6.58336 14.5551 6.58336 11.7312C6.58336 8.90733 8.86289 6.62779 11.6868 6.62779C14.5107 6.62779 16.7902 8.90733 16.7902 11.7312C16.7902 14.5551 14.5107 16.8347 11.6868 16.8347Z" fill="black"/>
        </svg>
      </div>
      <div class="item"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchView',
    data() {
      return {
        searchQuery: '',
        isFocused: false
      }
    },
    methods: {
      performSearch() {
        console.log('Searching for:', this.searchQuery);
        // 検索ロジックをここに実装
      },
      focusInput() {
        this.$refs.searchInput.focus();
      },
      onInputFocus() {
        this.isFocused = true;
      },
      onInputBlur() {
        this.isFocused = false;
      }
    },
    mounted() {
      // コンポーネントがマウントされたときに自動的にフォーカスを当てる
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    }
  }
  </script>
  
  <style scoped>
  .div {
    width: 100%;
    position: relative;
    background-color: #fff;
    height: 866px;
    overflow: hidden;
  }
  
  .search-container {
    position: absolute;
    height: 4.86%;
    width: 81.6%;
    top: 6.24%;
    right: 9.07%;
    bottom: 88.9%;
    left: 9.33%;
    border-radius: 24.74px;
    border: 2px solid #c8c8c8;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: #fff; /* タップ可能な領域を明確にするために背景色を追加 */
  }
  
  .search-input {
    flex: 1;
    height: 100%;
    border: none;
    background: transparent;
    padding-left: 40px;
    font-size: 16px;
    outline: none;
    -webkit-appearance: none; /* iOS のデフォルトスタイルを削除 */
    -moz-appearance: none; /* Firefox のデフォルトスタイルを削除 */
    appearance: none; /* その他のブラウザのデフォルトスタイルを削除 */
  }
  
  .search-icon {
    position: absolute;
    left: 10px;
    cursor: pointer;
    pointer-events: auto; /* アイコンをタップ可能にする */
  }
  
  .item {
    position: absolute;
    top: 65.5px;
    left: 83.5px;
    border-right: 1px solid #848484;
    box-sizing: border-box;
    width: 1px;
    height: 19px;
  }
  
  /* タッチデバイスでの操作性を向上させるためのスタイル */
  @media (hover: none) and (pointer: coarse) {
    .search-container {
      cursor: pointer;
    }
  
    .search-input {
      cursor: text;
    }
  
    .search-icon {
      padding: 10px; /* タップ領域を広げる */
    }
  }
  </style>