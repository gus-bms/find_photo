/**
 * 카카오 지도 컴포넌트입니다.
 * 지도 객체를 통하여 지도를 그리고 검색창에서 검색된 결과를 전달 받아 Next 서버로 전송합니다.
 * 
 *
 * @type component
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Button } from '@mui/material';
import Search from "../search/search";
import SpotList from '../spot/spotList'
import axios from 'axios'
import router from 'next/router'
import Link from 'next/link';
import LoadingSpinner from '../global/loading'
import { IRootState } from '../../../store/modules'
import { useDispatch, useSelector } from 'react-redux';
import { loadingEndAction, loadingStartAction } from '../../../store/modules/isLoading';
import style from '../../../styles/Map.module.css'

declare global {
  interface Window {
    kakao: any;
  }
}

// 지도 좌표
interface MapProps {
  pKeyword: string
}

// Spot 객체 
export interface Spot {
  spot_pk?: number;
  name?: string;
  category?: String;
  address?: string;
  address_dong?: string;
  longitude?: number;
  latitude?: number;
}
const MARKER_WIDTH = 33, // 기본, 클릭 마커의 너비
  MARKER_HEIGHT = 36, // 기본, 클릭 마커의 높이
  OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
  OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
  OVER_MARKER_WIDTH = 40, // 오버 마커의 너비
  OVER_MARKER_HEIGHT = 42, // 오버 마커의 높이
  OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
  OVER_OFFSET_Y = OVER_MARKER_HEIGHT, // 오버 마커의 기준 Y좌표
  SPRITE_MARKER_URL = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png', // 스프라이트 마커 이미지 URL
  SPRITE_WIDTH = 126, // 스프라이트 이미지 너비
  SPRITE_HEIGHT = 146, // 스프라이트 이미지 높이
  SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

var selectedMarker: any = null
var selectedInfowindow: any

const Map = ({ pKeyword }: MapProps) => {
  // Redux store의 state 중 isLogin을 불러오는 hook 입니다.
  const isLoading = useSelector<IRootState, boolean>(state => state.isLoading);
  // reducer isLogin Action 사용
  const dispatch = useDispatch(); // dispatch를 사용하기 쉽게 하는 hook 입니다.

  const [keyword, setKeyword] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [spotList, setSpotList] = useState<Spot[]>([])
  const [spot, setSpot] = useState<Spot>({})
  const [map, setMap] = useState<any>()
  const [geocoder, setGeocoder] = useState<any>()

  /**
   * SpotList를 조회하는 함수 입니다.
   * @returns 
   */
  async function getSpotList(): Promise<any> {
    try {
      await axios.get('/api/spot/selectSpotList', {
        params: {
          address_dong: keyword,
        },
        timeout: 3000
      }).then(res => {
        setSpotList(res.data.spotList)
        console.log(res.data.spotList)
        return res.data.list;
      })

    } catch (err) {
      console.log(err);
      return [];
    }
  }

  useEffect(() => {
    dispatch(loadingStartAction())
    // v3 스크립트를 동적으로 로드하기위해 사용한다.
    // 스크립트의 로딩이 끝나기 전에 v3의 객체에 접근하려고 하면 에러가 발생하기 때문에
    // 로딩이 끝나는 시점에 콜백을 통해 객체에 접근할 수 있도록 해 준다.
    // 비동기 통신으로 페이지에 v3를 동적으로 삽입할 경우에 주로 사용된다.
    // v3 로딩 스크립트 주소에 파라메터로 autoload=false 를 지정해 주어야 한다.
    window.kakao.maps.load(function () {
      const container = document.getElementById("map");
      const options = {
        //center: 선택될 좌표, level: 지도의 확대 단계 (낮을수록 깊어짐)
        center: new window.kakao.maps.LatLng(37.5759, 126.8129,),
        level: 4
      };
      setMap(new window.kakao.maps.Map(container, options))
      setGeocoder(new window.kakao.maps.services.Geocoder())
      dispatch(loadingEndAction())
    })
  }, [])

  // 장소 클릭 시 지도 위치를 재설정합니다.
  useEffect(() => {
    if (geocoder != undefined) {
      // 주소-좌표 변환 객체를 생성합니다
      geocoder.addressSearch(spot.address, function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면 
        if (status === window.kakao.maps.services.Status.OK) {

          var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          var gapX = (MARKER_WIDTH + SPRITE_GAP), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
            originY = (MARKER_HEIGHT + SPRITE_GAP),
            overOriginY = (OVER_MARKER_HEIGHT + SPRITE_GAP),
            normalOrigin = new window.kakao.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
            clickOrigin = new window.kakao.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
            overOrigin = new window.kakao.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
          addMarker(coords, normalOrigin, overOrigin, clickOrigin)

          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        } else {
          if (Array.isArray(result) || result.length == 0) {
            alert('검색되지 않습니다.')
          }
        }
      });

      /**
       * marker를 등록하는 함수입니다.
       */
      const addMarker = (position: any, normalOrigin: number, overOrigin: number, clickOrigin: number) => {
        const markerSize = new window.kakao.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
          markerOffset = new window.kakao.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
          overMarkerSize = new window.kakao.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT), // 오버 마커의 크기
          overMarkerOffset = new window.kakao.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y), // 오버 마커의 기준 좌표
          spriteImageSize = new window.kakao.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT); // 스프라이트 이미지의 크기
        // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
        var normalImage = createMarkerImage(markerSize, markerOffset, normalOrigin, spriteImageSize),
          overImage = createMarkerImage(overMarkerSize, overMarkerOffset, overOrigin, spriteImageSize),
          clickImage = createMarkerImage(markerSize, markerOffset, clickOrigin, spriteImageSize);

        // 마커를 생성하고 이미지는 기본 마커 이미지를 사용합니다
        var marker = new window.kakao.maps.Marker({
          map: map,
          position: position,
          image: normalImage
        });

        console.log('@@@', selectedMarker)

        // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
        marker.normalImage = normalImage;

        // 마커에 mouseover 이벤트를 등록합니다
        window.kakao.maps.event.addListener(marker, 'mouseover', function () {

          // 클릭된 마커가 없고, mouseover된 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 오버 이미지로 변경합니다
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(overImage);
          }
        });

        // 마커에 mouseout 이벤트를 등록합니다
        window.kakao.maps.event.addListener(marker, 'mouseout', function () {

          // 클릭된 마커가 없고, mouseout된 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 기본 이미지로 변경합니다
          if (!selectedMarker || selectedMarker !== marker) {
            marker.setImage(normalImage);
          }
        });

        // 마커에 click 이벤트를 등록합니다
        window.kakao.maps.event.addListener(marker, 'click', function () {
          // 클릭된 마커가 없고, click 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 클릭 이미지로 변경합니다
          var infowindow = new window.kakao.maps.InfoWindow({
            removable: false
          });
          if (!selectedMarker || selectedMarker !== marker) {

            if (selectedInfowindow != undefined) selectedInfowindow.close();
            if (infowindow != undefined) {
              // infowindow.setContent('<div class ="label"><span class="left"></span><span class="center">카카오!</span><span class="right"></span></div>')
              // infowindow.setContent('<div style="padding:10px;font-size:12px;">' + spot.name + '</div>');
              // infowindow.open(map, marker);
            }

            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 기본 이미지로 변경하고
            !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            marker.setImage(clickImage);
          } else if (selectedMarker == marker && selectedInfowindow != undefined) {
            // selectedInfowindow.close();
            // selectedInfowindow.getPosition()
          }


          // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
          selectedInfowindow = infowindow
          selectedMarker = marker;
        });
      }

      // MakrerImage 객체를 생성하여 반환하는 함수입니다
      const createMarkerImage = (markerSize: number, offset: number, spriteOrigin: number, spriteImageSize: number) => {
        var markerImage = new window.kakao.maps.MarkerImage(
          SPRITE_MARKER_URL, // 스프라이트 마커 이미지 URL
          markerSize, // 마커의 크기
          {
            offset: offset, // 마커 이미지에서의 기준 좌표
            spriteOrigin: spriteOrigin, // 스트라이프 이미지 중 사용할 영역의 좌상단 좌표
            spriteSize: spriteImageSize // 스프라이트 이미지의 크기
          }
        );

        return markerImage;
      }
    }
  }, [spot]);

  // keyword의 변경을 감지합니다.
  useEffect(() => {
    (async () => {
      // 검색어의 결과를 리스트로 뿌려줍니다.
      router.push(`/?sKeyword=${keyword}`)
      await getSpotList()

      // 검색어의 위치로 지도의 중심을 이동시킵니다.
      if (geocoder == undefined) {
        if (window.kakao.maps.services != undefined) {
          setGeocoder(new window.kakao.maps.services.Geocoder())
          return
        }
        return
      }
      if (window.kakao.maps.services != undefined && geocoder == undefined) {
        setGeocoder(new window.kakao.maps.services.Geocoder())
        return
      }
      // 주소-좌표 변환 객체를 생성합니다
      geocoder.addressSearch(keyword, function (result: any, status: any) {
        // 정상적으로 검색이 완료됐으면 
        if (status === window.kakao.maps.services.Status.OK) {
          var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          map.setCenter(coords);
        } else {
          if (Array.isArray(result) || result.length == 0) {
            router.back()
            alert('검색되지 않습니다.')
          }
        }
      });

    })();
  }, [keyword, geocoder])

  useEffect(() => {
    console.log('query ==', pKeyword)
    typeof (pKeyword) == 'string' && (async () => {
      setKeyword(pKeyword)
      setSearch(pKeyword)
    })();

  }, [pKeyword])

  return (
    <>
      {/* Search에서 데이터 전달 받기 위해 state 함수 전달 */}
      <Search search={search} setSearch={setSearch} keyword={keyword} setKeyword={setKeyword} text='동을 입력해주세요!' />
      <Box
        id="map"
        component='main'
        sx={{
          height: '300px',
          marginTop: '2.5vh',
          alignItems: 'center',
          border: 'black',
          borderRadius: '10px',
        }}

      >
        {isLoading ? <LoadingSpinner /> : null}
      </Box>
      {!Array.isArray(spotList) || spotList.length != 0 &&
        <SpotList spotList={spotList} setSpot={setSpot} />
      }
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        {keyword &&
          <Box sx={{
            textAlign: '-webkit-center',
          }}>
            <Link href={`/spot/addSpot?sKeyword=${keyword}`} className={style.none__underline} >
              <Button>추가하기</Button>
            </Link>
          </Box>
        }
      </Box>
    </>
  )
}

export default Map