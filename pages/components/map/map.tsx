import styled from "@emotion/styled";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Link, TextField, Typography, Divider } from '@mui/material';
import Search from "../search/search";
import { string } from "prop-types";

declare global {
  interface Window {
    kakao: any;
  }
}

// 지도 좌표
interface MapProps {
  latitude: number; // 위도
  longitude: number; // 경도
}

const Map = ({ latitude, longitude }: MapProps) => {
  // keyword: Search Component에서 전달 받을 데이터
  const [keyword, setKeyword] = useState<string>('')

  // 지도 세팅
  useEffect(() => {
    // 지도 생성 객체 전달 받을 script 생성
    const mapScript = document.createElement("script");
    // 
    mapScript.async = true;
    // 전달 받기 위한 주소 + api 키
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APPKEY}&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          //center: 선택될 좌표, level: 지도의 확대 단계 (낮을수록 깊어짐)
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 4
        };
        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };
    mapScript.addEventListener("load", onLoadKakaoMap);

    return () => mapScript.removeEventListener("load", onLoadKakaoMap);
  }, [latitude, longitude]);

  // keyword 변경 감지
  useEffect(() => {
    console.log('changed')
  }, [keyword])

  return (
    <>
      {/* Search에서 데이터 전달 받기 위해 state 함수 전달 */}
      <Search setKeyword={setKeyword} />
      <Box
        id="map"
        component='main'
        sx={{
          height: '30vh',
          marginTop: '5%',
          alignItems: 'center',
          minHeight: '100%',
          border: 'black',
          borderRadius: '10px',
        }}
      />
    </>
  )
}

export default Map