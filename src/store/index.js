import { createStore } from 'vuex';
import { db } from '../firebase';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';

export default createStore({
  state: {
    profile: {
      hashtag: '',
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
    category1: {  // 追加
      name: 'Category1',
      count: 0,
      items: [],
      currdeg: 0
    },
    category2: {  // 追加
      name: 'Category2',
      count: 0,
      items: [],
      currdeg: 0
    }
  },
  mutations: {
    updateProfile(state, payload) {
      state.profile = { ...state.profile, ...payload };
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
    addTimelineItem(state, item) {
      state.timelineItems.unshift(item);
    },
    setCategory1(state, category) {  // 追加
      state.category1 = category;
    },
    setCategory2(state, category) {  // 追加
      state.category2 = category;
    }
  },
  actions: {
    saveProfile({ commit }, profile) {
      commit('updateProfile', profile);
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
      commit('addTimelineItem', item);
    },
    saveCategory1({ commit }, category) {  // 追加
      commit('setCategory1', category);
    },
    saveCategory2({ commit }, category) {  // 追加
      commit('setCategory2', category);
    }
  }
});
