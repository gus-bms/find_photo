import { useRef } from 'react';
import { Button } from '@mui/material';
import style from '../../../styles/Login.module.css'
import Script from 'next/script';

declare global {
  interface Window {
    Kakao: any;
  }
}
export default function KakaoBtn() {
  // 카카오 객체에 앱 키를 세팅합니다.
  const initKakao = () => {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APPKEY);
    console.log(window.Kakao.isInitialized());
  }

  // 카카오 버튼 클릭 시 카카오 객체로부터 로그인 창을 호출합니다.
  const kakaoLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/login/kakao',
    })
  }



  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js"
        integrity='sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx'
        crossOrigin='anonymous'
        strategy="lazyOnload"
        onLoad={() => {
          // 카카오 스크립트 로드 후 처리 될 메소드
          initKakao()
        }}
      />
      <Button
        className={style.sso__btn}
        sx={{ backgroundImage: 'url(/asset/kakao_login_icon.png)' }}
        onClick={kakaoLogin}
      />
    </>
  );
}

