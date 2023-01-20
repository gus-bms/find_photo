
import Search from "../components/search/search";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Spot } from '../components/map/map'
import { Avatar, Box, Button, FormControl, FormControlLabel, FormLabel, Grid, List, ListItemAvatar, Radio, RadioGroup, Typography } from "@mui/material";
import { LocalCafe, LocalDining, PhotoCamera } from "@mui/icons-material";
import style from '../../styles/Spot.module.css'
import axios from "axios";
import Toast from '../components/global/toast'

export default function NestedList() {
  const [keyword, setKeyword] = useState<string>('')
  const [typeList, setTypeList] = useState<string[]>(['C', 'R', 'H'])
  const [spotList, setSpotList] = useState<Spot[]>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [selectedRadio, setSelectedRadio] = useState<string>('')
  // 에러 메시지 관련 스테이트입니다.
  const [toast, setToast] = useState(false);
  const [errMsg, setErrMsg] = useState<string>('')

  const handleRadioBtn: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSelectedRadio(e.target.value)
  }

  const insertSpot = async () => {

    if (!selectedRadio && selectedRadio != '') {
      setToast(true)
      setErrMsg('유형을 선택해주세요!')
      return
    } else {
      setToast(false)
    }

    const formData = new FormData()
    formData.append('type', selectedRadio)

    // 서버에 업로드된 이미지와 데이터를 전송합니다.
    try {
      const { data } = await axios.post("/api/spot/insert", formData);
      if (data.done == "ok")
        console.log(data)
      // router.push(`/log/${data.id}`)

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  useEffect(() => {
    console.log(keyword)
    // / 장소 검색 객체를 생성합니다
    if (window.kakao) {
      var ps = new window.kakao.maps.services.Places();

      // 키워드로 장소를 검색합니다
      ps.keywordSearch(keyword, placesSearchCB, { size: 8 });

      // 키워드 검색 완료 시 호출되는 콜백함수 입니다
      function placesSearchCB(data: string | any[], status: any, pagination: any) {
        if (status === window.kakao.maps.services.Status.OK) {

          // TO_DO type 재정의 필요
          setSpotList(data)
          console.log(pagination)

        } else {
          setSpotList([])
        }
        return;
      }
    }
  }, [keyword])


  useEffect(() => {
    console.log(selectedRadio);

  }, [selectedRadio])
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

              <FormControlLabel key={spot.id} value={spot.address_name} control={<Radio onChange={() => setIsSelected(true)} />} label={spot.place_name} sx={{
                width: '40%'
              }} />
              {/* </Box> */}
            </>
          ))
          }
        </RadioGroup>

      </List>

      <Box>

        {isSelected && spotList.length > 0 ? (
          <>
            <Typography>
              유형
            </Typography>
            {
              typeList.length > 0 && typeList.map((type, idx) => (
                <>
                  {/* <Button key={idx}>
              {type}
            </Button> */}

                  <Box sx={{
                    display: 'inline-flex',
                  }} className={style.select}>
                    <label key={idx}>
                      <input
                        style={{ visibility: 'hidden' }}
                        type="radio"
                        value={type}
                        checked={selectedRadio === type}
                        onChange={(e) => handleRadioBtn(e)}
                      />
                      <Box sx={{
                        backgroundColor: 'palegreen',
                        width: '20vh',
                        textAlign: 'center',
                        height: '50px',
                        marginRight: '3vh',
                      }}>{type}</Box>
                    </label>
                  </Box>
                </>
              ))
            }
          </>
        ) : null}

      </Box>
      <Box>
        <Button onClick={insertSpot}>
          추가하기
        </Button>
      </Box>
      {toast && <Toast setToast={setToast} text={errMsg} />}
    </>
  );
}
