import Head from 'next/head';
import { Box, Button, Container, Grid, Link, TextField, Typography, Divider } from '@mui/material';
import { color, width } from '@mui/system';
import { useCookies } from 'react-cookie';
import { useState } from 'react';

const Profile = () => {
  const [cookies, ,] = useCookies(['uid', 'profilePhoto']);
  const [logList, setLogList] = useState<string[]>(['안녕하세요', '안녕하세요2'])
  return (
    // 프로필 명과 자기소개 
    <>
      <Head>
        <title>프로필 | Find Photo</title>
        <meta name="description" content='프로필 페이지입니다.' />
      </Head>
      <Grid
        sx={{
          marginTop: '8vh',
        }}
        container
        justifyContent='center'
      >
        <Grid
          item
          xs={2}
          md={3}
          textAlign='center'
        >
          <Grid
            container
            justifyContent='center'>
            <Grid
              item
              xs={6}
              md={12}
              textAlign='right'>
              <Box
                sx={{
                  marginTop: 3,
                  height: '27vh',
                  width: '70%',
                }}
              >
                <Box sx={{
                  marginLeft: 4,
                  display: 'block',
                  backgroundSize: 'cover',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${cookies.profilePhoto})`,
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px'
                }} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={2}
          md={8}
          textAlign='center'
          sx={{
            borderLeft: "0.1px solid #F1F3F5",
            height: '15rem'
          }}
        >
          <Grid
            item
            xs={6}
            md={12}
            textAlign='left'
            sx={{
              marginLeft: '10px'
            }}
          >
            <Typography sx={{
              fontSize: 30,
              fontWeight: 400
            }}>
              Gus-Bms
            </Typography>
            <Typography sx={{
              fontSize: 16,
              fontWeight: 100,
              color: 'darkgray',
              minHeight: 10
            }}>
              안녕하세요, 파인드포토입니다. 파인드포토는 국내에 사진 찍기 좋은 명소를 게시할 수 있고, 여러 사람들이 찍은 추천 장소를 확인할 수 있습니다.
            </Typography>
            <Box sx={{
              width: '3rem',
              display: 'flex',
              alignItems: 'center',
              float: 'right',
              backgroundColor: '#F1F3F5',
              color: 'black',
              marginTop: '6rem',
              height: '1.5rem',
              borderRadius: '10px',
              padding: '10px'
            }}>
              <Typography sx={{
                margin: 'auto',
              }}>수정</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* 자기가 올린 게시글 리스트 나오기 + 글 작성 + 글 수정 */}
      <Grid
        sx={{
          marginTop: '8vh',
          borderTop: '0.1px solid #F1F3F5'
        }}
        container
        justifyContent='center'
      >
        <Grid
          item
          xs={2}
          md={12}
          textAlign='center'
        >
          <Box>
            {logList.map((log, idx) => (
              <p key={idx}>
                {log}
              </p>
            )
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile