import style from '../styles/Login.module.css'
import { Box, Button, Container, Grid, Link, TextField, Typography, Divider } from '@mui/material';
import KakaoBtn from '../pages/component/loginKakao';
import NaverBtn from '../pages/component/loginNaver';
const Login = () => {

  return (
    <Box
      component='main'
      sx={{
        marginTop: '10%',
        marginX: '20%',
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
            fontSize='3vw'
            padding='1%'
          >
            Find Photo.
          </Typography>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body1"
          >
            소셜미디어로 계속하기
          </Typography>
        </Box>
        <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xs={12}
            md={6}
            overflow="hidden"
            textAlign='right'
          >
            <KakaoBtn />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
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
            variant="body1"
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
          >
            회원가입
          </Button>
        </Box>
      </Container >
    </Box >

  )
}
export default Login;

