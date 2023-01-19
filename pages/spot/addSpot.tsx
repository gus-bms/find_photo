
import Search from "../components/search/search";
import { useEffect, useState } from "react";
import { Spot } from '../components/map/map'
import { Avatar, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, List, ListItemAvatar, Radio, RadioGroup, Typography } from "@mui/material";
import { LocalCafe, LocalDining, PhotoCamera } from "@mui/icons-material";

export default function NestedList() {
  const [keyword, setKeyword] = useState<string>('')
  const [typeList, setTypeList] = useState<string[]>(['C', 'R', 'H'])
  const [spotList, setSpotList] = useState<Spot[]>([]);

  useEffect(() => {
    console.log(keyword)
    // / 장소 검색 객체를 생성합니다
    var ps = new window.kakao.maps.services.Places();

    // 키워드로 장소를 검색합니다
    ps.keywordSearch(keyword, placesSearchCB, { size: 8 });

    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB(data: string | any[], status: any, pagination: any) {
      if (status === window.kakao.maps.services.Status.OK) {

        // TO_DO type 재정의 필요
        setSpotList(data)
        console.log(pagination)

      }
    }
  }, [keyword])


  useEffect(() => {
    console.log(spotList);

  }, [spotList])
  return (
    <>
      <Search keyword={keyword} setKeyword={setKeyword} text="장소를 입력해주세요!" ></Search>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          marginTop: "10px",
        }}
      >
        <RadioGroup
          row

          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="female"
          name="radio-buttons-group"
        >
          {spotList.length > 0 && spotList.map(spot => (
            <>
              {/* <Box sx={{
                display: 'inline-flex',
              }}> */}

              <FormControlLabel key={spot.id} value={spot.address_name} control={<Radio />} label={spot.place_name} sx={{
                width: '40%'
              }} />
              {/* </Box> */}
            </>
          ))
          }
        </RadioGroup>
      </List>
      <Typography>
        유형
      </Typography>
      <Box>
        {typeList.length > 0 && typeList.map((type, idx) => (
          <>
            <Button key={idx}>
              {type}
            </Button>
          </>
        ))
        }
      </Box>
      <Box>
        <Button>
          추가하기
        </Button>
      </Box>
    </>
  );
}
