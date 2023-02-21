/**
 * 로그인 화면입니다.
 * 소셜 로그인 (카카오, 네이버)를 통해 로그인할 수 있습니다.
 * 각 버튼 클릭 시 해당 oAuth에 등록한 redirect URL이 호출됩니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 * @TO_DO Google Login 추가 / 회원가입 제거 / UI 변경
 */


import style from '../../styles/Login.module.css'
import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import KakaoBtn from '../components/login/kakaoBtn';
import NaverBtn from '../components/login/naverBtn';
import Toast from '../components/global/toast';

import { logoutAction } from '../../store/modules/isLogin';

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from "react";
import { useCookies } from 'react-cookie'; // useCookies import

const Login = () => {
  // Redux store의 state 중 isLogin을 불러오는 hook 입니다.
  // reducer isLogin Action 사용
  const dispatch = useDispatch(); // dispatch를 사용하기 쉽게 하는 hook 입니다.
  const [cookies, , removeCookie] = useCookies(['accessToken', 'refreshToken', 'uid']);
  const router = useRouter()
  const [toast, setToast] = useState<boolean>(false)
  useEffect(() => {
    const query = window.location.search.split('deleteCookie=')[1]
    if (query == 'true') {
      setToast(true)
      removeCookie('accessToken', { path: '/' });
      removeCookie('refreshToken', { path: '/' });
      removeCookie('uid', { path: '/' });
      dispatch(logoutAction());
    }
  }, [])

  useEffect(() => {

  }, [toast])

  useEffect(() => {
    const decodeUri = decodeURI(window.location.search).split('?next=')[1];
    if (decodeUri)
      window.localStorage.setItem('nextUrl', decodeUri)
  }, [])

  return (
    <>
      <Head>
        <title>로그인 | Find Photo</title>
        <meta name="description" content='로그인 페이지입니다.' />
      </Head>
      <Box className={style.login__box} component='main'>
        {/* Container를 사용하여 중앙에 위치 시킴 */}
        <Container>
          <Box>
            <Typography className={style.login__text} fontSize='x-large'>
              Find Photo.
            </Typography>
            <Typography className={style.login__text} sx={{ paddingBottom: '3vh' }}>
              간편하게 소셜미디어로 시작해보세요
            </Typography>
          </Box>
          <Grid container justifyContent='center' spacing={1} >
            <Grid item overflow="hidden" textAlign='right' >
              <KakaoBtn />
            </Grid>
            <Grid item overflow="hidden" textAlign="left" >
              <NaverBtn />
            </Grid>
          </Grid>
        </Container >
      </Box >
      <Box>
        {toast ? <Toast text='로그인 유효기간이 만료되었습니다.' setToast={setToast} /> : null}
      </Box>
    </>
  )
}
export default Login;

