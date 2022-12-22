import Script from 'next/script';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Button, Container, Grid, Link, TextField, Typography, Divider } from '@mui/material';
import Search from "../search/search";
import FolderList from '../list/folderList'
import axios from 'axios'

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

// Spot 객체 
export interface Spot {
  spot_pk?: number;
  name?: string;
  category?: String;
  address?: string;
  longitude?: number;
  latitude?: number;
}

interface GetSpotsResponse {
  list: Spot[];
}

const Map = ({ latitude, longitude }: MapProps) => {
  // keyword: Search Component에서 전달 받을 데이터
  // spotList: 검색된 결과에 따른 장소 리스트
  // spot: 검색된 결과내에서 선택된 장소
  const [keyword, setKeyword] = useState<string>('')
  const [spotList, setSpotList] = useState<Spot[]>([])
  const [spot, setSpot] = useState<Spot>({})
  const [map, setMap] = useState<any>()
  // const [infowindow, setInfowindow] = useState<any>()

  // ----------------------------useEffect----------------------------
  // 지도 initial 세팅, spot state 변경 시 지도 리셋
  const initMap = useCallback(() => {
    // map 그릴 컨테이너 
    const container = document.getElementById("map");
    const options = {
      //center: 선택될 좌표, level: 지도의 확대 단계 (낮을수록 깊어짐)
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 4
    };
    setMap(new window.kakao.maps.Map(container, options))

    // 마커 위치 시킬 좌표 설정
    const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);
  }, []);

  useEffect(() => {
    if (window?.kakao) {
      initMap();
    }
  }, [initMap]);

  // 장소 클릭 시 지도 위치를 재설정합니다.
  useEffect(() => {
    if (window?.kakao) {
      // // 장소 검색 객체를 생성합니다
      // var ps = new window.kakao.maps.services.Places();
      // // 키워드로 장소를 검색합니다
      // ps.keywordSearch(spot.address, placesSearchCB);
      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(spot.address, function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면 
        if (status === window.kakao.maps.services.Status.OK) {

          var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          // 결과값으로 받은 위치를 마커로 표시합니다
          var marker = new window.kakao.maps.Marker({
            map: map,
            position: coords
          });
          var infowindow = new window.kakao.maps.InfoWindow({
            position: coords,
          });
          window.kakao.maps.event.addListener(marker, 'click', function () {
            if (infowindow != undefined) {
              // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
              infowindow.close();
              infowindow.setContent('<div style="padding:10px;font-size:12px;">' + spot.name + '</div>');
              infowindow.open(map, marker);
            }
          });
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        } else {
          if (Array.isArray(result) || result.length == 0) {
            alert('검색되지 않습니다.')
          }
        }
      });
    }
  }, [spot,]);

  // keyword의 변경을 감지합니다.
  useEffect(() => {
    if (keyword != '') {
      (async () => {
        const spotList = await getSpotList();
      })();
    }
  }, [keyword])

  // ----------------------------With Node function----------------------------
  // SpotList를 조회하는 함수 입니다.
  async function getSpotList(): Promise<any> {
    try {
      // config 객체
      await axios.get('http://localhost:8000/api/selectSpotList', {
        params: { // query string
          address_dong: keyword
        },
        // headers: { // 요청 헤더
        //   'X-Api-Key': 'my-api-key'
        // },
        timeout: 3000 // 1초 이내에 응답이 오지 않으면 에러로 간주
      }).then(res => {
        setSpotList(res.data.list)
        return res.data.list;
      })

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  // ----------------------------With Map function----------------------------
  // 장소 클릭 시 지도 입력
  const searchMap = (spot: Spot) => {
    setSpot({ name: spot.name, address: spot.address, latitude: spot.latitude, longitude: spot.longitude })

  }
  // 키워드 검색 완료 시 호출되는 콜백함수입니다
  const placesSearchCB = (data: any, status: any, pagination: any) => {
    if (status === window.kakao.maps.services.Status.OK) {

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new window.kakao.maps.LatLngBounds();

      for (var i = 0; i < data.length; i++) {
        displayMarker(data[i]);
        bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }
  }

  // 지도에 마커를 표시하는 함수입니다.
  const displayMarker = (place: any) => {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(place.y, place.x)
    });


    // 마커에 클릭이벤트를 등록합니다
    window.kakao.maps.event.addListener(marker, 'click', function () {
      // if (infowindow != undefined) {
      //   // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
      //   infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
      //   infowindow.open(map, marker);
      // }
    });
  }


  // ----------------------------Return JSX----------------------------
  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APPKEY}&libraries=services&autoload=false`}
        strategy="lazyOnload"
        onLoad={() => window.kakao.maps.load(initMap)}
      />
      {/* Search에서 데이터 전달 받기 위해 state 함수 전달 */}
      <Search setKeyword={setKeyword} />
      <Box
        id="map"
        component='main'
        sx={{
          height: '5vh',
          marginTop: '5%',
          alignItems: 'center',
          minHeight: '100%',
          border: 'black',
          borderRadius: '10px',
        }}
      />
      {!Array.isArray(spotList) || spotList.length != 0 &&
        <FolderList spotList={spotList} setSpot={setSpot} />
      }
    </>
  )
}

export default Map