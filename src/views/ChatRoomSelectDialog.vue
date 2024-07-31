<template>
    <div class="chat-room-select-dialog-overlay">
      <div class="chat-room-select-dialog">
        <h2>チャットルームを選択</h2>
        <div v-if="chatRooms.length === 0" class="no-rooms-message">
          利用可能なチャットルームがありません。
        </div>
        <div v-else class="chat-room-list">
          <ul>
            <li v-for="room in chatRooms" :key="room.id" @click="selectRoom(room.id)">
              {{ room.otherUsernames.join(', ') }}
            </li>
          </ul>
        </div>
        <button @click="$emit('close')">閉じる</button>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'ChatRoomSelectDialog',
    props: {
      chatRooms: {
        type: Array,
        required: true
      }
    },
    emits: ['select', 'close'],
    setup(props, { emit }) {
      console.log('Chat rooms in dialog:', props.chatRooms);
  
      const selectRoom = (roomId) => {
        emit('select', roomId);
      };
  
      return {
        selectRoom
      };
    }
  });
  </script>
  
  
  
  <style scoped>
  .chat-room-select-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .chat-room-select-dialog {
    background-color: white;
    color: #333; /* テキストの色を暗めに設定 */
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    width: 300px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .chat-room-list {
    margin-top: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
  
  li:hover {
    background-color: #f0f0f0;
  }
  
  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .no-rooms-message {
    margin-top: 10px;
    color: #666;
  }
  </style>