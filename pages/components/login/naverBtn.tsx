import { Button } from '@mui/material';
import { useEffect, useRef } from 'react';
import style from '../../../styles/Login.module.css'

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverBtn() {
  const naverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: 'm4dT9OXHh9kWY3Dqz1nq',
      callbackUrl: 'http://localhost:3000/login/naver',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 58 },
      callbackHandle: true,
    })
    naverLogin.init()

    naverLogin.getLoginStatus(function (status: any) {
      if (status) {
        console.log(status, naverLogin.user)
        const nickName = naverLogin.user.getNickName();
        const age = naverLogin.user.getAge();
        const birthday = naverLogin.user.getBirthday();
        console.log(nickName, age, birthday);

        // res.status(200).json({
        //   ok: true,
        //   token: "test",
        // });
      }
    });
  }, [])

  const handleClick = () => {
    // useRef의 initial 값은 null (DOM이 그려지지 않은 상태이기 때문)
    // typeScript에서 에러 발생하기 때문에 current 값이 있는가 && children 값이 Anchor인가를 체크해주어야 합니다.
    if (naverRef.current && naverRef.current.children[0] instanceof HTMLAnchorElement)
      naverRef.current.children[0].click();

  }

  return (
    <>
      <div className={style.naverIdLogin} ref={naverRef} id="naverIdLogin" />
      <Button
        className={style.sso__btn}
        id='naverIdLogin'
        sx={{ backgroundImage: 'url(/asset/naver_login_icon.png)' }}
        onClick={handleClick}
      />
    </>
  );
}

