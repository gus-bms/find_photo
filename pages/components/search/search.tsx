/**
 * 사용자가 위치를 검색할 수 있는 검색창입니다.
 * map이 부모 컴포넌트이며, 검색된 결과를 setState 를 통해 재 전달합니다.
 *
 * @type component
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import { Divider, IconButton, InputBase, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React, { FunctionComponent, Dispatch, SetStateAction, useState, useEffect } from 'react';
import Toast from '../global/toast';

interface Iprops {
  keyword: string
  setKeyword: Dispatch<SetStateAction<string>>;
  text: string;
}

const Search: FunctionComponent<Iprops> = (props: Iprops) => {
  // 에러 메시지 관련 스테이트입니다.
  const [toast, setToast] = useState(false);
  const [errMsg, setErrMsg] = useState<string>('')
  // 검색어 상태입니다.
  const [search, setSearch] = useState<string>('');
  // 엔터 키 동작 시, 검색 버튼 클릭 시 실행되는 함수입니다.
  const searchMap = () => {
    const regex = /[가-힣|0-9]+.[동|리|가]/
    if (search.match(regex) != null)
      props.setKeyword(search)
    else {
      setToast(true)
      setErrMsg('동으로 검색해주세요!')
    }
  }

  useEffect(() => {
    // querystring에 한글은 깨지기 때문에 변환합니다.
    if (window.location.search != undefined && window.location.search != '') {
      const decodeUri = decodeURI(window.location.search);
      setSearch(decodeUri.split('?sKeyword=')[1])
    }
  }, [])

  return (
    <>
      {/* 흰 여백  */}
      <Paper
        sx={{ marginTop: '2.5vh', padding: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }} >
        {/* 인풋 값  */}
        <InputBase
          sx={{ ml: 1, flex: 1 }} placeholder={props.text} value={search} id='search'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value)
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter')
              searchMap()
          }}
        />
        {/* 취소 버튼 */}
        <IconButton type="button" sx={{ p: '10px' }} onClick={() => setSearch('')} >
          <ClearIcon />
        </IconButton>
        {/* 수직선 */}
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        {/* 검색 버튼 */}
        <IconButton color="primary" sx={{ p: '10px' }} onClick={searchMap} >
          <SearchIcon />
        </IconButton>
      </Paper>
      {toast && <Toast setToast={setToast} text={errMsg} />}
    </>
  )
}

export default Search