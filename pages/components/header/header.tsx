/**
 * 로고와 로그인 정보를 담고있는 Header 입니다.
 * 로그인 성공 시 Redux를 사용하여 로그인 정보를 저장합니다.
 *
 * @type component
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import Link from "next/link";
import style from '../../../styles/Header.module.css'
import { Grid, Typography, Divider } from '@mui/material';

import { loginAction, logoutAction } from '../../../store/modules/isLogin';
import { IRootState } from '../../../store/modules'

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from "react";
import { useCookies } from 'react-cookie'; // useCookies import

export const Header = () => {
  // Redux store의 state 중 isLogin을 불러오는 hook 입니다.
  const isLogin = useSelector<IRootState, boolean>(state => state.isLogin);
  // reducer isLogin Action 사용
  const dispatch = useDispatch(); // dispatch를 사용하기 쉽게 하는 hook 입니다.
  const [cookies, , removeCookie] = useCookies(['uid']);

  /**
   * 로그아웃 버튼을 클릭하면 쿠키에서 uid 값을 삭제합니다.
   * Redux의 isLogin 값을 변경해줍니다.
   */
  const onlogoutAction = useCallback(() => {
    removeCookie('uid', { path: '/' });
    dispatch(logoutAction());
  }, []);

  /**
   * 최초 렌더링 시 쿠키에 값에 따라 헤더의 로그인 영역을 변경합니다.
   */
  useEffect(() => {
    cookies.uid != undefined ? dispatch(loginAction()) : dispatch(logoutAction())
  }, [])

  return (
    <>
      <Grid
        container
        // justifyContent='center'
        spacing={1}
        marginTop={1}
      >
        <Grid
          item
          xs={10}
          md={8}
          textAlign='left'
        >
          <Link className={style.logo} href='/'>
            <Typography >Find Photo</Typography>
          </Link>
        </Grid>
        {/* <Grid
          item
          xs={2}
          md={2}
          textAlign='right'
        > */}
        {isLogin
          ?
          <>
            <Grid
              item
              xs={2}
              md={2}
              textAlign='right'
            >
              <Link className={style.login} href={`/profile/profile`}>
                <Typography>나의 글</Typography>
              </Link>
            </Grid>
            <Grid
              item
              xs={2}
              md={2}
              textAlign='right'
            >
              <Link onClick={onlogoutAction} className={style.login} href='/login/login'>
                <Typography>로그아웃</Typography>
              </Link>
            </Grid>
          </>
          : <>
            <Grid
              item
              xs={2}
              md={4}
              textAlign='right'
            >
              <Link className={style.login} href='/login/login'>
                <Typography>로그인</Typography>
              </Link>
            </Grid>
          </>
        }
        {/* </Grid> */}
        <Divider />
      </Grid>
    </>
  )
}

export default Header;