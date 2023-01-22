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
  const [cookies, , removeCookie] = useCookies(['accessToken', 'refreshToken']);
  const router = useRouter()
  const [toast, setToast] = useState<boolean>(false)
  useEffect(() => {
    const query = window.location.search.split('deleteCookie=')[1]
    if (query == 'true') {
      setToast(true)
      removeCookie('accessToken', { path: '/' });
      removeCookie('refreshToken', { path: '/' });
      dispatch(logoutAction());
    }
  }, [])

  useEffect(() => {

  }, [toast])

  return (
    <>
      <Head>
        <title>로그인 | Find Photo</title>
        <meta name="description" content='로그인 페이지입니다.' />
      </Head>
      <Box
        component='main'
        sx={{
          marginTop: '0',
          height: '60vh',
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          // minHeight: '100%',
          // border: '1px solid rgb(236, 238, 242)',
          borderRadius: '10px',
        }}
      >
        {/* Container를 사용하여 중앙에 위치 시킴 */}
        <Container maxWidth="sm">
          <Box sx={{
            marginY: 3,
            // height: '40%',

            textAlign: 'center'
          }}>
            <Typography
              color='textPrimary'
              variant='h4'
              fontWeight='500'
              fontSize='2vw'
              padding='1%'
              paddingBottom='3%'
            >
              Find Photo.
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              간편하게 소셜미디어로 시작해보세요
            </Typography>
          </Box>
          <Grid
            container
            justifyContent='center'
            spacing={1}
          >
            <Grid
              item
              xs={2}
              md={2}
              overflow="hidden"
              textAlign='right'
            >
              <KakaoBtn />
            </Grid>
            <Grid
              item
              xs={2}
              md={2}
              overflow="hidden"
              textAlign="left"
            >
              <NaverBtn />
            </Grid>
          </Grid>
          {/* <Box
            sx={{
              paddingBottom: 1,
              paddingTop: 3
            }}
          >
            <Typography
              align="center"
              color="textSecondary"
              variant="body2"
            >
              이메일로 계속하기
            </Typography>
          </Box>
          <TextField
            // error={true}
            fullWidth
            // helperText
            label="Email Address"
            margin="normal"
            name="email"
            // onBlur={ }
            // onChange={ }
            type="email"
            // value={ }
            variant="outlined"
          />
          <TextField
            // error={true}
            fullWidth
            // helperText
            label="Password"
            margin="normal"
            name="password"
            // onBlur={ }
            // onChange={ }
            type="password"
            // value={ }
            variant="outlined"
          />
          <Box sx={{ paddingY: 2 }}>
            <Button
              className={style.login__btn}
              // disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => {
                router.push({
                  pathname: '/',
                })
              }}
            >
              로그인
            </Button>
          </Box>
          <Divider variant="middle" />
          <Box sx={{
            paddingY: 2,
            marginBottom: '3.2vh'
          }}>
            <Button
              className={style.join__btn}
              // disabled={formik.isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => {
                router.push({
                  pathname: '/join',
                })
              }}
            >
              회원가입
            </Button>
          </Box> */}
        </Container >
      </Box >
      <Box>
        {toast ? <Toast text='로그인 유효기간이 만료되었습니다.' setToast={setToast} /> : null}
      </Box>
    </>
  )
}
export default Login;

