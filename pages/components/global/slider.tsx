import { FC, useEffect, useState } from "react"
import Image from "next/image"
import { Box, Button, LinearProgress } from "@mui/material"
import style from '../../../styles/Global.module.css'
interface Iprops {
  images: string[]
}

function Slider(props: Iprops) {
  const [current, setCurrent] = useState<number>(0)
  useEffect(() => {
    console.log(props.images)
  }, [])

  const handleCarouselClick = (position: string) => {
    console.log(props.images.length)
    if (current > 0 && current != props.images.length - 1) {
      position == 'prev' ? setCurrent((current => current - 1)) : setCurrent((current => current + 1))
    } else if (current == 0) {
      position == 'next' ? setCurrent((current => current + 1)) : null
    } else if (position == 'prev' && current == props.images.length - 1) {
      setCurrent((current => current - 1))
    }
  }

  useEffect(() => {
    console.log(current)
  }, [current])
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box className={style.slider__wrapper}>
          <Box className={style.image__wrapper} sx={{
            transform: `translateX(-${(current * 33.333)}%)`
          }}>
            {
              props.images.length > 0 && (
                props.images.map((img, idx) => (
                  <Box className={style.image__box} key={idx} sx={{ backgroundImage: `url(https://log-image.s3.ap-northeast-2.amazonaws.com/fsupload/${img})` }} />
                ))
              )
            }

          </Box>
        </Box>
      </Box>
      {
        props.images.length > 0 &&
        <Box>
          <LinearProgress variant="determinate" value={(current + 1) / props.images.length * 100} sx={{
            backgroundColor: '#f3f3f3',
            // color: 'black',
            '.css-5xe99f-MuiLinearProgress-bar1': {
              backgroundColor: '#868e96',
            }
          }} />
        </Box>
      }
      <Box className={style.button__wrapper}>
        <Button onClick={() => handleCarouselClick('prev')}>
          test
        </Button>
        <Button className={style.next__button} onClick={() => handleCarouselClick('next')}>
          test
        </Button>
      </Box>
    </>
  )
}

export default Slider