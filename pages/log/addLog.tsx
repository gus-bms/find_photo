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
import { Grid, Box, IconButton, Typography, Button, TextField } from "@mui/material";
import style from '../../styles/Spot.module.css'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { display } from '@mui/system';
import InputUnstyled from '@mui/base/InputUnstyled';
import { styled } from '@mui/system';

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

/**
 * 인풋 요소의 디자인을 커스텀합니다.
 */
const StyledInputElement = styled('input')(({ theme }) => `
  width: 100%;
  margin-Top: 1.5rem;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 12px;
  color: dark;
  background: dark;
  border: none
  // box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};

  // &:hover {
  //   border-color: ${blue[400]};
  // }

  &:focus {
    border-color: none !important;
    outline: none !important;
  }


`,
);

const CustomInput = React.forwardRef(function CustomInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <InputUnstyled slots={{ input: StyledInputElement }} {...props} ref={ref} />
  );
});



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
        {/* 글 */}
        <Grid
          item
          xs={12}
        >
          <CustomInput aria-label="Demo input" placeholder="제목을 입력하세요." />
          <CustomInput aria-label="Demo input" placeholder="내용을 입력하세요." style={{
            height: '100px'
          }} />
        </Grid>
      </Grid>

      <Grid container sx={{
        position: 'fixed',
        bottom: '0px', // 바닥에 고정시켜줍니다.
        height: '4rem',
        width: '49%',
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
          <Button variant="text" sx={{
            color: 'gray'
          }}>로그 등록</Button>
        </Box>


      </Grid>
    </>
  );
}

