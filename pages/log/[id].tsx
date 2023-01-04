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
import { Grid, Box, IconButton, Typography } from "@mui/material";
import style from '../../styles/Spot.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { display } from '@mui/system';

export default function Log() {

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
      {/* 이미지 슬라이더 */}
      <Grid container>
        <Grid item
          md={12}>
          <Box ref={carouselRef} className={style.carousel__container} width={'100%'}>
            <Box className={style.inner__carousel}>
              <Box ref={trackRef} className={style.track}
                sx={{
                  transform: `translateX(-${(current * 1.3) * 10}%)`
                }}>
                {cards2.map((card, idx) =>
                  <Box key={idx} className={style.card__container}>
                    < Box className={style.card}
                      sx={{
                        backgroundImage: `url(${card.url})`,
                        cursor: 'pointer',
                      }} />
                  </Box>
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
        </Grid>
        {/* 작성자 */}
        <Grid
          item
          md={12}
          display='inline-flex'>
          <Typography>
            작성자 프로필 사진
          </Typography>
          <Typography sx={{
            marginLeft: 1.5
          }}>
            작성자 이름
          </Typography>
        </Grid>
        {/* 글 */}
        <Grid
          item
          md={12}
        >
          <Typography sx={{
            fontWeight: '600',
            fontSize: '1.7rem'
          }}>
            여행준비 (1) - Visit Japan (비짓재팬) 등록
          </Typography>
          <Typography sx={{
            lineHeight: '1.9rem',
            marginTop: '1rem',
          }}>
            {`일본 여행을 하기 위해선 Visit Japan Web(비짓재팬웹) 이라는 사이트에서 몇가지 정보를 기입해주고, 입국 심사 시 QR 검증을

            받아야 입국이 가능하다. 또한 백신을 3차까지 맞지 않았다면, 출발 72시간 전에 PCR 검사를 받고 결과서를 비짓재팬에

            등록해주어야 한다.



            비짓재팬은 'Visit Japan Web'이란, 입국 수속 '검역', '입국 심사', '세관 신고'를 웹에서 할 수 있는 서비스이고, 지금 이 글에서 소개되는

            서비스는 패스트 트랙 서비스이다.

            https://www.vjw.digital.go.jp/main/#/vjwplo001



            처음 위의 URL을 접속한 뒤, 계정을 만들어줘야 한다.

            계정 만들기를 선택한 뒤, 약관에 동의하고 다음 버튼을 클릭하면 아래와 같은 화면이 뜨는데, 이메일은 실제 사용하고 있는

            메일을 적어준다.


            계정 등록 화면
            그 다음, 작성한 메일로 인증번호가 오게 되는데 인증번호를 기입하면 계정 생성은 완료된다.


            인증번호 메일
            인증번호를 등록하면, 초기화면으로 돌아가게 되고 로그인을 한다.

            로그인을 하게 되면 본인 정보를 입력하는 메뉴와 여행에 관련된 정보를 입력하는 메뉴가 나타난다.

            먼저 본인 정보 메뉴를 클릭한다.



            그럼 입국 귀국 수속 구분을 위한 질문이 있는데 해당하는 부분을 선택해준 후 다음으로 넘어간다.


            본인 정보 (1) - 입국 귀국 수속 구분
            다음으로는 본인의 정보를 기입하는 화면이 나온다. 어렵진 않으니 본인의 여권에 나타난 정보를 고대로 기입한다.

            그럼 한번 더 확인할 수 있는 창이 나타나고, 등록 버튼을 클릭해준다.

            이제 본인정보 기입은 끝났고, 여행에 관련된 정보를 기입하기 위해 신규 등록 버튼을 클릭한다!



            신규 등록 버튼을 클릭하고 난 다음의 내용에서 차례대로 정보를 기입한다.

            여행명은 아무렇게나 입력해도 상관 없고, 항공사명은 항공사 발권 정보를 보면 그날 스케쥴된 항공 편명이 나타나는데 앞에 영문이 항공사명, 뒤의 숫자가 편명이다. (JEJU AIR는 7C!)


            신규 여행 (1) - 항공편 정보
            일본 내 지내게 될 호텔 혹은 에어비앤비 등등 장소에 관한 정보를 기입한다.

            구글맵에 장소를 검색하면 가운데에 우편번호가 나타나는데 우편번호만 입력하면 도도부현과 시구정촌명?은 자동 기입돼서 편리하다.


            구글맵
            나머지 주소는 그 후부터 작성해주면 된다. (위의 주소에서는, 2-Chome-5-2 Umeda)

            연락처는 호텔 연락처를 작성했다!


            신규 여행 (2) 장소 정보
            장소까지 기입했으면 입력 내용 확인을 통해 한번더 내용을 검토할 수 있고 검토까지 했으면 예정 등록을 클릭한다!

            그 다음은 검역 수속을 입력해야 한다. 검역 수속을 클릭하면 이제는 2가지 정보를 기입하면 된다.

            먼저 백신 접종 증명서 라는 파란 글씨를 클릭하면 백신을 맞았냐는 질문이 제일 먼저 있는데, 나는 3차까지 맞지를 않았기 때문에 아니오를 선택하고 완료했다.



            그 다음은 출국 전 72시간 이내 검사 결과 증명서 이다. 마찬가지로 파란 글씨를 선택해서 메뉴를 한번 더 진입하면, PCR 검사와 관련된

            여러 정보를 기입하면 된다. 그리고 검사결과지를 업로드해주면 되는데, 씨젠에서 보내준 결과지를 고대로 업로드하였다



            여기까지 하면 검역 수속은 마무리가 됐고 이제 검역심사가 통과되는 것을 기다리기만 하면된다!

            일본은 가까워서 년에 한 번씩은 갔던 나라였는데 너무 오랜만에 가게 돼서 설레기도 한다..🌸 특히 유니버셜 너무 가고싶다.



            얼른 목요일이 되기를!`}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

