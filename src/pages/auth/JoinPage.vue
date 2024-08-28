<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authApi from '@/api/authApi';

const router = useRouter();

/**
 * <input
          id="avatarId"
          type="file"
          class="form-control"
          accept="image/png, image/jpeg"
          ref="avatar"
        />
 */
const avatar = ref(null);

const checkError = ref('');

const member = reactive({
  username: 'sangyeop0715',
  email: 'sangyeop0715@gmail.com',
  password: '1234',
  password2: '1234',
  avatar: null,
});

const disableSubmit = ref(true);

// username 중복 체크
const checkUsername = async () => {
  if (!member.username) {
    return alert('사용자 ID를 입력하세요.');
  }
  // 비동기 함수를 호출하면 promise 객체가 return 되므로
  // 반드시 async-await 를 잘 처리해줘야 promise가 해결된 상태의 데이터를 받아먹을 수 있다.
  disableSubmit.value = await authApi.checkUsername(member.username); // ture or false
  console.log(disableSubmit.value, typeof disableSubmit.value);
  checkError.value = disableSubmit.value
    ? '이미 사용중인 ID입니다.'
    : '사용가능한 ID입니다.';
};

// username 입력 핸들러
const changeUsername = () => {
  //
  disableSubmit.value = true; //
  if (member.username) {
    checkError.value = 'ID 중복 체크를 하셔야 합니다.';
  } else {
    checkError.value = '';
  }
};

const join = async () => {
  if (member.password != member.password2) {
    return alert('비밀번호가 일치하지 않습니다.');
  }

  if (avatar.value.files.length > 0) {
    // ref <input type="file" />
    // 실제로 콘솔을 찍어보면 ref를 통해, dom요소(html 태그, 객체)를 담고 있고
    // dom을 직접참조(조작)함으로써
    // 그 안에 포함되어 있는  데이터들을 꺼내먹는 것이다.
    console.log('avatar', avatar);
    console.log('avatar.value', avatar.value);
    console.log('avatar.value.files', avatar.value.files);
    member.avatar = avatar.value.files[0];
  }

  try {
    await authApi.create(member); // 회원가입

    router.push({ name: 'home' }); // 회원 가입 성공 시, 첫 페이지로 이동 또는 로그인 페이지로 이동
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="mt-5 mx-auto" style="width: 500px">
    <h1 class="my-5">
      <i class="fa-solid fa-user-plus"></i>
      회원 가입
    </h1>
    <!-- prevent를 걸어준 이유는 form 태그가 기본으로 가지고 있는 설정값인, '특정 경로로 request 날리기'를 무효화 해주기 위해서다. -->
    <!-- 실제로 request를 날리는 게 아니라, vue 내부에서 url만 바꿔야 하기 때문. -->
    <form @submit.prevent="join">
      <div class="mb-3 mt-3">
        <label for="username" class="form-label">
          <i class="fa-solid fa-user"></i>
          사용자 ID :

          <button
            type="button"
            class="btn btn-success btn-sm py-0 me-2"
            @click="checkUsername"
          >
            ID 중복 확인
          </button>

          <span :class="disableSubmit.value ? 'text-primary' : 'text-danger'">{{
            checkError
          }}</span>
        </label>

        <!-- @input : 유저가 인풋을 입력할 때 마다 무언가를 실행시키겠따 -->
        <!-- v-model : 유저가 입력한 것을, v-model="member.username" 에 집어 넣겠다 -->
        <!-- ref : 단일값, 단일객체에 대한 상태관리 -->
        <!-- 1, abc, 이상엽 -->
        <!-- reactive : 여러개의 키밸류로 이루어진 객체에 대한 상태관리 -->

        <!-- disableSubmit 상태변수가 하는 역할과, 이 기능이 작동하는 원리 -->
        <!-- 유저가 이미 중복아이디 검사를 했더 하더라도, 다시 id칸에 입력 한번이라도 했다면 수정을 했다는 것이므로 했다면 다시 검증받아야 된다 -->
        <!-- 그래서 유저가 입력할 때 마다 changeUsername 함수가 실행되며, 매 함수 초반에 -->
        <!-- disableSubmit.value = true; 라는 코드로써 다시 중복검사를 하게끔 안내메세지와, 더불어 submit 버튼을 비활성화 시키는 것이다. -->
        <input
          type="text"
          class="form-control"
          placeholder="사용자 ID"
          id="username"
          @input="changeUsername"
          v-model="member.username"
        />
      </div>
      <div>
        <label for="avatarId" class="form-label">
          <i class="fa-solid fa-user-astronaut"></i>
          아바타 이미지:
        </label>

        <input
          id="avatarId"
          type="file"
          class="form-control"
          accept="image/png, image/jpeg"
          ref="avatar"
        />
      </div>

      <div class="mb-3 mt-3">
        <label for="email" class="form-label">
          <i class="fa-solid fa-envelope"></i>
          email
        </label>
        <input
          type="email"
          class="form-control"
          placeholder="Email"
          id="email"
          v-model="member.email"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">
          <i class="fa-solid fa-lock"></i> 비밀번호:
        </label>
        <input
          type="password"
          class="form-control"
          placeholder="비밀번호"
          id="password"
          v-model="member.password"
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">
          <i class="fa-solid fa-lock"></i> 비밀번호 확인:
        </label>
        <input
          type="password"
          class="form-control"
          placeholder="비밀번호 확인"
          id="password2"
          v-model="member.password2"
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary mt-4"
        :disabled="disableSubmit"
      >
        <i class="fa-solid fa-user-plus"></i>
        확인
      </button>
    </form>
  </div>
</template>
