import React, { FunctionComponent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  Collapse,
  ListItemIcon,
  Grid,
  TableRow,
  Box,
  Button,
  TableCell,
  IconButton,
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Spot } from '../map/map'
import { LocalCafe, LocalDining, PhotoCamera, ExpandLess, ExpandMore, StarBorder, NavigateNext } from "@mui/icons-material";
import style from '../../../styles/Spot.module.css'

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
            <DetailSpot spot={spot} setSpot={setSpot} />
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
  const [isOpen, setIsOpen] = useState(false)
  const cards = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12]

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
          <Box className={style.carousel__container}>
            <Box className={style.inner__carousel}>
              <Box className={style.track}>
                {cards.map((card, idx) =>
                  <Box key={idx} className={style.card__container}>
                    < Box className={style.card}
                      sx={{
                        backgroundImage: 'url("https://img1.kakaocdn.net/cthumb/local/R0x420/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Ffiy_reboot%2Fplace%2F4A901A61AC3F4088AF2396A792DEFADA")'
                        // background: 'black'
                      }}>
                      {card}
                    </Box>
                  </Box>
                )
                }

              </Box>
              <Box>
                <IconButton
                  className={style.button__grp}
                  type="button"
                // onClick={() => clickPrev}
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <IconButton
                  className={style.button__grp}
                  type="button"
                  sx={{
                    left: "89.5%"
                  }}
                // onClick={() => clickNext}
                >
                  <NavigateNextIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Collapse >
      </Grid >
    </>
  )
}