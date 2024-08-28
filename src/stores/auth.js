import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
const initState = {
  token: '', // 접근 토큰(JWT)
  user: {
    username: '', // 사용자 ID
    email: '', // Email
    roles: [], // 권한 목록
  },
};

export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });
  const isLogin = computed(() => !!state.value.user.username); // 로그인 여부
  const username = computed(() => state.value.user.username); // 로그인 사용자 ID
  const email = computed(() => state.value.user.email); // 로그인 사용자 email

  const login = async (member) => {
    // state.value.token = 'test token';
    // state.value.user = { username: member.username, email: member.username + '@test.com' }; // api 호출로 대체

    //api 호출
    const { data } = await axios.post('/api/auth/login', member);
    state.value = { ...data };
    localStorage.setItem('auth', JSON.stringify(state.value)); // localStore를 사용해서 저장한다, JSON.stringify == JSON직렬화
  };

  const logout = () => {
    localStorage.clear();
    state.value = { ...initState }; //초기상태로 전환??
  };

  const getToken = () => state.value.token;

  const load = () => {
    const auth = localStorage.getItem('auth');
    if (auth != null) {
      state.value = JSON.parse(auth); // JSON.parse == JSON 역직렬화
      console.log(state.value);
    } //해당 작업을 안하면 저장?이 안돼서 로그아웃 되어버림~
  };

  load();
  return { state, username, email, isLogin, login, logout, getToken }; //디버그용??
});
