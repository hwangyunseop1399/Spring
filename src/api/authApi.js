import api from 'axios';
const BASE_URL = '/api/member';
const headers = { 'Content-Type': 'multipart/form-data' };

// api call = request를 서버에 날리기 위해서 axios를 쓴다.
// 그리고 그 요청이 언제 어떻게 처리될지 전혀 예측할 수 없으므로
// (서버가 바빠서 응답이 느릴수도 있다.)
// (또는 화재 등 천재지변으로 서버가 지구에서 사라질수도 있다.)
export default {
  // username 중복 체크, true: 중복(사용불가), false: 사용 가능

  async checkUsername(username) {
    // request_url : /api/member/checkusername/sangyeop0715
    const { data } = await api.get(`${BASE_URL}/checkusername/${username}`);
    console.log('AUTH GET CHECKUSERNAME', data);
    return data;
  },

  async create(member) {
    // 아바타 파일 업로드 – multipart 인코딩 필요 → FormData 객체 사용

    // 여기서 key값들을 spring쪽의 DTO 클래스 필드(멤버변수)에 맞춰줘야 한다.
    const formData = new FormData();
    formData.append('username', member.username);
    formData.append('email', member.email);
    formData.append('password', member.password);
    if (member.avatar) {
      formData.append('avatar', member.avatar);
    }

    // 그리고 일반적으로 보내던 json 형태의 데이터가 아니라,
    // 멀티파트 데이터이기 때문에 헤더설정을 해줘야한다.
    const { data } = await api.post(BASE_URL, formData, headers);
    console.log('AUTH POST: ', data);

    return data;
  },
};
