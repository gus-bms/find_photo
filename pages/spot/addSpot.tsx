
import Search from "../components/search/search";
import { useEffect, useState } from "react";
import { Spot } from '../components/map/map'
import { Box, Button, FormControlLabel, Grid, List, Pagination, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import style from '../../styles/Spot.module.css'
import axios from "axios";
import Toast from '../components/global/toast'
import router from 'next/router'
import Head from "next/head";
import { LocalCafe, LocalDining, PhotoCamera } from "@mui/icons-material";
import { indigo } from "@mui/material/colors";

interface ISpot extends Spot {
  id: string
}

export default function AddSpot() {
  const [keyword, setKeyword] = useState<string>('')
  const [typeList, setTypeList] = useState<string[]>(['C', 'R', 'H'])
  const [spotList, setSpotList] = useState<ISpot[]>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false)
  const [selectedRadio, setSelectedRadio] = useState<string>('')
  const [selectSpot, setSelectSpot] = useState<Spot>({})
  const [pagination, setPagination] = useState<any>({})
  // 에러 메시지 관련 스테이트입니다.
  const [toast, setToast] = useState(false);
  const [errMsg, setErrMsg] = useState<string>('')

  const handleRadioBtn = (e: React.ChangeEvent<HTMLInputElement>, type: string, spot?: Spot) => {
    if (type == 'spot' && spot) {
      setSelectSpot(spot)
      setIsSelected(true)
      setSelectedRadio('')
      return
    }
    setSelectedRadio(e.target.value)
  }

  const insertSpot = async () => {

    if (!selectedRadio && selectedRadio == '') {
      setToast(true)
      setErrMsg('유형을 선택해주세요!')
      return
    } else if (spotList.length == 0 && selectSpot.name == '') {
      setToast(true)
      setErrMsg('장소를 선택해주세요!')
      return
    } else {
      setToast(false)
    }

    // 서버에 업로드된 이미지와 데이터를 전송합니다.
    try {
      const { data } = await axios.post("/api/spot/insertSpot", {
        type: selectedRadio,
        spot: selectSpot
      });
      if (data.ok == true)
        router.push(`/?sKeyword=${selectSpot.address_dong}`)

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    // console.log(value, e)
    pagination.gotoPage(value)
  };

  useEffect(() => {
    // / 장소 검색 객체를 생성합니다
    setIsSelected(false)
    console.log('@@keyword == ', keyword)

    const searchPlace = () => {
      let ps = new window.kakao.maps.services.Places();
      // 키워드로 장소를 검색합니다
      ps.keywordSearch(keyword, placesSearchCB, { size: 8 });

      // 키워드 검색 완료 시 호출되는 콜백함수 입니다
      function placesSearchCB(data: any[], status: any, pagination: any) {
        if (status === window.kakao.maps.services.Status.OK) {

          // TO_DO type 재정의 필요
          let spotArr = data.map(item => {
            const regex = /[가-힣|0-9]+.[동|리|가]/;
            let rObj = {
              id: item.id,
              name: item.place_name ? item.place_name : '',
              address: item.road_address_name != null ? item.road_address_name : item.address_name,
              address_dong: item.address_name != null ? item.address_name.match(regex)[0] : '',
            }
            // console.log(item)
            return rObj
          })
          setSpotList(spotArr)
          setPagination(pagination)
          // console.log(pagination)
        } else {
          setSpotList([])
        }
        return;
      }
    }

    if (keyword != '') {
      if (window.kakao.maps.services == undefined) {
        window.kakao.maps.load(function () {
          searchPlace()
        })
      } else {
        searchPlace()
      }
    }

  }, [keyword])

  useEffect(() => {
    // querystring에 한글은 깨지기 때문에 변환합니다.
    const decodeUri = decodeURI(window.location.search);
    setKeyword(decodeUri.split('?sKeyword=')[1])

    // maps script가 모두 로딩이 되지 않을 경우 동적으로 로드합니다.
    window.kakao.maps.load(function () {
      console.log('load complete')
    })

  }, [])

  useEffect(() => {
    console.log(toast)
  }, [toast])

  return (
    <>
      <Head>
        <title>장소 등록 | Find Photo</title>
      </Head>
      <Search keyword={keyword} setKeyword={setKeyword} text="장소를 입력해주세요!" ></Search>
      {spotList.length > 0 &&
        <>
          <Typography sx={{
            marginTop: "3vh",
            borderBottom: '1px solid #F1F3F5',
            width: '10vw',
            color: '#3b3b3ba8',
          }}>
            장소
          </Typography>
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              // marginTop: "1vh",
            }}
          >
            <RadioGroup
              row
              name="radio-buttons-group"
              sx={{
                height: '25vh',
                justifyContent: 'space-between',
                marginTop: '2vh',
                color: '#3b3b3ba8',
              }}
            >
              {spotList.map((spot, idx) => (
                <>
                  <FormControlLabel key={spot.id} value={spot.name} control={<Radio sx={{
                    color: '#3b3b3ba8',
                    '&.Mui-checked': {
                      color: 'indigo',
                    },
                  }} onChange={e => handleRadioBtn(e, 'spot', spot)} />} label={spot.name} sx={{
                    width: '40%'
                  }} />
                  {/* </Box> */}
                </>
              ))
              }
            </RadioGroup>
            <Stack sx={{
              alignItems: 'center',
              marginTop: '7vh'
            }}>
              <Pagination count={pagination.last} onChange={handleChange} sx={{
                '.MuiPaginationItem-root': {
                  '&.Mui-selected': {
                    backgroundColor: 'indigo',
                    color: '#fff'
                  }

                }
              }} />
            </Stack>
          </List>
        </>
      }
      {isSelected && spotList.length > 0 ? (
        <>
          <Typography sx={{
            marginTop: "3vh",
            borderBottom: '1px solid #F1F3F5',
            color: '#3b3b3ba8',
            width: '10vw',
          }}>
            유형
          </Typography>
          <Box sx={{
            textAlignLast: 'center',
          }}>
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
                        onChange={(e) => handleRadioBtn(e, 'type')}
                      />
                      <Box sx={{
                        backgroundColor: 'lightgray',
                        borderRadius: '10px',
                        width: '20vw',
                        textAlign: 'center',
                        height: '50px',
                        marginRight: '3vh',
                        marginTop: '2vh',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>{type == 'C' ? <LocalCafe /> : (
                        type == 'R' ? <LocalDining /> :
                          <PhotoCamera />)}</Box>
                    </label>
                  </Box>
                </>
              ))
            }
          </Box>
        </>
      ) : null
      }
      <Box className={style.spot__footer} >
        <Button variant="text" onClick={router.back}>뒤로가기</Button>
        {toast &&
          <Box>
            <Toast setToast={setToast} text={errMsg} />
          </Box>
        }
        <Button className={style.add__btn} variant="text" onClick={insertSpot}>추가하기</Button>
      </Box>
    </>
  );
}
