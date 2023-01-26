import Head from "next/head"
import Link from "next/link";
import { useEffect } from "react";
import LoadingSpinner from "./components/global/loading";
import Slider from "./components/global/slider";
const Join = () => {

  let a = 0;
  const handleButton = () => {
    a = a + 1;
    console.log(a)
  }

  useEffect(() => {
    console.log(a)
  }, [a])

  return (
    <>
      <Head>
        <title>회원가입 | Find Photo</title>
      </Head>
      {/* <Slider /> */}
      <ul>
        <li>

          <Link href="/">
            hello{/* <a>Home</a> */}
          </Link>
          <button onClick={handleButton}>

          </button>
        </li>
      </ul>
    </>
  )

}

export default Join;