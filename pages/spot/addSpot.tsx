
import Search from "../components/search/search";
import { useEffect, useState } from "react";
export default function NestedList() {
  const [keyword, setKeyword] = useState<string>('')

  useEffect(() => {
    console.log(keyword)
  }, [keyword])


  return (
    <>
      <Search keyword={keyword} setKeyword={setKeyword} text="장소를 입력해주세요!" ></Search>
    </>
  );
}
