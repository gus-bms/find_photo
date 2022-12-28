import React, { FunctionComponent, Dispatch, SetStateAction, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import { Spot } from '../map/map'
import { LocalCafe, LocalDining, PhotoCamera } from "@mui/icons-material";

interface SpotList {
  spotList: Spot[]
}

interface Iprops {
  setSpot: Dispatch<SetStateAction<object>>;
  spotList: Spot[]
}
var selectedSpot: Spot;

const FolderList: React.FunctionComponent<Iprops> = ({ spotList, setSpot }: Iprops) => {


  const handleOnClick = (spot: Spot) => {
    console.log('hi')
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
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        marginTop: "10px",
      }}
    >
      {spotList.map(spot => (
        <ListItem key={spot.spot_pk}
          onClick={() => handleOnClick(spot)}>
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
            primary={spot.name} secondary={spot.address} />
        </ListItem>
      ))
      }
    </List >
  );
};

export default FolderList;
