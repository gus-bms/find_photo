import { FC, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Avatar, Box, Button, LinearProgress, Typography } from "@mui/material"
import style from '../../../styles/Global.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Link from "next/link";
import router from "next/router";

interface Iprops {
  images: string[] | { url: string, logPk: string, title?: string, name: string, profile_url: string }[],
  page: string,
}
function Slider(props: Iprops) {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [current, setCurrent] = useState<number>(0)
  const [xValue, setXValue] = useState<number>(!isMobile ? -530 : -605)
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    if (wrapperRef.current != null && props.images.length > 1) {
      let nodeArr = wrapperRef.current.childNodes
      let fristNode = nodeArr[0];
      let secondNode = nodeArr[1]
      let thirdNode = nodeArr[props.images.length - 2];
      let lastNode = nodeArr[props.images.length - 1]

      wrapperRef.current.append(fristNode.cloneNode(true));
      wrapperRef.current.append(secondNode.cloneNode(true));
      wrapperRef.current.insertBefore(lastNode.cloneNode(true), wrapperRef.current.firstElementChild);
      wrapperRef.current.insertBefore(thirdNode.cloneNode(true), wrapperRef.current.firstElementChild);
      // }
    } else {
      setXValue(90)
    }

  }, [])

  const handleLogCarousel = (position: string) => {
    if (current > 0 && current != props.images.length - 1) {
      position == 'prev' ? setCurrent((current => current - 1)) : setCurrent((current => current + 1))
    } else if (current == 0) {
      position == 'next' ? setCurrent((current => current + 1)) : null
    } else if (position == 'prev' && current == props.images.length - 1) {
      setCurrent((current => current - 1))
    }
  }

  const handleMainCarousel = (position: string) => {
    if (current > -1 && current < props.images.length && wrapperRef.current != null) {

      wrapperRef.current.style.transition = '0.5s ease-out'
      position == 'prev'
        ? (
          setXValue((x => x + 310)),
          setCurrent((current => current - 1))
        ) : (
          setCurrent((current => current + 1)),
          setXValue((x => x - 310))
        )
    }
  }

  useEffect(() => {
    // 마지막으로 이동해야할 때
    console.log(current)

    if (current == -1) {
      let lVar = (!isMobile ? 530 : 605) + ((props.images.length - 1) * 310)
      setTimeout(function () {
        if (wrapperRef.current != null) {
          //0.5초동안 복사한 첫번째 이미지에서, 진짜 첫번째 위치로 이동
          wrapperRef.current.style.transition = `${0}s ease-out`;
          setXValue(Number.parseInt(`-${lVar}`))
          setCurrent(props.images.length - 1)
        }
      }, 500);


      // 처음으로 이동해야할 때
    } else if (current == (props.images.length)) {
      setTimeout(function () {
        if (wrapperRef.current != null) {
          //0.5초동안 복사한 첫번째 이미지에서, 진짜 첫번째 위치로 이동
          wrapperRef.current.style.transition = `${0}s ease-out`;
          setXValue(!isMobile ? -530 : -605)
          setCurrent(0)
        }
      }, 500);
    }
  }, [current])

  if (props.page == 'log') {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box className={style.slider__wrapper} width='300px'>
            <Box className={style.image__wrapper} sx={{
              transform: `translateX(-${(current * (1 / props.images.length * 100))}%)`
            }}>
              {
                props.images.length > 0 && (
                  props.images.map((img, idx) => (
                    <Box className={style.image__box} key={idx} sx={{
                      backgroundImage: `url(https://log-image.s3.ap-northeast-2.amazonaws.com/fsupload/${img})`
                    }} />
                  ))
                )
              }

            </Box>
          </Box>
        </Box>
        {
          props.images.length > 0 &&
          <Box className={style.progress__wrapper}>
            <Box sx={{ width: '300px' }}>
              <LinearProgress variant="determinate" value={(current + 1) / props.images.length * 100} sx={{
                backgroundColor: '#f3f3f3',
                '.css-5xe99f-MuiLinearProgress-bar1': {
                  backgroundColor: '#868e96',
                }
              }} />
            </Box>
          </Box>
        }
        <Box className={style.button__wrapper}>
          <Button disableRipple className={style.prev__button} onClick={() => handleLogCarousel('prev')}
            sx={{
              ':hover': {
                bgcolor: '#00ff0000', // theme.palette.primary.main
              },
            }}>
            <NavigateBeforeIcon />
          </Button>
          <Button disableRipple className={style.next__button} onClick={() => handleLogCarousel('next')}
            sx={{
              ':hover': {
                bgcolor: '#00ff0000', // theme.palette.primary.main
              },
            }}>
            <NavigateNextIcon />
          </Button>
        </Box>
      </>
    )
  } else if (props.page == 'index') {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box className={style.slider__wrapper} width='500px'>
            <Box ref={wrapperRef} className={style.image__wrapper} sx={{
              transform: `translateX(${xValue}px)`
            }}>
              {
                props.images.length > 0 && (
                  props.images.map((img, idx) => (
                    <Box key={idx} position="relative" >
                      <Box ref={imgRef} className={style.image__box} sx={{
                        backgroundImage: typeof img == 'object' ? `url(https://log-image.s3.ap-northeast-2.amazonaws.com/fsupload/${img.url})` : null,
                        marginLeft: '10px'
                      }} onClick={() => typeof img == 'object' && router.push(`log/${img.logPk}`)} />
                      <Box className={style.profile__wrapper}>
                        <Avatar alt="Remy Sharp" src={typeof img == 'object' ? img.profile_url : ''} />
                        <Typography> {typeof img == 'object' && img.name} </Typography>
                      </Box>
                      <span className={style.title}>{typeof img == 'object' && img.title}</span>
                    </Box>
                  ))
                )
              }
            </Box>
            <Button disableRipple className={style.prev__button} onClick={() => handleMainCarousel('prev')} sx={{
              width: !isMobile ? '95px' : '10px',
              display: props.images.length == 1 ? 'none' : null,
            }} />
            <Button disableRipple className={style.next__button} onClick={() => handleMainCarousel('next')} sx={{
              width: !isMobile ? '95px' : '10px',
              display: props.images.length == 1 ? 'none' : null,
              right: 0
            }} />
          </Box>
        </Box>
      </>
    )
  } else {
    return (
      <>
      </>
    )
  }
}

export default Slider