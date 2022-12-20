import { Box, Button, Container, Grid, TextField, Typography, Divider, IconButton, InputBase, Paper, Input } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import style from '../../../styles/Search.module.css'
import { border } from '@mui/system';
import React, { FunctionComponent, Dispatch, SetStateAction, useState } from 'react';

interface Iprops {
  setKeyword: Dispatch<SetStateAction<string>>;
}

const Search: FunctionComponent<Iprops> = (props: Iprops) => {
  //검색창 변수
  const [search, setSearch] = useState<string>('');
  // 엔터 키 동작 시, 검색 버튼 클릭 시 
  const searchMap = () => {
    props.setKeyword(search)
  }

  return (
    <>
      {/* 흰 여백  */}
      <Paper
        sx={{
          marginTop: '2.5vh',
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* 인풋 값  */}
        <InputBase
          sx={{
            ml: 1,
            flex: 1
          }}
          placeholder="검색"
          value={search}
          id='search'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value)
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter')
              searchMap()
          }}
        />
        {/* 취소 버튼 */}
        <IconButton
          type="button"
          sx={{
            p: '10px'
          }}
          aria-label="search"
          onClick={() => setSearch('')}
        >
          <ClearIcon />
        </IconButton>
        {/* 수직선 */}
        <Divider sx={{
          height: 28, m: 0.5
        }}
          orientation="vertical"
        />
        {/* 검색 버튼 */}
        <IconButton
          color="primary"
          sx={{ p: '10px' }}
          aria-label="directions"
          onClick={searchMap}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </>
  )
}

export default Search