/**
 * 검색결과로 조회되는 스팟 목록입니다.
 * 스팟 하위에 각 스팟에 등록된 플레이스 로그를 확인할 수 있습니다.
 * 
 * @type component
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
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
  Button,
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

  // TO_DO: DB에서 해당 스팟에 해당하는 게시글 사진 불러오기 (게시글 당 대표 이미지 1장)
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

  /**
   * 스팟 라벨을 클릭할 때 발생하는 이벤트입니다.
   * 현재 선택한 스팟이 이전에 선택했던 스팟과 다를 경우 새로운 스팟 정보를 부모 컴포넌트로 setSpot을 통해 전달합니다.
   * @param spot
   */
  const handleSpotClick = (spot: Spot) => {
    selectedSpot != spot ? (setSpot(
      {
        name: spot.name,
        address: spot.address,
        latitude: spot.latitude,
        longitude: spot.longitude
      })) : null

    selectedSpot = spot
  }

  /**
   * 캐로셀 슬라이드의 위치를 이동시키는 좌우 버튼을 클릭할 때 발생하는 이벤트입니다.
   * 왼쪽 버튼을 클릭할 경우 왼쪽으로 이동하며 오른쪽 버튼을 클릴할경우 오른쪽으로 이동합니다.
   * current state변수는 현재 카드(이미지) 중 몇번째가 앞쪽에 있는가를 의미합니다.
   * 
   * @param position 
   */
  const handleCarouselClick = (position: string) => {
    console.log(position, '!')
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
    if (prevRef.current && nextRef.current) {
      if (current > 0 && current < 4) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__hide)
      }
      if (current == 0) {
        prevRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
      } else if (current == 4) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__hide)
      }
    }
  }, [current])

  return (
    <>
      <Grid
        item
        md={11}>
        <ListItemButton key={spot.spot_pk}
          onClick={() => handleSpotClick(spot)}
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
              <Box ref={trackRef} className={style.track}
                sx={{
                  transform: `translateX(-${(current * 1.3) * 10}%)`
                }}>
                {cards2.map((card, idx) =>
                  <Link key={idx} href={'log/id'}>
                    <Box className={style.card__container}>
                      < Box className={style.card}
                        sx={{
                          backgroundImage: `url(${card.url})`,
                          cursor: 'pointer',
                        }} />
                    </Box>
                  </Link>
                )}
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
          <Box sx={{
            width: '97.5%'
          }}>
            <Link href={'spot/addSpot'}>
              <Button
                sx={{
                  float: 'right',
                  background: 'gray',
                  padding: '10px',
                  color: 'whitesmoke'
                }}
              >로그 남기기</Button>
            </Link>
          </Box>
        </Collapse >
      </Grid >
    </>
  )
}