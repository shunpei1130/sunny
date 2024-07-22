import { createStore } from 'vuex';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

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
    user: null, // userオブジェクトをnullで初期化
    uploads: [],
    isLoading: true,
    isRegistered: false,
    agreedToPolicy: false,
    selectedImage: null,
    timelineItems: [],
    category1: {
      name: 'Category1',
      items: [],
      currdeg: 0,
      localCount: 0
    },
    category2: {
      name: 'Category2',
      items: [],
      currdeg: 0,
      localCount: 0
    },
  },
  mutations: {
    updateProfile(state, payload) {
      console.log('updateProfile called with payload:', payload);
      Object.keys(payload).forEach(key => {
        state.profile[key] = payload[key];
      });
    },
    updateCategoryName(state, { categoryNumber, name }) {
      console.log('updateCategoryName called with categoryNumber:', categoryNumber, 'name:', name);
      state[`category${categoryNumber}`].name = name;
    },
    setSelectedImage(state, imageUrl) {
      console.log('setSelectedImage called with imageUrl:', imageUrl);
      state.selectedImage = imageUrl;
    },
    setUser(state, user) {
      console.log('setUser called with user:', user);
      state.user = user;
    },
    setUploads(state, uploads) {
      console.log('setUploads called with uploads:', uploads);
      state.uploads = uploads;
    },
    addUpload(state, upload) {
      console.log('addUpload called with upload:', upload);
      state.uploads.push(upload);
    },
    setIsLoading(state, isLoading) {
      console.log('setIsLoading called with isLoading:', isLoading);
      state.isLoading = isLoading;
    },
    setIsRegistered(state, isRegistered) {
      console.log('setIsRegistered called with isRegistered:', isRegistered);
      state.isRegistered = isRegistered;
    },
    setAgreedToPolicy(state, agreed) {
      console.log('setAgreedToPolicy called with agreed:', agreed);
      state.agreedToPolicy = agreed;
    },
    setTimelineItems(state, items) {
      console.log('setTimelineItems called with items:', items);
      state.timelineItems = items;
    },
    setCategory(state, { categoryNumber, category }) {
      console.log('setCategory called with categoryNumber:', categoryNumber, 'category:', category);
      state[`category${categoryNumber}`] = category;
    },
    ADD_ITEM_TO_CATEGORY(state, { categoryNumber, item }) {
      console.log('ADD_ITEM_TO_CATEGORY called with categoryNumber:', categoryNumber, 'item:', item);
      const category = state[`category${categoryNumber}`];

      item.count = category.localCount + 1;
      category.localCount += 1;

      if (category.items.length >= 6) {
        category.items.shift();
      }

      category.items.push(item);
    },
    ADD_TIMELINE_ITEM(state, item) {
      console.log('ADD_TIMELINE_ITEM called with item:', item);
      state.timelineItems.unshift(item);
    },
    UPDATE_CATEGORY_ROTATION(state, { categoryNumber, currdeg }) {
      console.log('UPDATE_CATEGORY_ROTATION called with categoryNumber:', categoryNumber, 'currdeg:', currdeg);
      state[`category${categoryNumber}`].currdeg = currdeg;
    }
  },
  actions: {
    async saveProfile({ commit, dispatch }, profile) {
      console.log('saveProfile action called with profile:', profile);
      commit('updateProfile', profile);
      dispatch('updateCategoryNames');
    },
    updateCategoryNames({ commit, state }) {
      console.log('updateCategoryNames action called');
      if (state.profile.hashtag1) {
        commit('updateCategoryName', { categoryNumber: 1, name: state.profile.hashtag1 });
      }
      if (state.profile.hashtag2) {
        commit('updateCategoryName', { categoryNumber: 2, name: state.profile.hashtag2 });
      }
    },
    async register({ commit }, { email, password }) {
      console.log('register action called with email:', email);
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        commit('setUser', user);
      } catch (error) {
        console.error('Error registering user:', error);
        throw error; // エラーを投げてキャッチできるようにする
      }
    },
    async login({ commit }, { email, password }) {
      console.log('login action called with email:', email);
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        commit('setUser', user);
      } catch (error) {
        console.error('Error logging in:', error);
        throw error; // エラーを投げてキャッチできるようにする
      }
    },
    async logout({ commit }) {
      console.log('logout action called');
      try {
        await signOut(auth);
        commit('setUser', null);
      } catch (error) {
        console.error('Error logging out:', error);
        throw error; // エラーを投げてキャッチできるようにする
      }
    },
    initializeApp({ commit }) {
      console.log('initializeApp action called');
      setTimeout(() => {
        commit('setIsLoading', false);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        commit('setIsRegistered', users.length > 0);
      }, 2000);
    },
    savePhoto({ commit, state }, { photo, type }) {
      console.log('savePhoto action called with photo:', photo, 'type:', type);
      if (type === 'profile') {
        const updatedPhotos = [photo, ...state.profile.profilePhotos].slice(0, 3);
        commit('updateProfile', { profilePhotos: updatedPhotos });
      } else if (type === 'secondContent') {
        const updatedPhotos = [photo, ...state.profile.secondContentPhotos].slice(0, 3);
        commit('updateProfile', { secondContentPhotos: updatedPhotos });
      }
    },
    saveTimelineItems({ commit }, items) {
      console.log('saveTimelineItems action called with items:', items);
      commit('setTimelineItems', items);
    },
    addTimelineItem({ commit }, item) {
      console.log('addTimelineItem action called with item:', item);
      commit('ADD_TIMELINE_ITEM', item);
    },
    saveCategory({ commit }, { categoryNumber, category }) {
      console.log('saveCategory action called with categoryNumber:', categoryNumber, 'category:', category);
      commit('setCategory', { categoryNumber, category });
    },
    addItemToCategory({ commit }, payload) {
      console.log('addItemToCategory action called with payload:', payload);
      commit('ADD_ITEM_TO_CATEGORY', payload);
    },
    updateCategoryRotation({ commit }, payload) {
      console.log('updateCategoryRotation action called with payload:', payload);
      commit('UPDATE_CATEGORY_ROTATION', payload);
    }
  },
  getters: {
    // 必要に応じてgettersを追加
  }
});
