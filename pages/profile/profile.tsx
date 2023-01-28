import Head from 'next/head';
import { Box, Button, Container, Grid, TextField, Typography, Divider, InputBase } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import style from '../../styles/Profile.module.css'
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
    e.target.value.length < 251
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
      <Box className={style.profile__wrapper}>
        <Box className={style.image__wrapper}>
          <Box className={style.image__box} sx={{
            backgroundImage: `url(${user.profileUrl})`,
          }} />
        </Box>
        <Box className={style.intro__box}>
          <Typography className={style.title}>
            Gus-Bms
          </Typography>
          {!isEdit ?
            <Typography>
              {user.intro}
            </Typography>
            : <textarea ref={introRef} onChange={handleOnChange} cols={0} rows={6} value={intro}></textarea>}
          {isError ?
            <Box className={style.error__text} onClick={(e) => handleBtnClick(e)} >
              <Typography>글자수는 250자 이내로 작성해주세요!</Typography>
            </Box>
            : null}
          <Box className={style.edit__button} onClick={(e) => handleBtnClick(e)} >
            <Typography sx={{
              margin: 'auto',
            }}>{!isEdit ? '수정' : '저장'}</Typography>
          </Box>
        </Box>
      </Box>

      {/* 자기가 올린 게시글 리스트 나오기 + 글 작성 + 글 수정 */}
      <Box width='100%' marginTop='10vh'>
        {logList.map((log, idx) => (
          // 대표이미지 사진 영역
          <Box key={idx} className={style.log__wrapper} >
            < Box className={style.image__wrapper} >
              <Box className={style.image__box} sx={{
                // width: '100%',
                // height: '100%',
                backgroundImage: `url(https://log-image.s3.ap-northeast-2.amazonaws.com/fsupload/${log.url})`,
              }} />
            </Box>

            <Link href={`/log/${log.id}`} style={{ width: '80%', textDecoration: 'none' }}>
              <Typography fontSize='1.2rem' fontWeight='600' color='#73797f'>
                {log.title}
              </Typography>
              <Typography>
                {log.content}
              </Typography>
            </Link>
          </Box >
        )
        )}
      </Box>
    </>
  )
}

export default Profile