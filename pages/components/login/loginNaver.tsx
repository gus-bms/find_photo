import { Button } from '@mui/material';
import style from '../../../styles/Login.module.css'

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverBtn() {
  const login = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
      callbackUrl: 'http://localhost:3000/oauth/naver',
      isPopup: false,
      // loginButton: { color: 'green', type: 3, height: 58 },
      callbackHandle: true,
    })
    // console.log(naverLogin)
    naverLogin.init()
  }


  return (
    <>
      <Button
        className={style.sso__btn}
        id='naverIdLogin'
        sx={{ backgroundImage: 'url(/asset/naver_login_icon.png)' }}
        onClick={login}
      />
    </>
  );
}

