/**
 * 스팟 게시글 페이지입니다.
 * 스팟에 관한 글을 올릴 수 있고, 사진을 첨부할 수 있습니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import { useRouter } from 'next/router'
import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Grid, Box, IconButton, Typography } from "@mui/material";
import style from '../../styles/Spot.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import axios from 'axios';
import Error404 from '../error_404'
import { useCookies } from 'react-cookie';
import LoadingSpinner from '../components/global/loading';
import { IRootState } from '../../store/modules'
import { useDispatch, useSelector } from 'react-redux';
import { loadingEndAction, loadingStartAction } from '../../store/modules/isLoading';


export default function Log() {
  // Redux store의 state 중 isLogin을 불러오는 hook 입니다.
  const isLoading = useSelector<IRootState, boolean>(state => state.isLoading);
  // reducer isLogin Action 사용
  const dispatch = useDispatch(); // dispatch를 사용하기 쉽게 하는 hook 입니다.

  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [current, setCurrent] = useState<number>(0)
  const [id, setId] = useState<string>('')
  const carouselRef = useRef(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const trackRef = useRef(null)



  const [cookies, , removeCookie] = useCookies(['uid']);

  /**
   * 캐로셀 슬라이드의 위치를 이동시키는 좌우 버튼을 클릭할 때 발생하는 이벤트입니다.
   * 왼쪽 버튼을 클릭할 경우 왼쪽으로 이동하며 오른쪽 버튼을 클릴할경우 오른쪽으로 이동합니다.
   * current state변수는 현재 카드(이미지) 중 몇번째가 앞쪽에 있는가를 의미합니다.
   * 
   * @param position 
   */
  const handleCarouselClick = (position: string) => {
    if (current > 0) {
      position == 'prev' ? setCurrent(current - 1) : setCurrent(current + 1);
    } else if (current == 0) {
      position == 'next' ? setCurrent(current + 1) : null
    }
  }

  /**
   * current state 변수의 값이 변경될 때 발생하는 이벤트 훅입니다.
   * 맨 첫번째 카드일 경우와 맨 마지막일 카드일 경우 그리고 그 외의 경우일 때 좌 우 버튼의 노출 여부를 결정합니다.
   * 
   * @TO_DO 카드의 개수는 동적으로 컨트롤 되어야 합니다.
   */
  useEffect(() => {
    if (images.length > 2 && prevRef.current && nextRef.current) {
      if (current > 0) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__hide)
        prevRef.current.classList.remove(style.btn__hide)
      }
      if (current == 0) {
        prevRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__hide)
      } else if (current == Math.round((images.length + 1) / 1.6)) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__hide)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  useEffect(() => {
    if (images.length > 2 && prevRef.current && nextRef.current) {
      nextRef.current.classList.add(style.btn__show)
      nextRef.current.classList.remove(style.btn__hide)
    }
  }, [images])

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
          console.log(resp.data.r)
          let logArr = resp.data.row
          setTitle(logArr[0].title)
          setContent(logArr[0].content)

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
      {title ? (
        <Grid container>
          {/* 이미지 슬라이더 */
            (Array.isArray(images) && images.length > 0) && (
              <Grid item
                md={12}>
                <Box ref={carouselRef} className={style.carousel__container} width={'100%'}>
                  <Box className={style.inner__carousel}>
                    <Box ref={trackRef} className={style.track}
                      sx={{
                        transform: `translateX(-${(current * 1.12) * 10}%)`
                      }}>
                      {images.map((img, idx) => (
                        <Box key={idx} className={style.card__container}>
                          < Box className={style.card}
                            sx={{
                              backgroundImage: `url(https://log-image.s3.ap-northeast-2.amazonaws.com/fsupload/${img})`,
                              backgroundSize: 'cover',
                              // cursor: 'pointer',
                            }} />
                        </Box>
                      ))}
                    </Box>
                    <Box>
                      <IconButton
                        ref={prevRef}
                        sx={{
                          display: 'none'
                        }}
                        className={`${style.button__grp} ${style.btn__hide}`}
                        type="button"
                        onClick={() => handleCarouselClick('prev')}
                      >
                        <NavigateBeforeIcon
                          sx={{
                            color: 'white',
                            background: 'rgb(75 75 75 / 55%)',
                            borderRadius: '20px'
                          }}
                          fontSize='large' />
                      </IconButton>
                      <IconButton
                        ref={nextRef}
                        className={`${style.button__grp} ${style.btn__hide}`}
                        type="button"
                        sx={{
                          left: "89.5%"
                        }}
                        onClick={() => handleCarouselClick('next')}
                      >
                        <NavigateNextIcon
                          sx={{
                            color: 'white',
                            background: 'rgb(75 75 75 / 55%)',
                            borderRadius: '20px'
                          }}
                          fontSize='large' />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}
          {/* 작성자 */}
          <Grid
            item
            md={12}
            display='inline-flex'>
            <Typography>
              작성자 프로필 사진
            </Typography>
            <Typography sx={{
              marginLeft: 1.5
            }}>
              작성자 이름
            </Typography>
          </Grid>
          {/* 글 */}
          <Grid
            item
            md={12}
          >
            <Typography sx={{
              fontWeight: '600',
              fontSize: '1.7rem'
            }}>
              {title}
            </Typography>
            <Typography sx={{
              lineHeight: '1.9rem',
              marginTop: '1rem',
            }}>
              {content}
            </Typography>
          </Grid>
        </Grid>
      ) : <Error404 text='로그를' />}
    </>
  )
}

