import { createStore } from 'vuex';
import { auth, db, storage } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc, 
  setDoc,
  getDocs, 
  collection, 
  getFirestore, 
  addDoc,
  writeBatch, 
  query, 
  orderBy,
  where // この行を追加
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default createStore({
  state: {
    following: [],
    followers: [],
    profile: {
      hashtag1: '',
      hashtag2: '',
      username: '',
      bio: '',
      age: '',
      photo: '',
    },
    user: null,
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
    SET_FOLLOWING(state, following) {
      state.following = following;
    },
    SET_FOLLOWERS(state, followers) {
      state.followers = followers;
    },
    updateProfile(state, payload) {
      console.log('updateProfile called with payload:', payload);
      Object.keys(payload).forEach(key => {
        state.profile[key] = payload[key];
      });
    },
    setSelectedImage(state, imageUrl) {
      console.log('setSelectedImage called with imageUrl:', imageUrl);
      state.selectedImage = imageUrl;
    },
    setUser(state, user) {
      console.log('setUser called with user:', user);
      state.user = user;
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
    },
    SET_CATEGORY_ITEMS(state, { categoryNumber, items }) {
      state[`category${categoryNumber}`].items = items;
      state[`category${categoryNumber}`].localCount = items.length;
    },
    SET_TIMELINE_ITEMS(state, items) {
      state.timelineItems = items;
    },
  },

  
  actions: {
    async fetchProfile({ commit }) {
      console.log('fetchProfile action called');
      try {
        const user = auth.currentUser;
        if (user) {
          const profileRef = doc(db, "profiles", user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            commit('updateProfile', profileSnap.data());
            console.log('Profile fetched from Firestore:', profileSnap.data());
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("No user is signed in.");
        }
      } catch (e) {
        console.error("Error fetching profile from Firestore: ", e);
      }
    },
  
    async register({ commit }, { email, password }) {
      console.log('register action called with email:', email);
      try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        commit('setUser', user);
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
    },
  
    async login({ commit }, { email, password }) {
      console.log('login action called with email:', email);
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        commit('setUser', user);
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
  
    async logout({ commit }) {
      console.log('logout action called');
      try {
        await signOut(auth);
        commit('setUser', null);
      } catch (error) {
        console.error('Error logging out:', error);
        throw error;
      }
    },
  
    initializeApp({ commit, dispatch }) {
      console.log('initializeApp action called');
      commit('setIsLoading', true);
      return Promise.all([
        dispatch('fetchFollowData'),
        dispatch('fetchProfile'),
        dispatch('fetchTimelineItems'),
        dispatch('fetchCategoryItems')
      ]).finally(() => {
        commit('setIsLoading', false);
      });
    },
  
    addItemToCategory({ commit }, payload) {
      console.log('addItemToCategory action called with payload:', payload);
      commit('ADD_ITEM_TO_CATEGORY', payload);
    },
  
    updateCategoryRotation({ commit }, payload) {
      console.log('updateCategoryRotation action called with payload:', payload);
      commit('UPDATE_CATEGORY_ROTATION', payload);
    },
  
    async addPhotoToCategory({ state, commit }, { categoryNumber, file, description }) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
    
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `users/${user.uid}/category${categoryNumber}/${Date.now()}`);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
    
        // Add item to Firestore
        const profileRef = doc(db, "profiles", user.uid);
        const categoryRef = collection(profileRef, `category${categoryNumber}`);
        const newItem = {
          imageUrl,
          description,
          timestamp: new Date(),
          count: state[`category${categoryNumber}`].localCount + 1
        };
        const docRef = await addDoc(categoryRef, newItem);
    
        // Update local state
        commit('ADD_ITEM_TO_CATEGORY', { 
          categoryNumber, 
          item: { ...newItem, id: docRef.id }
        });
        commit('ADD_TIMELINE_ITEM', { ...newItem, id: docRef.id, username: state.profile.username });
      } catch (error) {
        console.error('Error adding photo to category:', error);
        throw error;
      }
    },
  
    async fetchCategoryItems({ commit }) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
    
        const profileRef = doc(db, "profiles", user.uid);
        
        for (let i = 1; i <= 2; i++) {
          const categoryRef = collection(profileRef, `category${i}`);
          const querySnapshot = await getDocs(categoryRef);
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          commit('SET_CATEGORY_ITEMS', { categoryNumber: i, items });
        }
      } catch (error) {
        console.error('Error fetching category items:', error);
      }
    },
  
    async followUser({ commit, state }, userIdToFollow) {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('User not authenticated');
    
      const db = getFirestore();
      const batch = writeBatch(db);
    
      try {
        // 現在のユーザーのfollowingリストを更新
        const currentUserRef = doc(db, 'users', currentUser.uid);
        const currentUserDoc = await getDoc(currentUserRef);
        if (!currentUserDoc.exists()) {
          batch.set(currentUserRef, { following: [userIdToFollow], followers: [] });
        } else {
          batch.update(currentUserRef, {
            following: arrayUnion(userIdToFollow)
          });
        }
    
        // フォロー対象ユーザーのfollowersリストを更新
        const userToFollowRef = doc(db, 'users', userIdToFollow);
        const userToFollowDoc = await getDoc(userToFollowRef);
        if (!userToFollowDoc.exists()) {
          batch.set(userToFollowRef, { following: [], followers: [currentUser.uid] });
        } else {
          batch.update(userToFollowRef, {
            followers: arrayUnion(currentUser.uid)
          });
        }
    
        await batch.commit();
        commit('SET_FOLLOWING', [...state.following, userIdToFollow]);
      } catch (error) {
        console.error('Error following user:', error);
        if (error.code === 'permission-denied') {
          console.error('Permission denied. Check security rules and user authentication.');
        }
        throw error;
      }
    },
  
    async unfollowUser({ commit, state }, userIdToUnfollow) {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
  
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        following: arrayRemove(userIdToUnfollow)
      });
  
      const unfollowedUserRef = doc(db, 'users', userIdToUnfollow);
      await updateDoc(unfollowedUserRef, {
        followers: arrayRemove(currentUser.uid)
      });
  
      commit('SET_FOLLOWING', state.following.filter(id => id !== userIdToUnfollow));
    },
  
    async fetchFollowData({ commit }) {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
    
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          commit('SET_FOLLOWING', userData.following || []);
          commit('SET_FOLLOWERS', userData.followers || []);
        } else {
          // ユーザードキュメントが存在しない場合、新しく作成
          await setDoc(userRef, { following: [], followers: [] });
          commit('SET_FOLLOWING', []);
          commit('SET_FOLLOWERS', []);
        }
      } catch (error) {
        console.error('Error fetching follow data:', error);
        commit('SET_FOLLOWING', []);
        commit('SET_FOLLOWERS', []);
      }
    },
  
    async fetchTimelineItems({ commit, state }) {
      const user = auth.currentUser;
      if (!user) return;
    
      try {
        let timelineItems = [];
        const categories = ['category1', 'category2'];
    
        // 自分のアイテムを取得
        for (const category of categories) {
          const categoryRef = collection(db, 'profiles', user.uid, category);
          const q = query(categoryRef, orderBy('timestamp', 'desc'));
          const querySnapshot = await getDocs(q);
    
          querySnapshot.forEach((doc) => {
            timelineItems.push({
              id: doc.id,
              ...doc.data(),
              category,
              username: state.profile.username,
              userId: user.uid
            });
          });
        }
    
        // フォローしているユーザーのアイテムを取得
        for (const followedUserId of state.following) {
          const userProfileRef = doc(db, 'profiles', followedUserId);
          const userProfileSnap = await getDoc(userProfileRef);
          const followedUsername = userProfileSnap.data().username;
    
          for (const category of categories) {
            const categoryRef = collection(db, 'profiles', followedUserId, category);
            const q = query(categoryRef, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
    
            querySnapshot.forEach((doc) => {
              timelineItems.push({
                id: doc.id,
                ...doc.data(),
                category,
                username: followedUsername,
                userId: followedUserId
              });
            });
          }
        }
    
        // タイムスタンプで降順にソートし、最新の20アイテムのみを保持
        timelineItems.sort((a, b) => b.timestamp - a.timestamp);
        timelineItems = timelineItems.slice(0, 20);
    
        commit('SET_TIMELINE_ITEMS', timelineItems);
      } catch (error) {
        console.error('Error fetching timeline items:', error);
      }
    },
  
    // uploadPhoto アクション
async uploadPhoto(_, { file }) {  // state を削除し、_ に変更
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Upload image to Firebase Storage
    const storageRef = ref(storage, `users/${user.uid}/photos/${Date.now()}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    return imageUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
},

// fetchChatRooms アクション
async fetchChatRooms() { // state パラメータを削除
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching chat rooms for user:', user.uid);

    const chatRoomsRef = collection(db, 'chatRooms');
    const q = query(chatRoomsRef, where('participants', 'array-contains', user.uid));
    const querySnapshot = await getDocs(q);
    
    const chatRooms = [];
    querySnapshot.forEach((doc) => {
      chatRooms.push({ id: doc.id, ...doc.data() });
    });

    console.log('Fetched chat rooms:', chatRooms);

    return chatRooms;
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    throw error;
  }
},

// addPhotoToChatRoom アクション
async addPhotoToChatRoom({ rootState }, { chatRoomId, imageUrl, description }) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
    await updateDoc(chatRoomRef, {
      photos: arrayUnion({
        imageUrl,
        description,
        timestamp: new Date(),
        userId: user.uid,
        username: rootState.profile.username
      })
    });

    console.log('Photo added to chat room successfully');
  } catch (error) {
    console.error('Error adding photo to chat room:', error);
    throw error;
  }
},
  },
  getters: {
    // 必要に応じてgettersを追加
  }
});
