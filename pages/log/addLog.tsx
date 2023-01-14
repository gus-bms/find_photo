/**
 * 스팟 게시글 페이지입니다.
 * 스팟에 관한 글을 올릴 수 있고, 사진을 첨부할 수 있습니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Grid, Box, Autocomplete, IconButton, Typography, Button, TextField } from "@mui/material";
import { styled } from '@mui/system';
import axios from 'axios'
import style from '../../styles/Spot.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
/**
 * Input 요소의 디자인을 커스텀합니다.
 */
const CustomInput = styled('input')(`
  width: 100%;
  margin-Top: 1.5rem;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  color: dark;
  background: dark;
  border: none;
  &:focus {
    border-color: none !important;
    outline: none !important;
  }
`,
);
/**
 * Textara 요소의 디자인을 커스텀합니다.
 */
const CustomTextarea = styled('textarea')(`
  width: 100%;
  margin-Top: 1.5rem;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  color: dark;
  background: dark;
  border: none;
  resize: none;
  &:focus {
    border-color: none !important;
    outline: none !important;
  }
`)
/**
 * Select 요소의 디자인을 커스텀합니다.
 */
const CustomAutoComplete = styled('select')(`
  width: 100%;
  margin-Top: 1.5rem;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  color: dark;
  background: dark;
  border: none;
  &:focus {
    border-color: none !important;
    outline: none !important;
  }
`)

// Spot 객체 
export interface Spot {
  spot_pk?: number;
  name?: string;
  category?: String;
  address?: string;
  longitude?: number;
  latitude?: number;
}

