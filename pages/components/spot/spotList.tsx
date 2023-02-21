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
import { Spot } from '../map/map'
import { LocalCafe, LocalDining, PhotoCamera, ExpandLess, ExpandMore } from "@mui/icons-material";
import style from '../../../styles/Spot.module.css'
import Link from 'next/link';
import axios from 'axios';
import Slider from '../global/slider';

interface Iprops {
  setSpot: Dispatch<SetStateAction<object>>;
  spotList: Spot[]
}

interface Cprops {
  setSpot: Dispatch<SetStateAction<object>>;
  spot: Spot
}

let selectedSpot: Spot;

const SpotList: React.FunctionComponent<Iprops> = ({ spotList, setSpot }: Iprops) => {

  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        marginTop: "10px",
      }}
    >
      {spotList.length > 0 && spotList.map(spot => (
        <Grid
          container
          key={spot.spot_pk}
          marginBottom='2vh'
        >
          <DetailSpot spot={spot} setSpot={setSpot} />
        </Grid>
      ))
      }
    </List >
  );
};

export default SpotList;

/**
 * 스팟 리스트를 반환합니다.
 * 스팟 리스트 하위에 유저가 올린 게시글이 존재한다면, 슬라이드 형태의 사진 게시글을 반환합니다.
 * 
 * @returns jsx
 */
const DetailSpot: React.FunctionComponent<Cprops> = ({ spot, setSpot }: Cprops) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [spotPk, setSpotPk] = useState<number>()
  const [images, setImages] = useState<{ logPk: string, url: string, title: string, name: string, profile_url: string }[]>([])

  /**
   * 스팟 라벨을 클릭할 때 발생하는 이벤트입니다.
   * 현재 선택한 스팟이 이전에 선택했던 스팟과 다를 경우 새로운 스팟 정보를 부모 컴포넌트로 setSpot을 통해 전달합니다.
   * @param spot
   */
  const handleSpotClick = (spot: Spot) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })

    selectedSpot != spot ? (setSpot(
      {
        name: spot.name,
        address: spot.address,
        latitude: spot.latitude,
        longitude: spot.longitude
      })) : null

    selectedSpot = spot
  }

  const handleCollapsClick = (spotPk: number) => {
    setIsOpen(!isOpen)
    setSpotPk(spotPk)
  }

  useEffect(() => {
    if (spotPk == undefined) {
      return
    }
    axios.get("/api/log/selectListLog", {
      params: {
        spotPk: spotPk,
        type: 'spot_pk'
      }
    }).then(resp => {
      if (resp.data.r) {
        let logArr = resp.data.row.map((log: { log_pk: number, img_name: string, title: string, name: string, profile_url: string }) => {
          var rObj: { logPk: string, url: string, title: string, profile_url: string, name: string } = {
            logPk: '',
            url: '',
            title: '',
            profile_url: '',
            name: '',
          }
          rObj['logPk'] = log.log_pk.toString()
          rObj['url'] = log.img_name
          rObj['title'] = log.title
          rObj['profile_url'] = log.profile_url
          rObj['name'] = log.name
          return rObj
        })
        setImages(logArr)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotPk])

  return (
    <>
      <Grid item className={style.spot__list__Box} sx={{ marginBottom: '' }} md={11}>
        <ListItemButton sx={{ padding: 0 }} key={spot.spot_pk}
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
        sx={{
          justifyContent: 'center',
          display: 'flex',
        }}
        md={1}>
        <Box>
          <IconButton
            onClick={() => spot.spot_pk != undefined && handleCollapsClick(spot.spot_pk)}
            style={{ color: "black" }}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Grid>
      <Grid
        item
        md={12}
        width={'100%'}
      >
        <Collapse in={isOpen} timeout="auto" unmountOnExit sx={{ width: '100%', position: 'relative', marginBottom: '6vh' }}>
          {images.length > 0 &&
            <Slider images={images} page='index'></Slider>
          }
          <Box sx={{
            marginRight: '4vw'
          }}>
            <Link className={style.none__underline} href={`log/addLog?address_dong=${spot.address_dong}&spot=${spotPk}`}>
              <Button disableRipple>로그 남기기</Button>
            </Link>
          </Box>
        </Collapse >
      </Grid >
    </>
  )
}