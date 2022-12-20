import Head from "next/head"
import Link from "next/link";
const Join = () => {

  return (
    <>
      <Head>
        <title>회원가입 | Find Photo</title>
      </Head>
      <ul>
        <li>
          <Link href="/">
            hello{/* <a>Home</a> */}
          </Link>
        </li>
      </ul>
    </>
  )

}

export default Join;