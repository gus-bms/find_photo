import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography, Divider, InputBase } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Profile = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [logList, setLogList] = useState<{ id: string, title: string, content: string, url: string }[]>([])
  const [user, setUser] = useState<{ userPk: string, profileUrl: string, intro: string }>({
    userPk: '',
    profileUrl: '',
    intro: ''
  })
  const [intro, setIntro] = useState<string>('')
  const introRef = useRef<HTMLTextAreaElement | null>(null)
  const [isError, setIsError] = useState<boolean>(false)

  const handleOnChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.value.length < 351
      ? (setIntro(e.target.value),
        setIsError(false))
      : setIsError(true)
  }

  /**
   * user 정보를 가져오는 함수입니다.
   */
  const getUser = async () => {
    const user = await axios.get("/api/user/selectUser")
    console.log(user.data.user.intro)
    setUser((prevUser) => {
      let newUser = { ...prevUser }
      newUser['intro'] = user.data.user.intro
      return newUser
    })
    setIntro(user.data.user.intro)
  }

  /**
   * 프로필 소개를 수정하거나 저장합니다.
   * @param e
   */
  const handleBtnClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isError) {
      const target = e.currentTarget;
      if (target.innerText == '저장') {
        if (user.intro.toString() !== intro.toString()) {
          console.log('hi')
          const resp = await axios.post('/api/user/updateUser', {
            intro: intro
          })

          resp.data.ok &&
            getUser()
        }
      }
      setIsEdit(!isEdit)
    }
  }

  /**
   * 프로필 버튼이 수정으로 변경될 경우 포커싱해줍니다.
   */
  useEffect(() => {
    if (introRef.current)
      introRef.current.focus()
  }, [isEdit])

  /**
   * 최초 접속 시 발생하는 hook입니다.
   */
  useEffect(() => {
    const getUser = async () => {
      const user = await axios.get("/api/user/selectUser")
      setUser(user.data.user)
      setIntro(user.data.user.intro)

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

  return (
    // 프로필 명과 자기소개 
    <>
      <Head>
        <title>프로필 | Find Photo</title>
        <meta name="description" content='프로필 페이지입니다.' />
      </Head>
      <Grid
        sx={{
          marginTop: '2.5vh',
        }}
        container
        justifyContent='center'
      >
        <Grid
          item
          xs={3}
          textAlign='center'
        >
          <Box
            sx={{
              height: '27vh',
              width: '100%',
            }}
          >
            <Box sx={{
              display: 'block',
              backgroundSize: 'cover',
              width: '100%',
              height: '100%',
              backgroundImage: `url(${user.profileUrl})`,
              backgroundRepeat: 'no-repeat',
              borderRadius: '10px'
            }} />
          </Box>
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
              marginLeft: '10px',
              height: '27vh',
              position: 'relative'
            }}
          >
            <Typography sx={{
              fontSize: 30,
              fontWeight: 400,
              color: '#6c7176'
            }}>
              Gus-Bms
            </Typography>
            {!isEdit ?
              <Typography sx={{
                fontSize: 16,
                fontWeight: 100,
                color: 'darkgray',
                minHeight: 10,
                wordWrap: 'break-word'
              }}>
                {user.intro}
              </Typography>
              : <><textarea ref={introRef} onChange={handleOnChange} style={{
                width: '100%',
                lineHeight: '1.5',
                fontSize: 16,
                fontWeight: 100,
                color: 'black',
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                minHeight: 10,
                border: 'none',
                // outline: 'none',
                resize: 'none'
              }} name="Text1" cols={0} rows={6} value={intro}></textarea></>}
            {isError ?
              <Box onClick={(e) => handleBtnClick(e)} sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                color: 'red',
                marginTop: '6rem',
                height: '1.5rem',
                borderRadius: '10px',
                padding: '10px',
              }}>
                <Typography>글자수는 350자 이내로 작성해주세요!</Typography>
              </Box>
              : null}
            <Box onClick={(e) => handleBtnClick(e)} sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '3rem',
              display: 'flex',
              alignItems: 'center',
              float: 'right',
              backgroundColor: '#F1F3F5',
              color: 'black',
              marginTop: '6rem',
              height: '1.5rem',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer'
            }}>
              <Typography sx={{
                margin: 'auto',
              }}>{!isEdit ? '수정' : '저장'}</Typography>
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
                  borderTop: '0.1px solid #F1F3F5',
                  marginTop: '3vh'
                }}>
                <Grid
                  item
                  alignItems='left'
                  xs={3}
                  sx={{
                    width: '20vw',
                    height: '22vh',
                    marginTop: '1.4vh'
                  }}>
                  <Box sx={{
                    display: 'block',
                    backgroundSize: 'cover',
                    width: '100%',
                    height: '100%',
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
                    marginTop: '1.4vh',
                    // marginLeft: '2vw',
                    // width:
                  }}>
                  <Link href={`/log/${log.id}`} style={{ textDecoration: 'none' }}>
                    <Typography fontSize='1.2rem' fontWeight='600' color='#6c7176' sx={{ marginLeft: '2vw' }}>
                      {log.title}
                    </Typography>
                    <Typography sx={{
                      lineHeight: 1.8,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 3,
                      display: '-webkit-inline-box',
                      WebkitBoxOrient: 'vertical',
                      color: '#868E96',
                      height: '100%',
                      marginLeft: '2vw'
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