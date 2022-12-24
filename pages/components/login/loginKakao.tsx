import { useRef } from 'react';
import { Button } from '@mui/material';
import style from '../../../styles/Login.module.css'
import Script from 'next/script';
import { NextRouter, useRouter } from 'next/router';

declare global {
  interface Window {
    Kakao: any;
  }
}
export default function KakaoBtn() {
  const initKakao = () => {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APPKEY);
    console.log(window.Kakao.isInitialized());
  }

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
          // kakao = window.kakao;
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

