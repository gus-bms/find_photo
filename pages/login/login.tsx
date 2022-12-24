import Image from 'next/image';
import style from '../../styles/Login.module.css'
import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import KakaoBtn from '../components/login/loginKakao';
import NaverBtn from '../components/login/loginNaver';
const Login = () => {
  const router = useRouter()
  const goJoin = () => {
    router.push('/')
  }

  return (
    <>
      <Head>
        <title>로그인 | Find Photo</title>
        <meta name="description" content='로그인 페이지입니다.' />
      </Head>
      <Box
        component='main'
        sx={{
          marginTop: '3%',
          marginX: '00%',
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
          border: '1px solid rgb(236, 238, 242)',
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
              소셜미디어로 계속하기
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
          <Box
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
          </Box>
        </Container >
      </Box >
    </>
  )
}
export default Login;

