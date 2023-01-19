/**
 * 메인 페이지입니다.
 * Map을 Component를 호출합니다.
 * 
 * @type page
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 * @TO_DO Map 전달 인수 사용자 위치 정보 확인 후 제공
 */

import Head from 'next/head'
import Map from './components/map/map'
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [cookies, ,] = useCookies(['uid']);
  const [sKeyword, setSKeyword] = useState<string>('');
  const authCheck = () => { // 페이지에 들어올때 쿠키로 사용자 체크
    const uid = cookies.uid; // 쿠키에서 id 를 꺼내기

  }

  useEffect(() => {
    authCheck(); // 로그인 체크 함수
    const param = router.query.sKeyword
    param && typeof (param) == 'string' && setSKeyword(param)
  });

  useEffect(() => {
    console.log(sKeyword)
  }, [sKeyword])

  return (
    <>
      <Head>
        <title>Find Photo</title>
        <meta name="description" content="안녕하세요, Find Photo 입니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map {...{ latitude: 37.5759, longitude: 126.8129, pKeyword: sKeyword }} />
    </>
  )
}
