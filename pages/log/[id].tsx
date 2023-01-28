/**
 * 스팟 게시글 페이지입니다.
 * 스팟에 관한 글을 올릴 수 있고, 사진을 첨부할 수 있습니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Grid, Box, IconButton, Typography, Avatar } from "@mui/material";
import style from '../../styles/Spot.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import axios from 'axios';
import Error404 from '../error_404'
import { useCookies } from 'react-cookie';
import LoadingSpinner from '../components/global/loading';
import style2 from '../../styles/Log.module.css'
import Slider from '../components/global/slider';

export default function Log() {

  const [images, setImages] = useState<string[]>([])
  const [log, setLog] = useState<{ name: string, profile_url: string, title: string, content: string }>()
  const [id, setId] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [cookies, ,] = useCookies(['uid']);

  useEffect(() => {
    setId(window.location.pathname.split('/log/')[1])
  }, [])

  useEffect(() => {
    if (id != '') {
      axios.get("/api/log/selectLog", {
        params: {
          logPk: id,
          uid: cookies
        }
      }).then(resp => {
        if (resp.data.r) {
          let logArr = resp.data.row
          setLog(logArr[0]);
          console.log(logArr)
          setIsLoading(false)
          if (resp.data.isImgLog) {
            let imgNames: string[] = [];
            logArr.map((log: { img_name: string; }) => {
              imgNames.push(log.img_name)
            })
            setImages(imgNames)
          }
        } else {

        }
      })
    }

  }, [id])

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {log ? (
        <>
          {/* 이미지 슬라이더 */
            (Array.isArray(images) && images.length > 0) && (
              <Slider page='log' images={images}></Slider>
            )}
          {/* 작성자 */}
          <Box className={style2.profile__wrapper}>
            <Avatar alt="Remy Sharp" src={log.profile_url} />
            <Typography> {log.name} </Typography>
          </Box>

          {/* 글 */}
          <Typography sx={{
            fontWeight: '600',
            fontSize: '1.7rem'
          }}>
            {log.title}
          </Typography>
          <Typography sx={{
            lineHeight: '1.9rem',
            marginTop: '1rem',
          }}>
            {log.content}
          </Typography>
        </>
      ) : <Error404 text='로그를' />}
    </>
  )
}

