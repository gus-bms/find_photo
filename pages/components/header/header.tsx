import Link from "next/link";
import style from '../../../styles/Header.module.css'
import { Box, Button, Container, Grid, TextField, Typography, Divider } from '@mui/material';
import { useState } from "react";
export const Header = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
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
            ? <Link className={style.login} href='/login/login'>
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