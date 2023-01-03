import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography, Divider } from '@mui/material';
import { color, width } from '@mui/system';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import Link from 'next/link';

const Profile = () => {
  const [cookies, ,] = useCookies(['uid', 'profilePhoto']);
  const [logList, setLogList] = useState<{ imageUrl: string, title: string, text: string }[]>([])

  let dummyLog = [{
    imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTEk9Q%2FbtrVe31Hlfc%2Fqk1w8wFX98UpfPCitRl9Qk%2Fimg.png',
    title: '여행준비 (1) - Visit Japan 등록',
    text: '일본 여행을 하기 위해선 Visit Japan Web(비짓재팬웹) 이라는 사이트에서 몇가지 정보를 기입해주고, 입국 심사 시 QR 검증을 받아야 입국이 가능하다. 또한 백신을 3차까지 맞지 않았다면, 출발 72시간 전에 PCR 검사를 받고 결과서를 비짓재팬에 등록해주어야 한다. 비짓재팬은 "Visit Japan Web"이란,',
  }, {
    imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTEk9Q%2FbtrVe31Hlfc%2Fqk1w8wFX98UpfPCitRl9Qk%2Fimg.png',
    title: '여행준비 (1) - Visit Japan 등록',
    text: '일본 여행을 하기 위해선 Visit Japan Web(비짓재팬웹) 이라는 사이트에서 몇가지 정보를 기입해주고, 입국 심사 시 QR 검증을 받아야 입국이 가능하다. 또한 백신을 3차까지 맞지 않았다면, 출발 72시간 전에 PCR 검사를 받고 결과서를 비짓재팬에 등록해주어야 한다. 비짓재팬은 "Visit Japan Web"이란,',
  }, {
    imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTEk9Q%2FbtrVe31Hlfc%2Fqk1w8wFX98UpfPCitRl9Qk%2Fimg.png',
    title: '여행준비 (1) - Visit Japan 등록',
    text: '일본 여행을 하기 위해선 Visit Japan Web(비짓재팬웹) 이라는 사이트에서 몇가지 정보를 기입해주고, 입국 심사 시 QR 검증을 받아야 입국이 가능하다. 또한 백신을 3차까지 맞지 않았다면, 출발 72시간 전에 PCR 검사를 받고 결과서를 비짓재팬에 등록해주어야 한다. 비짓재팬은 "Visit Japan Web"이란,',
  }, {
    imageUrl: 'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTEk9Q%2FbtrVe31Hlfc%2Fqk1w8wFX98UpfPCitRl9Qk%2Fimg.png',
    title: '여행준비 (1) - Visit Japan 등록',
    text: '일본 여행을 하기 위해선 Visit Japan Web(비짓재팬웹) 이라는 사이트에서 몇가지 정보를 기입해주고, 입국 심사 시 QR 검증을 받아야 입국이 가능하다. 또한 백신을 3차까지 맞지 않았다면, 출발 72시간 전에 PCR 검사를 받고 결과서를 비짓재팬에 등록해주어야 한다. 비짓재팬은 "Visit Japan Web"이란,',
  }]

  // setLogList(dummyLog)
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
              fontWeight: 400,
              color: '#6c7176'
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
            {dummyLog.map((log, idx) => (
              // 대표이미지 사진 영역
              <Grid
                key={idx}
                container
                sx={{
                  margin: 3,
                  borderTop: '0.1px solid #F1F3F5'
                }}>
                <Grid
                  item
                  alignItems='left'
                  xs={3}
                  sx={{
                  }}>
                  <Box sx={{
                    marginTop: '0.8rem',
                    display: 'block',
                    backgroundSize: 'cover',
                    width: '10rem',
                    height: '10rem',
                    backgroundImage: `url(${log.imageUrl})`,
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '10px'
                  }}>
                  </Box>
                </Grid>
                {/* 타이틀 제목, 본문 내용 영역 */}
                <Grid
                  item
                  textAlign='left'
                  xs={9}
                  sx={{
                    marginTop: '1rem'
                  }}>
                  <Link href='/' style={{ textDecoration: 'none' }}>
                    <Typography fontSize='1.2rem' fontWeight='600' color='#6c7176'>
                      {log.title}
                    </Typography>
                    <Typography sx={{
                      lineHeight: 1.8,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 3,
                      display: '-webkit-inline-box',
                      WebkitBoxOrient: 'vertical',
                      color: '#868E96'
                    }}>
                      {log.text}
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            )
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default Profile