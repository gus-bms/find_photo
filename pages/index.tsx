import Head from 'next/head'
import Map from './components/map/map'
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

export default function Home() {
  const [cookies, ,] = useCookies(['uid']);

  const authCheck = () => { // 페이지에 들어올때 쿠키로 사용자 체크
    const uid = cookies.uid; // 쿠키에서 id 를 꺼내기
    console.log(uid)

  }

  useEffect(() => {
    authCheck(); // 로그인 체크 함수
  });

  return (
    <>
      <Head>
        <title>Find Photo</title>
        <meta name="description" content="안녕하세요, Find Photo 입니다." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map {...{ latitude: 37.5759, longitude: 126.8129 }} />
    </>
  )
}
