import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography, Divider } from '@mui/material';
import { color, width } from '@mui/system';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { checkJWT } from '../api/auth/auth'
import Link from 'next/link';
import axios from 'axios';

const Profile = () => {
  const [cookies, ,] = useCookies(['accessToken']);
  const [logList, setLogList] = useState<{ id: string, title: string, content: string, url: string }[]>([])
  const [profileUrl, setProfileUrl] = useState<string>('')

  useEffect(() => {
    const getUser = async () => {
      const user = await axios.get("/api/user/selectUser");
      console.log('user', user)
      setProfileUrl(user.data.user.profileUrl)
      await axios.get("/api/log/selectListLog", {
        params: {
          userPk: user.data.user.userPk,
          type: 'user_pk'
        }
      }).then(resp => {
        if (resp.data.r) {
          let logArr = resp.data.row.map((log: { log_pk: string, title: string; content: string; img_name: string; }) => {
            var rObj: { id: string, title: string, content: string, url: string } = {
              id: '',
              title: '',
              content: '',
              url: ''
            };
            rObj['id'] = log.log_pk
            rObj['title'] = log.title
            rObj['content'] = log.content
            rObj['url'] = log.img_name
            return rObj;
          });
          setLogList(logArr)
        }
      })

    }
    getUser()



  }, [])

  useEffect(() => {
    console.log(logList)
  }, [logList])
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
          xs={3}
          // md={3}
          textAlign='center'
        >
          <Grid
            container
            justifyContent='center'>
            <Grid
              item
              xs={12}
              // md={12}
              textAlign='right'>
              <Box
                sx={{
                  height: '27vh',
                  width: '100%',
                }}
              >
                <Box sx={{
                  marginLeft: 4,
                  display: 'block',
                  backgroundSize: 'cover',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${profileUrl})`,
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px'
                }} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={8}
          // md={8}
          textAlign='center'
          sx={{
            // borderLeft: "0.1px solid #F1F3F5",
            margin: 'auto',
            marginRight: 0,
            height: '15rem'
          }}
        >
          <Grid
            item
            xs={12}
            // md={12}
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
          marginTop: '6vh',
          // borderTop: '0.1px solid #F1F3F5'
        }}
        container
        justifyContent='center'
      >
        <Grid
          item
          xs={12}
          // md={12}
          textAlign='center'
        >
          <Box>
            {logList.map((log, idx) => (
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
                    backgroundImage: `url(https://log-image.s3.ap-northeast-2.amazonaws.com/fsupload/${log.url})`,
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
                  <Link href={`/log/${log.id}`} style={{ textDecoration: 'none' }}>
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
                      {log.content}
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