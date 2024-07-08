import { createStore } from 'vuex';
import { db } from '../firebase';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';

export default createStore({
  state: {
    user: {
      username: '',
      password: ''
    },
    uploads: [],
    isLoading: true,
    isRegistered: false,
    agreedToPolicy: false,
    selectedImage: null
  },
  mutations: {
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
    }
  },
  actions: {
    async registerUser({ commit }, user) {
      // 仮のユーザー登録ロジック
      const users = JSON.parse(localStorage.getItem('users')) || [];
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      commit('setUser', user);
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
      }, 2000); // 2秒後にローディングを終了
    }
  },
  getters: {
    allUploads: state => state.uploads,
    isLoading: state => state.isLoading,
    isRegistered: state => state.isRegistered,
    agreedToPolicy: state => state.agreedToPolicy
  }
});

