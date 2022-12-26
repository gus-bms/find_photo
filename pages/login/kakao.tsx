/*
  1. loginHandler 재정의하기
  2. 각 변수들 타입 재정의 필요
*/

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/modules/isLogin';
import { useCookies } from 'react-cookie'; // useCookies import

interface ResponseType {
  ok: boolean;
  error?: any;
  token?: string;
}

const Kakao: NextPage = () => {
  const router = useRouter();
  const { code: authCode, error: kakaoServerError } = router.query;
  const [cookies, setCookie] = useCookies(['id']); // 쿠키 훅 

  // reducer isLogin Action 사용
  const dispatch = useDispatch(); // dispatch를 사용하기 쉽게 하는 hook
  const onloginAction = useCallback(() => { // useCallback은 최적화를 위한 hook이다 이 앱에선 굳이 사용 안 해도 되는데 습관이 들면 좋기에 사용.
    dispatch(loginAction());
  }, []);



  const loginHandler = useCallback(
    async (code: string | string[]) => {

      const response: ResponseType = await fetch('/api/oauth/kakaoCallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode: code,
        }),
      }).then((res) => res.json());

      if (response.ok) { // 성공하면 홈으로 리다이렉트
        const expireDate = new Date()
        expireDate.setMinutes(expireDate.getMinutes() + 5)

        setCookie('id', response.token, {
          path: '/',
          expires: expireDate,
        });// 쿠키에 토큰 저장

        onloginAction()
        router.push('/');
      } else { // 실패하면 에러 페이지로 리다이렉트
        console.log('fail')
        router.push('/login/login');
      }
    },
    [router]
  );

  useEffect(() => {
    if (authCode) {
      loginHandler(authCode);

      // 인가코드를 제대로 못 받았을 경우에 에러 페이지를 띄운다.
    } else if (kakaoServerError) {
      console.log(kakaoServerError)
      router.push('/login/login');
    }
  }, [loginHandler, authCode, kakaoServerError, router]);

  return (
    <h2>로그인 중입니다..</h2>
  );
};

export default Kakao