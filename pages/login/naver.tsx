/**
 * 네이버 로그인이 성공하면 호출되는 페이지입니다.
 * 네이버 접근 토큰을 next 서버로 넘겨줍니다.
 * 서버에서 처리된 결과에 따라 화면 이동 처리합니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
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
  id?: string;
}

const Naver: NextPage = () => {
  const router = useRouter();
  /**
   * 로그인 성공 후 uri로 전달되는 hash 값을 파싱합니다.
   * @hash 인가코드 
   * @error 에러발생 시 에러 내용
   */
  let hash: string;
  if (router.asPath.split('access_token')[1]) {
    hash = router.asPath.split('access_token=')[1].split('&')[0]
  }

  const [, setCookie] = useCookies(['uid']); // 쿠키 훅 

  // Redux
  const dispatch = useDispatch();           // dispatch를 사용하기 쉽게 하는 hook입니다.
  const onloginAction = useCallback(() => {
    dispatch(loginAction());                // 서버에서 로그인이 성공처리 되면 헤더의 로그인 State를 변경해줍니다.
  }, []);


  /**
   * 서버로 접근토큰을 전송합니다.
   * 전송된 접근토큰에 대한 사용자 정보를 응답 받는데 성공하면 uid값을 쿠키로 저장합니다.
   * 
   * @TO_DO 토큰에 저장할 내용을 JWT로 변경 필요
   * @Response ResponseType 참조
   */
  const loginHandler = useCallback(
    async (token: string | string[]) => {
      axios
        .post('/api/oauth/naverCallback', {
          token: token
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then((resp) => {
          /**
           * 서버 결과(ok)가 true 일 경우 쿠키 설정과 함께 메인화면으로 리다이렉트 해줍니다.
           * 서버 결과(ok)가 false일 경우 로그인 화면으로 다시 이동합니다.
           */
          if (resp.data.ok) {
            const expireDate = new Date()
            expireDate.setMinutes(expireDate.getMinutes() + 5)

            setCookie('uid', resp.data.uid, {
              path: '/',
              expires: expireDate,
            });// 쿠키에 토큰 저장

            onloginAction()
            router.push('/');

          } else {
            console.log('fail')
            router.push('/login/login');
          }
          return
        })
        .catch((err) => {
          console.log('error 발생', err)
          return
        })
    },
    [router]
  );

  /**
   * 접근토큰 값이 발생되면 loginHandler를 호출합니다.
   * 발생되지 않을 경우에는 로그인 페이지로 이동시킵니다.
   */
  useEffect(() => {
    hash ? loginHandler(hash) : router.push('/login/login')
  }, [loginHandler, router]);

  return (
    <h2>로그인 중입니다..</h2>
  );
};

export default Naver