export default function AddLog() {
  const [spotList, setSpotList] = useState<Spot[]>([])
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [spotPk, setSpotPk] = useState<string>()
  const [previewImg, setPreviewImg] = useState<string[]>()
  const [uploadCount, setUploadCount] = useState<number>(0)

  const [current, setCurrent] = useState<number>(0)
  const fileUploadRef = useRef<HTMLInputElement>(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  /**
   * 페이지 로딩 시 수행될 훅입니다.
   * 현재 DB에 저장되어있는 동네를 가져옵니다.
   */
  useEffect(() => {
    // SpotList를 조회하는 함수 입니다.
    if (nextRef.current)
      nextRef.current.classList.add(style.btn__hide)
    async function getSpotList(): Promise<any> {
      try {
        await axios.get('/api/spot/getSpotList', {
          params: {
            address_dong: '인현동',
            type: 'getAllSpot'
          },
          timeout: 3000
        }).then(res => {
          setSpotList(res.data.spotList)
          return;
        })

      } catch (err) {
        console.log(err);
        return [];
      }
    }
    getSpotList();

  }, [])

  /**
   * DB log 테이블에 데이터를 삽입하는 함수입니다.
   * 제목과 spot_pk, 내용을 DB에 삽입합니다.
   * @TO_DO 로그인된 사용자 pk 넣기
   * @returns 
   */
  async function insertLog(): Promise<any> {
    console.log(title, spotPk, content)
    const formData = new FormData()
    if (Array.isArray(previewImg) && previewImg.length > 1)
      previewImg.map((img) => {
        formData.append('file', img)
      })
    console.log(typeof (formData))
    try {
      await axios.post('/api/log/insertLog', {
        title: title,
        spotPk: spotPk,
        content: content,
        userPk: 18,
        images: formData,
        type: 'insert',
      }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        return;
      })

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  /**
   * 로컬에서 파일 업로드 창을 오픈합니다.
   * Input의 디자인을 사용하지 않고, 커스텀된 버튼을 클릭하면 Input의 버튼이 클릭되게 합니다.
   */
  const clickImageUpload = () => {
    if (fileUploadRef.current)
      fileUploadRef.current.click();
  }

  /**
   * 파일이 업로드 되었을 때 호출되는 함수입니다.
   */
  const changeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadCount(uploadCount + 1)

    if (e.target.files) {
      if (previewImg)
        setPreviewImg([...previewImg, URL.createObjectURL(e.target.files[0])])
      else
        setPreviewImg([URL.createObjectURL(e.target.files[0])])
    }
    if (trackRef.current && trackRef.current.childElementCount > 2 && nextRef.current) {
      console.log('higer than 2')
      nextRef.current.classList.remove(style.btn__hide)
      nextRef.current.classList.add(style.btn__show)
    } else if (trackRef.current && trackRef.current.childElementCount <= 2 && nextRef.current) {
      console.log('lower than 3')
      nextRef.current.classList.add(style.btn__hide)
    }

  }

  /**
     * 캐로셀 슬라이드의 위치를 이동시키는 좌우 버튼을 클릭할 때 발생하는 이벤트입니다.
     * 왼쪽 버튼을 클릭할 경우 왼쪽으로 이동하며 오른쪽 버튼을 클릴할경우 오른쪽으로 이동합니다.
     * current state변수는 현재 카드(이미지) 중 몇번째가 앞쪽에 있는가를 의미합니다.
     * 
     * @param position 
     */
  const handleCarouselClick = (position: string) => {
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
    console.log(uploadCount, current)
    if (prevRef.current && nextRef.current) {
      if (current > 0 && current < 4) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__hide)
      }
      if (current == 0) {
        prevRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__show)
      } else if (uploadCount - current == 3) {
        prevRef.current.classList.add(style.btn__show)
        nextRef.current.classList.remove(style.btn__show)
        nextRef.current.classList.add(style.btn__hide)
      }
    }
  }, [current])

  return (
    <>
      {/* 이미지 업로드 */}
      <Box sx={{
        height: '12rem',
        marginTop: '2rem',
        display: 'flex'
      }}>
        <Box onClick={clickImageUpload} sx={{
          height: '100%',
          width: '20%',
          // border: '1px dotted',
          borderRadius: '10px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontSize: 'xx-large',
          color: 'gray',
          cursor: 'pointer',
          marginRight: '15px',
        }}>
          <input ref={fileUploadRef} type='file' accept='image/*' onChange={(e) => { changeImageUpload(e) }} style={{
            display: 'none'
          }} />
          +
        </Box>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
            <Box ref={trackRef} sx={{
              transform: `translateX(-${(current * 2.55) * 10}%)`,
              display: 'inline-flex',
              width: '100%',
              height: '100%',
              transition: 'transform 0.2s ease-in-out'
            }}>
              {previewImg ?
                previewImg.map((item, idx) => (
                  <Box key={idx} sx={{
                    width: '25%',
                    height: '100%',
                    flexShrink: 0,
                    display: 'flex',
                    marginRight: '10px',
                    transition: 'all 0.1s linear',
                  }}>
                    <Box sx={{
                      width: '100%',
                      height: '100%',
                      backgroundPosition: 'center bottom',
                      backgroundSize: 'center',
                      backgroundRepeat: 'no-repeat',
                      borderRadius: '10px'
                    }}>
                      {previewImg ?
                        <img alt="previewImage" src={item} style={{ width: '100%', height: '100%' }} />
                        : null
                      }
                    </Box>
                  </Box>
                ))
                : null}
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
      </Box>

      <Grid container>
        {/* 글 */}
        <Grid
          item
          xs={12}
          sx={{
            marginTop: '1rem',
          }}
        >
          <CustomInput value={title} placeholder="제목을 입력하세요."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value)
            }} style={{
              fontSize: 'xx-large',
              marginTop: 0
            }} >
          </CustomInput>
          <CustomAutoComplete onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSpotPk(e.target.value)
          }}>
            <option defaultValue="''" >
              장소를 선택해주세요.
            </option>
            {spotList.map((item) => (
              <option value={item.spot_pk} key={item.spot_pk}>
                {item.name}
              </option>
            ))}
          </CustomAutoComplete>
          <CustomTextarea placeholder="내용을 입력하세요."
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setContent(e.target.value)
            }} style={{
              height: '44.6vh'
            }} />
        </Grid>
        <Grid item sx={{
          // position: 'absolute',
          bottom: '0px', // 바닥에 고정시켜줍니다.
          height: '4rem',
          width: '100%',
          display: 'flex',
          webkitBoxPack: 'justify',
          justifyContent: 'space-between', // 가운데 영역을 비고 양옆으로 밀착시킵니다.
          webkitBoxAlign: 'center',
          alignItems: 'center',
        }}>
          <Button variant="text" sx={{
            color: 'gray'
          }}>뒤로가기</Button>
          <Box>
            <Button variant="text" sx={{
              color: 'gray'
            }}>임시저장</Button>
            <Button variant="text" onClick={insertLog} sx={{
              color: 'gray'
            }}>로그 등록</Button>
          </Box>
        </Grid>
      </Grid>


    </>
  );
}

