/* eslint-disable @next/next/no-img-element */
/**
 * 스팟 게시글 페이지입니다.
 * 스팟에 관한 글을 올릴 수 있고, 사진을 첨부할 수 있습니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState, useEffect, useRef } from 'react';
import { Grid, Box, Autocomplete, IconButton, Typography, Button, TextField } from "@mui/material";
import { styled } from '@mui/system';
import axios from 'axios'
import style from '../../styles/Spot.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Spot } from '../components/map/map'
import Toast from '../components/global/toast'
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

interface FormType {
  title?: string
  spotPk?: string
  content?: string
}

export default function AddLog() {
  const router = useRouter();

  const [spotList, setSpotList] = useState<Spot[]>([])
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [spotPk, setSpotPk] = useState<string>('')
  const [previewImg, setPreviewImg] = useState<{ url: string, name: string, isRepresent: boolean }[]>([])
  const [img, setImg] = useState<File[]>([])
  const [uploadCount, setUploadCount] = useState<number>(0)
  const [current, setCurrent] = useState<number>(0)

  const fileUploadRef = useRef<HTMLInputElement>(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  // 에러 메시지 관련 스테이트입니다.
  const [toast, setToast] = useState(false);
  const [errMsg, setErrMsg] = useState<string>('')
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

    if (!title) {
      setToast(true)
      setErrMsg('제목을 입력해주세요!')
      return
    } else if (!spotPk || spotPk == "") {
      setToast(true)
      setErrMsg('장소를 선택해주세요!')
      return
    } else if (!content) {
      setToast(true)
      setErrMsg('내용을 입력해주세요!')
      return
    } else if (previewImg.length == 0) {
      setToast(true)
      setErrMsg('이미지를 업로드해주세요!')
      return
    } else if (title && spotPk && content && previewImg.length != 0) {
      setToast(false)
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('spotPk', spotPk)
    formData.append('userPk', '18')

    let representImg = previewImg.find(item => {
      if (item.isRepresent == true)
        return item.name
    })?.name

    // 대표이미지 파일명입니다.
    if (representImg) {
      console.log("@@@@@@", representImg)
      formData.append('representImg', representImg)
    }

    // 업로드된 이미지를 체크합니다.
    if (Array.isArray(img) && img.length > 0) {
      img.map((item) => {
        console.log(item)
        formData.append('file', item)
      })
    }

    // 서버에 업로드된 이미지와 데이터를 전송합니다.
    try {
      const { data } = await axios.post("/api/log/insertLog", formData);
      if (data.done == "ok")
        router.push(`/log/${data.id}`)

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
   * img는 서버에 저장될 파일이고 previewImg는 서버 전송 전 웹에서 미리볼 수 있는 URL 입니다.
   * 파일의 수가 많아져 한 번에 보이지 않을 경우 trackRef에 접근하여 carousel 슬라이더를 생성합니다.
   */
  const changeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 현재 업로드 된 사진의 수를 증가시킵니다.
    setUploadCount(uploadCount + 1)

    // 업로드된 파일이 한개인지 아닌지를 구별하여 다수일 경우 이 전 배열을 복사합니다.
    if (e.target.files) {
      if (img.length != 0 && previewImg.length != 0) {
        setImg([...img, e.target.files[0]]);
        setPreviewImg([...previewImg, {
          url: URL.createObjectURL(e.target.files[0]),
          name: e.target.files[0].name,
          isRepresent: false
        }])
      } else {
        // 최초에 등록되는 프리뷰 이미지는 자동으로 대표로 선택됩니다.
        setImg([e.target.files[0]]);
        setPreviewImg([{
          url: URL.createObjectURL(e.target.files[0]),
          name: e.target.files[0].name,
          isRepresent: true
        }])
      }
    }

    // 현재 업로드된 사진의 개수가 4개이상일 경우 슬라이더 css를 보여줍니다.
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
   * 프리뷰 이미지를 선택하면 발생되는 이벤트입니다.
   * 프리뷰 이미지가 2개이상일 경우 어떠한 이미지를 클릭하게 되면 클릭된 이미지가 대표이미지로 변경되고,
   * 그 전의 대표이미지는 대표여부가 false로 바뀝니다.
   */
  const handleImgClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (e.target instanceof HTMLImageElement && imgRef.current?.classList) {

      let newRepresentImg = e.target.alt
      let cpPreviewImg = [...previewImg];
      let findIndex = previewImg.findIndex(item => item.isRepresent === true)
      cpPreviewImg[findIndex].isRepresent = false;
      findIndex = previewImg.findIndex(item => item.name === newRepresentImg)
      cpPreviewImg[findIndex].isRepresent = true;

      setPreviewImg(cpPreviewImg);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}>
                      {previewImg ? (
                        <>
                          {item.isRepresent ? (
                            <Box>d</Box>
                          ) : null}
                          <img ref={imgRef} alt={item.name} src={item.url} style={{ width: '100%', height: '100%' }} onClick={(e: React.MouseEvent<HTMLImageElement>) => handleImgClick(e)} />
                        </>) : null
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
            }} />
          <CustomAutoComplete onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSpotPk(e.target.value)
          }}>
            <option value="" >
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
          {toast && <Toast setToast={setToast} text={errMsg} />}
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

