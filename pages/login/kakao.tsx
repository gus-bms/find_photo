/*
  1. loginHandler 재정의하기
  2. 각 변수들 타입 재정의 필요
*/

import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import axios from 'axios'

interface ResponseType {
  ok: boolean;
  error?: any;
}

const Kakao: NextPage = () => {
  const router = useRouter();
  const { code: authCode, error: kakaoServerError } = router.query;

  const loginHandler = useCallback(
    async (code: string | string[]) => {

      const response: ResponseType = await fetch('/api/oauthCallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode: code,
        }),
      }).then((res) => res.json());

      if (response.ok) { // 성공하면 홈으로 리다이렉트
        router.push('/');
      } else { // 실패하면 에러 페이지로 리다이렉트
        console.log('fail')
        router.push('/login/login');
      }
    },
    [router]
  );

  useEffect(() => {
    console.log(authCode)
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