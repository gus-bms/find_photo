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

import { useRouter } from 'next/router'
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { Box, IconButton, Button } from "@mui/material"
import axios from 'axios'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Spot } from '../components/map/map'
import Toast from '../components/global/toast'
import LoadingSpinner from '../components/global/loading';
import Head from 'next/head'
import style from '../../styles/Log.module.css'

let isTransition = false

export default function AddLog() {
  const router = useRouter();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const [spotList, setSpotList] = useState<Spot[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [spotPk, setSpotPk] = useState<string>('')
  const [previewImg, setPreviewImg] = useState<{ url: string, name: string, isRepresent: boolean }[]>([])
  const [img, setImg] = useState<File[]>([])
  const [uploadCount, setUploadCount] = useState<number>(0)
  const [xValue, setXValue] = useState<number>(0)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [url, setUrl] = useState<string>('');
  const fileUploadRef = useRef<HTMLInputElement>(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement[] | null[]>([])
  const boxRef = useRef<HTMLDivElement[] | null[]>([])
  const customAutoCompleteRef = useRef<HTMLSelectElement | null>(null)

  // 에러 메시지 관련 스테이트입니다.
  const [toast, setToast] = useState(false);
  const [errMsg, setErrMsg] = useState<string>('')

  axios.create({
    timeout: 3000
  })

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

    let representImg = previewImg.find(item => {
      if (item.isRepresent == true)
        return item.name
    })?.name

    // 대표이미지 파일명입니다. 공백이 있을 경우 언더바로 치환합니다.
    if (representImg) {
      let newName = representImg.replace(/\s/g, "_");
      formData.append('representImg', newName)
    }

    // 업로드된 이미지를 체크합니다.
    if (Array.isArray(img) && img.length > 0) {
      img.map((item) => {
        formData.append('file', item)
      })
    }

    // 서버에 업로드된 이미지와 데이터를 전송합니다.
    try {
      setIsLoading(true)
      const { data } = await axios.post("/api/log/insertLog", formData);
      if (data.done == "ok") {
        setIsLoading(false)
        router.push(`/log/${data.id}`)
      }

    } catch (err) {
      console.log(err);
      setIsLoading(false)
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
    // 업로드된 파일이 한개인지 아닌지를 구별하여 다수일 경우 이 전 배열을 복사합니다.
    // 파일이 선택되었을 때에만 e.target.files의 길이가 1이상이므로 체크합니다.
    if (e.target.files && e.target.files.length != 0) {
      // 파일 용량 체크 vercel 배포는 4.5MB 제한있음
      if (e.target.files[0].size > 4718592) {
        setToast(true)
        setErrMsg('파일 용량이 4.5Mb를 넘습니다!')
        return
      }

      if (img.length != 0 && previewImg.length != 0) {
        // 중복된 이미지인지 체크합니다.
        let idx = img.findIndex(item => e.target.files != null && item.name === e.target.files[0].name)
        if (idx != -1) {
          setErrMsg('중복된 이미지입니다.')
          setToast(true)
          return
        }
        const size = img.reduce(function add(sum, currValue) {
          return sum + currValue.size;
        }, 0);

        if (size + e.target.files[0].size > 4718592) {
          setToast(true)
          setErrMsg('파일 용량이 4.5Mb를 넘습니다!')
          return
        }

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
      // 현재 업로드 된 사진의 수를 증가시킵니다.
      setUploadCount(uploadCount + 1)
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
    // 현재 이미지슬라이드 내에 모든 이미지가 보여지지 않을 경우 버튼을 추가합니다.

    isTransition = true
    let imgSliderR: number = carouselRef.current ? Math.round(carouselRef.current?.getBoundingClientRect().right) : 0;
    let imgSliderL: number = carouselRef.current ? Math.round(carouselRef.current?.getBoundingClientRect().left) : 0;
    let lastImgR: number = trackRef.current?.lastElementChild ? Math.round(trackRef.current?.lastElementChild?.getBoundingClientRect().right) : 0;
    let firstImgL: number = trackRef.current?.firstElementChild ? Math.round(trackRef.current?.firstElementChild?.getBoundingClientRect().left) : 0;

    if (nextRef.current != null && prevRef.current != null) {
      if (position == 'next') {
        prevRef.current.classList.remove(style.btn__hide)
        prevRef.current.classList.add(style.btn__show)
        // 마지막 이미지가 슬라이드 보다 클 경우
        if (lastImgR > imgSliderR) {
          lastImgR - imgSliderR > 309 ? setXValue(x => x + 310) : setXValue(x => x + (lastImgR - imgSliderR))
        }
      } else if (position == 'prev') {
        nextRef.current.classList.remove(style.btn__hide)
        nextRef.current.classList.add(style.btn__show)
        // firstImgL < 0 && (firstImgL -= 310)
        if (firstImgL > imgSliderL) {
          firstImgL - Math.abs(imgSliderL) > 309 ? setXValue(x => x + 310) : setXValue(0)
        } else {
          firstImgL + 310 < imgSliderL ? setXValue(x => x - 310) : setXValue(0)
        }
      }
    }
  }
  /**
   * 프리뷰 이미지를 선택하면 발생되는 이벤트입니다.
   * 프리뷰 이미지가 2개이상일 경우 어떠한 이미지를 클릭하게 되면 클릭된 이미지가 대표이미지로 변경되고,
   * 그 전의 대표이미지는 대표여부가 false로 바뀝니다.
   */
  const handleImgClick = (e: React.MouseEvent<HTMLImageElement> | React.MouseEvent<HTMLParagraphElement>) => {
    let cpPreviewImg = [...previewImg];
    if (e.target instanceof HTMLImageElement && imgRef.current) {
      let newRepresentImg = e.target.alt

      // 이벤트 발생 전 대표이미지를 찾아 css를 없애줍니다.
      let findIdx = imgRef.current.findIndex(item => item != null && item.className == 'Log_represent__card__x1yf4')
      imgRef.current[findIdx]?.classList.remove(style.represent__card)
      imgRef.current[findIdx]?.classList.add(style.represent__cancel)

      // 이벤트를 발생 시킨 이미지를 찾아 대표 이미지 css를 추가합니다.
      findIdx = imgRef.current.findIndex(item => item != null && item.alt == newRepresentImg)
      imgRef.current[findIdx]?.classList.add(style.represent__card)
      imgRef.current[findIdx]?.classList.remove(style.represent__cancel)

      // 프리뷰이미지 집합내의 대표이미지 설정값을 변환합니다.
      let findIndex = previewImg.findIndex(item => item.isRepresent === true)
      cpPreviewImg[findIndex].isRepresent = false;
      findIndex = previewImg.findIndex(item => item.name === newRepresentImg)
      cpPreviewImg[findIndex].isRepresent = true;

      setPreviewImg(cpPreviewImg);
    } else if (e.target instanceof HTMLDivElement && boxRef) {
      let newRepresentImg = e.target.innerText.split('\n')[0]

      let findIdx = boxRef.current.findIndex(item => item != null && item.className == 'Log_represent__text__GL7zg')
      boxRef.current[findIdx]?.classList.remove(style.represent__text)
      boxRef.current[findIdx]?.classList.add(style.represent__text__cancel)

      findIdx = boxRef.current.findIndex(item => item != null && item.innerText.split('\n')[0] == newRepresentImg)
      boxRef.current[findIdx]?.classList.add(style.represent__text)
      boxRef.current[findIdx]?.classList.remove(style.represent__text__cancel)

      let findIndex = previewImg.findIndex(item => item.isRepresent === true)
      cpPreviewImg[findIndex].isRepresent = false;
      findIndex = previewImg.findIndex(item => item.name === newRepresentImg)
      cpPreviewImg[findIndex].isRepresent = true;

      setPreviewImg(cpPreviewImg);

    }
  }

  // 화면 사이즈가 작아져서 프리뷰 이미지가 적은 경우에도 안 보일 때 실행됩니다.
  const resizeListener = (e: any) => {
    if (trackRef.current && nextRef.current) {
      if (e.target.visualViewport.width < 851 && trackRef.current.childElementCount > 1) {
        if (trackRef.current.childElementCount > 1) {
          nextRef.current.classList.remove(style.btn__hide)
          nextRef.current.classList.add(style.btn__show)
        }
      } else {

        let imgSliderX = carouselRef.current?.getBoundingClientRect().right;
        let lastImgX = trackRef.current?.lastElementChild?.getBoundingClientRect().right
        if (nextRef.current != null) {
          if (lastImgX && imgSliderX && lastImgX > imgSliderX) {
            nextRef.current.classList.remove(style.btn__hide)
            nextRef.current.classList.add(style.btn__show)
          }
        }
        setXValue(0)
      }
    }
  };

  const changedTransition = () => {
    let imgSliderR: number = carouselRef.current ? Math.round(carouselRef.current?.getBoundingClientRect().right) : 0;
    let imgSliderL: number = carouselRef.current ? Math.round(carouselRef.current?.getBoundingClientRect().left) : 0;
    let lastImgR: number = trackRef.current?.lastElementChild ? Math.round(trackRef.current?.lastElementChild?.getBoundingClientRect().right) : 0;
    let firstImgL: number = trackRef.current?.firstElementChild ? Math.round(trackRef.current?.firstElementChild?.getBoundingClientRect().left) : 0;
    if (prevRef.current && nextRef.current) {
      if (firstImgL < imgSliderL) {
        prevRef.current.classList.remove(style.btn__hide)
        prevRef.current.classList.add(style.btn__show)
      } else if (firstImgL == imgSliderL) {
        prevRef.current.classList.add(style.btn__hide)
        prevRef.current.classList.remove(style.btn__show)
      }

      if (lastImgR > imgSliderR) {
        nextRef.current.classList.remove(style.btn__hide)
        nextRef.current.classList.add(style.btn__show)
      } else if (lastImgR == imgSliderR) {
        nextRef.current.classList.add(style.btn__hide)
        nextRef.current.classList.remove(style.btn__show)
      }
    }
    isTransition = false
  }


  /**
   * 페이지 로딩 시 수행될 훅입니다.
   * 현재 DB에 저장되어있는 동네를 가져옵니다.
   */
  useEffect(() => {
    const decodeUri = decodeURI(window.location.search);
    const address_dong = (decodeUri.split('?address_dong=')[1].split('&')[0])
    window.addEventListener("resize", resizeListener);
    // SpotList를 조회하는 함수 입니다.
    if (nextRef.current)
      nextRef.current.classList.add(style.btn__hide)
    async function getSpotList(): Promise<any> {
      try {
        await axios.get('/api/spot/selectSpotList', {
          params: {
            address_dong: address_dong,
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

  useEffect(() => {
    if (previewImg.length == 1) {
      imgRef.current.length > 0
        ? imgRef.current[0]?.classList.add(style.represent__card)
        : boxRef.current[0]?.classList.add(style.represent__text)
    } else {
      if (trackRef.current) {
        trackRef.current.addEventListener("transitionend", changedTransition);
      }
      // 현재 이미지슬라이드 내에 모든 이미지가 보여지지 않을 경우 버튼을 추가합니다.
      let imgSliderX: number = Math.round(carouselRef.current ? carouselRef.current?.getBoundingClientRect().right : 0)
      let lastImgX: number = trackRef.current?.lastElementChild ? Math.round(trackRef.current?.lastElementChild?.getBoundingClientRect().right) : 0;
      if (nextRef.current != null) {
        if (lastImgX > imgSliderX) {
          nextRef.current.classList.remove(style.btn__hide)
          nextRef.current.classList.add(style.btn__show)
        }
      }
    }
  }, [previewImg])

  useEffect(() => {
    // 스팟의 로그남기기를 통해 들어왔을 경우
    const { spot } = router.query
    if (spot != undefined && typeof (spot) == 'string' && customAutoCompleteRef.current != null) {
      setSpotPk(spot)
      customAutoCompleteRef.current.value = spot
    }
  }, [spotList])


  return (
    <>
      {/* 이미지 업로드 */}
      <Head>
        <title>로그 남기기 | Find Photo</title>
      </Head>
      {isLoading ? <LoadingSpinner /> : null}
      <Box className={style.upload__box} height={!isMobile ? '350px' : '150px'}>
        <Box width={!isMobile ? '200px' : "100px"} className={style.upload__button} onClick={(e) => {
          clickImageUpload()
        }}>
          <input ref={fileUploadRef} type='file' accept='image/*' onChange={(e) => { changeImageUpload(e) }} style={{
            display: 'none',
            userSelect: 'none'
          }} />
          +
        </Box>
        {!isMobile ?
          <Box sx={{ position: 'relative', width: 'calc(100% - 215px)' }}>
            <Box id='image__slider' ref={carouselRef} className={style.image__slider}>
              <Box className={style.track__box} ref={trackRef} sx={{
                transform: `translateX(calc(-1 * ${xValue}px))`,
              }}>
                {previewImg ?
                  previewImg.map((item, idx) => (
                    <Box className={style.preview__box} key={idx} >
                      <Box className={style.preview__image}>
                        {item.isRepresent ? (
                          <Box sx={{
                            position: 'absolute',
                            bottom: '-5px',
                            left: 'calc(50% - 10px)'
                          }}><CheckCircleIcon color='success' fontSize="small" /></Box>
                        ) : null}
                        <img ref={elem => (imgRef.current[idx] = elem)} alt={item.name} src={item.url} style={{
                          width: '100%', height: '100%'
                        }} onClick={(e: React.MouseEvent<HTMLImageElement>) => handleImgClick(e)} />
                      </Box>
                    </Box>
                  ))
                  : null}
              </Box>
              <Box>
                <IconButton ref={prevRef} sx={{ display: 'none' }}
                  className={style.button__grp}
                  type="button"
                  onClick={() => !isTransition && handleCarouselClick('prev')}
                >
                  <NavigateBeforeIcon className={style.nav__icon} fontSize='large' />
                </IconButton>
                <IconButton
                  ref={nextRef}
                  className={style.button__grp}
                  type="button"
                  sx={{ right: 0 }}
                  onClick={() => {
                    !isTransition && handleCarouselClick('next')
                  }
                  }
                >
                  <NavigateNextIcon className={style.nav__icon} fontSize='large' />
                </IconButton>
              </Box>
            </Box>
          </Box>
          :
          <>
            <Box width='calc(100% - 115px)' overflow='scroll'>
              {
                previewImg.map((item, idx) => {
                  return (
                    <div ref={elem => (boxRef.current[idx] = elem)} style={{
                      width: '100%',
                      display: 'inline-flex',
                      height: '35px',
                      alignItems: 'center'
                    }} key={idx} onClick={(e: React.MouseEvent<HTMLDivElement>) => handleImgClick(e)}>
                      <p className={style.mobile__upload__text}> {item.name} </p>
                      <Button sx={{ width: '35%' }} onClick={() => {
                        setIsOpen(true)
                        setUrl(item.url)
                      }}>미리보기</Button>
                    </div>
                  )
                })
              }
            </Box>
            {isOpen && <Modal img={url} setIsOpen={setIsOpen} isOpen={isOpen} />}
          </>
        }
      </Box>

      <Box>
        {/* 글 */}
        <Box>
          <input className={style.title} value={title} placeholder="제목을 입력하세요." onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setTitle(e.target.value)
          }} style={{
            fontSize: 'xx-large',
          }} />
          <select className={style.spot__list} ref={customAutoCompleteRef} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSpotPk(e.target.value)
          }}>
            <option value="" style={{ padding: 0 }}>
              장소를 선택해주세요.
            </option>
            {spotList.map((item) => (
              <option value={item.spot_pk} key={item.spot_pk} style={{ padding: 0 }}>
                {item.name}
              </option>
            ))}
          </select>
          <textarea className={style.content} placeholder="내용을 입력하세요."
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setContent(e.target.value)
            }} style={{
              height: '52vh'
            }} />
        </Box>
        <Box className={style.log__footer} >
          <Button variant="text" onClick={router.back}>뒤로가기</Button>
          {toast &&
            <Box>
              <Toast setToast={setToast} text={errMsg} />
            </Box>
          }
          <Button className={style.add__btn} variant="text" onClick={insertLog}>로그 등록</Button>
        </Box>
      </Box>
    </>
  );
}

interface Iprops {
  text?: string;
  img?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: any;
}


const Modal = (props: Iprops) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  return (
    <Box id='modalBox' ref={modalRef} className={style.modal__box} onClick={e => {
      modalRef.current === e.target && props.setIsOpen(false)
    }}>
      <Box className={style.container}>
        <Box className={style.image__box} sx={{
          backgroundImage: `url(${props.img})`,
        }}
        />
      </Box>
      <Button className={style.close} onClick={() => props.setIsOpen(false)}>
        닫기
      </Button>
    </Box>
  )
}