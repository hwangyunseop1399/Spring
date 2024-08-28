import axios from 'axios'; //axios객체 하나 만들어 달라??????
import { useAuthStore } from '@/stores/auth';
import router from '@/router';

const instance = axios.create({
  // instance 를 axios 할거다~
  timeout: 1000, //1초동안 응답 없을 시 끊긴것으ㅡ로 간주
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config) => {
    //JWT 추출
    const { getToken } = useAuthStore();
    const token = getToken();
    if (token) {
      // 토큰이 있는 경우
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(config.headers.Authorization);
    }
    // config.headers : 요청 헤더 -> 나중에 핸들링 할 것
    return config; // 지정된 콘피그 리턴한다~
  },
  (error) => {
    // 요청중 에러가난 경우
    return Promise.reject(error);
  }
);
// 응답 인터셉터
instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response;
    }
    if (response.status === 404) {
      return Promise.reject('404: 페이지 없음 ' + response.request);
    }
    // 정상 응답인 경우 (200, 404)
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // response?.status => null이 아니면 status를 참조하겠다.
      const { logout } = useAuthStore();
      logout();
      router.push('/auth/login?error=login_required');
      return Promise.reject({ error: '로그인이 필요한 서비스입니다.' });
    }
    // 에러 응답인 경우(401, 403, 305, 500 등)
    return Promise.reject(error);
  }
);
export default instance; // 인터셉터가 적용된 axios 인스턴스
