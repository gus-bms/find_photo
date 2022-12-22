import Head from 'next/head'
import Map from './components/map/map'


export default function Home() {
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
