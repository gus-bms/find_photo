import React, { FunctionComponent, Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import {
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  Collapse,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Spot } from '../map/map'
import { LocalCafe, LocalDining, PhotoCamera, ExpandLess, ExpandMore } from "@mui/icons-material";
import style from '../../../styles/Spot.module.css'
import Link from 'next/link';

interface Iprops {
  setSpot: Dispatch<SetStateAction<object>>;
  spotList: Spot[]
}

interface Cprops {
  setSpot: Dispatch<SetStateAction<object>>;
  spot: Spot
}

var selectedSpot: Spot;

const FolderList: React.FunctionComponent<Iprops> = ({ spotList, setSpot }: Iprops) => {

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        marginTop: "10px",
      }}
    >
      {spotList.map(spot => (
        <>
          <Grid
            container
          >
            <DetailSpot key={spot.spot_pk} spot={spot} setSpot={setSpot} />
          </Grid>
        </>
      ))
      }
    </List >
  );
};

export default FolderList;

/**
 * 스팟 리스트를 반환합니다.
 * 스팟 리스트 하위에 유저가 올린 게시글이 존재한다면, 슬라이드 형태의 사진 게시글을 반환합니다.
 * 
 * @returns jsx
 */
const DetailSpot: React.FunctionComponent<Cprops> = ({ spot, setSpot }: Cprops) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(0)
  const carouselRef = useRef(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const trackRef = useRef(null)

  const cards2: { url: string, index: number }[] = [
    {
      url: "https://cdn.pixabay.com/photo/2014/12/08/17/52/mare-561221_960_720.jpg",
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

  const handleOnClick = (spot: Spot) => {
    selectedSpot != spot ? (setSpot(
      {
        name: spot.name,
        address: spot.address,
        latitude: spot.latitude,
        longitude: spot.longitude
      })) : console.log('no changed')

    selectedSpot = spot
    console.log('same')
  }

  const handleClick = (position: string) => {
    console.log(position, '!')
    if (current > 0) {
      position == 'prev' ? setCurrent(current - 1) : setCurrent(current + 1);
    } else if (current == 0) {
      position == 'next' ? setCurrent(current + 1) : null
    }
  }

  useEffect(() => {
    if (prevRef.current && nextRef.current) {
      if (current > 0 && current < 4) {
        prevRef.current.style = "display: block"
        nextRef.current.style = "display: block"
      }
      if (current == 0) {
        prevRef.current.style = 'display: none'
        nextRef.current.style = 'display: block'
      } else if (current == 4) {
        prevRef.current.style = 'display: block'
        nextRef.current.style = 'display: none'
      }
    }


    // 이미지 위치 변경
    if (trackRef.current) {
      let move: number
      move = current != 0 ? (current + 0.5) * 10 : current * 10
      trackRef.current.style.transition = 'all 0.2s ease-in-out';
      trackRef.current.style.transform = `translateX(-${move}%)`; // 백틱을 사용하여 슬라이드로 이동하는 에니메이션을 만듭니다.
    }

    console.log(current)
  }, [current])

  return (
    <>
      <Grid
        item
        md={11}>
        <ListItemButton key={spot.spot_pk}
          onClick={() => handleOnClick(spot)}
        >
          <ListItemAvatar>
            <Avatar>
              {spot.category == 'C' ? <LocalCafe /> : (
                spot.category == 'R' ? <LocalDining /> :
                  <PhotoCamera />)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText sx={{
            WebkitTapHighlightColor: 'transparent !important;'
          }}
            primary={spot.name} secondary={spot.address}>
          </ListItemText>
        </ListItemButton>
      </Grid>
      <Grid
        item
        md={1}>
        <Box>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: "black" }}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Grid>
      <Grid
        item
        md={12}
      >
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box ref={carouselRef} className={style.carousel__container}>
            <Box className={style.inner__carousel}>
              <Box ref={trackRef} className={style.track}>
                {cards2.map((card, idx) =>
                  <Link key={idx} href={'login/login'}>
                    <Box className={style.card__container}>
                      < Box className={style.card}
                        sx={{
                          backgroundImage: `url(${card.url})`,
                          cursor: 'pointer'
                        }} />
                    </Box>
                  </Link>
                )
                }

              </Box>
              <Box>
                <IconButton
                  ref={prevRef}
                  sx={{
                    display: 'none'
                  }}
                  className={style.button__grp}
                  type="button"
                  onClick={() => handleClick('prev')}
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
                  onClick={() => handleClick('next')}
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
        </Collapse >
      </Grid >
    </>
  )
}