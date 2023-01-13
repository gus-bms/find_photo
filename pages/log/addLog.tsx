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

  /**
   * 페이지 로딩 시 현재 저장되어있는 동네를 가져옵니다.
   */
  useEffect(() => {
    // SpotList를 조회하는 함수 입니다.
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
    try {
      await axios.get('/api/log/insertLog', {
        params: {
          title: title,
          spotPk: spotPk,
          content: content,
          userPk: 1,
          type: 'insert'
        },
        timeout: 3000
      }).then(res => {
        return;
      })

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  return (
    <>
      {/* 이미지 슬라이더 */}
      <Grid container>
        {/* 글 */}
        <Grid
          item
          xs={12}
        >
          <CustomInput value={title} placeholder="제목을 입력하세요."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value)
            }} style={{
              fontSize: 'xx-large'
            }} >
          </CustomInput>
          <CustomAutoComplete onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSpotPk(e.target.value)
          }}>
            <option value="''" disabled selected>
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
              height: '200px'
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
          <Button variant="text" onClick={(e) => insertLog()} sx={{
            color: 'gray'
          }}>로그 등록</Button>
        </Box>


      </Grid>
    </>
  );
}

