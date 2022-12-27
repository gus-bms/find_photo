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
    /**
     * Naver 객체를 초기화 해주는 함수입니다.
     * @param clientId Naver에 등록한 앱의 클라이언트 id 입니다.
     * @param callbackUrl Naver에 등록한 앱의 리다이렉트 url 입니다.
     * @param isPopup 로그인 창을 팝업에 띄우는지 결정합니다.
     * @param loginButton 로그인 버튼의 속성을 결정합니다.
     */
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: 'm4dT9OXHh9kWY3Dqz1nq',
      callbackUrl: 'http://localhost:3000/login/naver',
      isPopup: false,
      loginButton: { color: 'green', type: 3, height: 58 },
      callbackHandle: true,
    })
    naverLogin.init()
  }, [])

  /**
   * Naver에서 제공해주는 로그인버튼을 사용하지 않고 커스텀된 버튼을 사용하기 위한 함수입니다.
   * Naver에서 제공해주는 버튼의 css 를 가리고 커스텀 버튼 클릭 시 Naver 버튼의 클릭 함수가 실행됩니다.
   */
  const handleClick = () => {
    // useRef의 initial 값은 null 입니다. (DOM이 그려지지 않은 상태이기 때문)
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

