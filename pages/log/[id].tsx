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

export async function getServerSideProps({ query: { id } }: { query: { id: string } }) {
  return {
    props: {
      id,
    },
  };
}

export default function Log({ id }: { id: string }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([])
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [current, setCurrent] = useState<number>(0)
  const carouselRef = useRef(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const trackRef = useRef(null)

  // TO_DO: DB에서 해당 스팟에 해당하는 게시글 사진 불러오기 (게시글 당 대표 이미지 1장)
  const cards2: { url: string, index: number }[] = [
    {
      url: "/asset/kakao_login_icon.png",
      index: 1
    }, {
      url: "https://cdn.pixabay.com/photo/2014/08/29/03/02/horse-430441_960_720.jpg",
      index: 2

    }, {
      url: "https://cdn.pixabay.com/photo/2016/08/11/23/48/italy-1587287_960_720.jpg",
      index: 3
    }, {
      url: "https://cdn.pixabay.com/photo/2016/11/14/04/45/elephant-1822636_960_720.jpg",
      index: 4
    }, {
      url: "https://cdn.pixabay.com/photo/2018/08/21/23/29/fog-3622519_960_720.jpg",
      index: 5
    }
  ]

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
    console.log(images.length, current)
    if (prevRef.current && nextRef.current) {
      if (current > 0 && current < 4) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__hide)
      }
      if (current == 0) {
        prevRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
      } else if (images.length - current == 4) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__hide)
      }
    }
  }, [current])

  useEffect(() => {
    axios.get("/api/log/selectLog", {
      params: {
        logPk: id
      }
    }).then(resp => {
      if (resp.data.r) {
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
      }
    })

  }, [])

  useEffect(() => {
    console.log(images)
  }, [images])

  return (
    <>
      <Grid container>
        {/* 이미지 슬라이더 */
          (Array.isArray(images) && images.length > 0) && (
            <Grid item
              md={12}>
              <Box ref={carouselRef} className={style.carousel__container} width={'100%'}>
                <Box className={style.inner__carousel}>
                  <Box ref={trackRef} className={style.track}
                    sx={{
                      transform: `translateX(-${(current * 1.3) * 10}%)`
                    }}>
                    {images.map((img, idx) => (
                      <Box key={idx} className={style.card__container}>
                        < Box className={style.card}
                          sx={{
                            backgroundImage: `url(/uploads/${img})`,
                            backgroundSize: 'cover',
                            cursor: 'pointer',
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
                      className={style.button__grp}
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
                      className={style.button__grp}
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
    </>
  );
}

