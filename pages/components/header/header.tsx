import Link from "next/link";
import style from '../../../styles/Header.module.css'
import { Grid, Typography, Divider } from '@mui/material';

import { logoutAction } from '../../../store/modules/isLogin';
import { IRootState } from '../../../store/modules'

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from "react";
import { useCookies } from 'react-cookie'; // useCookies import

export const Header = () => {
  const isLogin = useSelector<IRootState, boolean>(state => state.isLogin); // store의 state를 불러오는 hook   store의 state 중에서 count의 state를 불러온다.
  // reducer isLogin Action 사용
  const dispatch = useDispatch(); // dispatch를 사용하기 쉽게 하는 hook
  const [, , removeCookie] = useCookies(['id']);
  const onlogoutAction = useCallback(() => { // useCallback은 최적화를 위한 hook이다 이 앱에선 굳이 사용 안 해도 되는데 습관이 들면 좋기에 사용.

    removeCookie('id', { path: '/' });
    dispatch(logoutAction());

  }, []);

  useEffect(() => {
    console.log('hi')
    if (document.cookie.split('id').length == 1)
      dispatch(logoutAction());
  }, [])
  return (
    <>
      <Grid
        container
        spacing={1}
        marginTop={1}
      >
        <Grid
          item
          xs={12}
          md={6}
          textAlign='left'
        >
          <Link className={style.logo} href='/'>
            <Typography >Find Photo</Typography>
          </Link>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          textAlign='right'
        >
          {isLogin
            ? <Link onClick={onlogoutAction} className={style.login} href='/login/login'>
              <Typography>로그아웃</Typography>
            </Link>
            : <Link className={style.login} href='/login/login'>
              <Typography>로그인</Typography>
            </Link>
          }
        </Grid>
        <Divider />
      </Grid>
    </>
  )
}

export default Header;