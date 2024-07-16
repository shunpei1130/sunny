import { createStore } from 'vuex';
import { db } from '../firebase';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';

export default createStore({
  state: {
    profile: {
      hashtag1: '',
      hashtag2: '',
      username: '',
      bio: '',
      age: '',
      photo: '',
      profilePhotos: [],
      secondContentPhotos: [],
    },
    user: {
      username: '',
      password: ''
    },
    uploads: [],
    isLoading: true,
    isRegistered: false,
    agreedToPolicy: false,
    selectedImage: null,
    timelineItems: [],
    category1: {
      name: 'Category1',
      items: [],
      currdeg: 0
    },
    category2: {
      name: 'Category2',
      items: [],
      currdeg: 0
    },
    globalCount: 0 // グローバルカウントの追加
  },
  mutations: {
    updateProfile(state, payload) {
      Object.keys(payload).forEach(key => {
        state.profile[key] = payload[key];
      });
    },
    updateCategoryName(state, { categoryNumber, name }) {
      state[`category${categoryNumber}`].name = name;
    },
    setSelectedImage(state, imageUrl) {
      state.selectedImage = imageUrl
    },
    setUser(state, user) {
      state.user = user;
    },
    setUploads(state, uploads) {
      state.uploads = uploads;
    },
    addUpload(state, upload) {
      state.uploads.push(upload);
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setIsRegistered(state, isRegistered) {
      state.isRegistered = isRegistered;
    },
    setAgreedToPolicy(state, agreed) {
      state.agreedToPolicy = agreed;
    },
    setTimelineItems(state, items) {
      state.timelineItems = items;
    },
    
    setCategory(state, { categoryNumber, category }) {
      state[`category${categoryNumber}`] = category;
    },
    ADD_ITEM_TO_CATEGORY(state, { categoryNumber, item }) {
      const category = categoryNumber === 1 ? state.category1 : state.category2;

      // カウントを更新
      item.count = state.globalCount + 1;
      state.globalCount += 1;

      // 6枚以上の場合は最も古いアイテムを削除
      if (category.items.length >= 6) {
        category.items.shift();
      }

      category.items.push(item);
    },
    ADD_TIMELINE_ITEM(state, item) {
      state.timelineItems.unshift(item);
    },
    UPDATE_CATEGORY_ROTATION(state, { categoryNumber, currdeg }) {
      if (categoryNumber === 1) {
        state.category1.currdeg = currdeg;
      } else if (categoryNumber === 2) {
        state.category2.currdeg = currdeg;
      }
    }
  },
  actions: {
    saveProfile({ commit, dispatch }, profile) {
      commit('updateProfile', profile);
      dispatch('updateCategoryNames');
    },
    updateCategoryNames({ commit, state }) {
      if (state.profile.hashtag1) {
        commit('updateCategoryName', { categoryNumber: 1, name: state.profile.hashtag1 });
      }
      if (state.profile.hashtag2) {
        commit('updateCategoryName', { categoryNumber: 2, name: state.profile.hashtag2 });
      }
    },
    async fetchUploads({ commit }) {
      const querySnapshot = await getDocs(collection(db, 'uploads'));
      const uploads = [];
      querySnapshot.forEach((doc) => {
        uploads.push(doc.data());
      });
      commit('setUploads', uploads);
    },
    subscribeToUploads({ commit }) {
      onSnapshot(collection(db, 'uploads'), (snapshot) => {
        const uploads = [];
        snapshot.forEach((doc) => {
          uploads.push(doc.data());
        });
        commit('setUploads', uploads);
      });
    },
    async uploadImage({ commit }, upload) {
      const docRef = await addDoc(collection(db, 'uploads'), upload);
      commit('addUpload', { ...upload, id: docRef.id });
    },
    initializeApp({ commit }) {
      setTimeout(() => {
        commit('setIsLoading', false);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        commit('setIsRegistered', users.length > 0);
      }, 2000);
    },
    savePhoto({ commit, state }, { photo, type }) {
      if (type === 'profile') {
        const updatedPhotos = [photo, ...state.profile.profilePhotos].slice(0, 3);
        commit('updateProfile', { profilePhotos: updatedPhotos });
      } else if (type === 'secondContent') {
        const updatedPhotos = [photo, ...state.profile.secondContentPhotos].slice(0, 3);
        commit('updateProfile', { secondContentPhotos: updatedPhotos });
      }
    },
    saveTimelineItems({ commit }, items) {
      commit('setTimelineItems', items);
    },
    addTimelineItem({ commit }, item) {
      commit('ADD_TIMELINE_ITEM', item);
    },
    saveCategory({ commit }, { categoryNumber, category }) {
      commit('setCategory', { categoryNumber, category });
    },
    addItemToCategory({ commit }, payload) {
      commit('ADD_ITEM_TO_CATEGORY', payload);
    },
    updateCategoryRotation({ commit }, payload) {
      commit('UPDATE_CATEGORY_ROTATION', payload);
    }
  },
  getters: {
    getCategoryName: (state) => (categoryNumber) => {
      return state[`category${categoryNumber}`].name;
    },
    getProfilePhotos: (state) => state.profile.profilePhotos,
    getSecondContentPhotos: (state) => state.profile.secondContentPhotos
  }
  
});
