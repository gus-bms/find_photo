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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [sKeyword, setSKeyword] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // querystring에 한글은 깨지기 때문에 변환합니다.
    const decodeUri = decodeURI(window.location.search);
    setSKeyword(decodeUri.split('?sKeyword=')[1])

    router.beforePopState(state => {
      const decodeUri = decodeURI(window.location.search);
      decodeUri.length != 0 ? setSKeyword(decodeUri.split('?sKeyword=')[1]) : setSKeyword('');
      return true;
    });
  }, [])

  // useEffect(() => {
  // }, [sKeyword])

  return (
    <>
      <Head>
        <title>Find Photo</title>
        <meta name="description" content="안녕하세요, Find Photo 입니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map {...{ pKeyword: sKeyword }} />
    </>
  )
}
