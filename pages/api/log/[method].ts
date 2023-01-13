/**
 * 로그를 작성할 때 DB에 저장된 '동을 .
 * 검색어를 통하여 DB에 검색된 '동' 내에 장소가 존재하는지 확인합니다.
 * 장소에 대한 결과(spotList)를 return 합니다.
 *
 * @type class
 * @param authCode
 * @returns uid
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface Data {
  ok: boolean;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  query: {
    method: string;
    type: string;
    title?: string;
    content?: string;
    spotPk?: string;
    userPk: string;
  };
}
/**
 *
 * @param req client에서 전송된 정보
 * @param res client에  리턴할 정보
 */
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { userPk, spotPk, content, title, type },
  } = req;
  let resp: any;

  console.log("hi");
  console.log(spotPk);
  if (type === "insert" && title && content && spotPk && userPk) {
    resp = insertLog(title, content, spotPk, userPk);
  }
  res.status(200).json({
    ok: true,
  });
  // res.status(500).json({
  //   ok: false,
  // });
}

/**
 * log DB에 log를 insert합니다.
 * 결과가 없을 경우 null을 반환합니다.
 *
 * @param title 제목
 * @param spot_pk spot 테이블 pk
 * @param content 내용
 * @returns
 */
async function insertLog<T>(
  title: string,
  content: string,
  spotPk: string,
  userPk: string
): Promise<T | unknown> {
  try {
    console.log("hello");
    await axios.post("http://localhost:8000/api/log/insertLog", {
      title: title,
      spot_pk: spotPk,
      content: content,
      user_pk: userPk,
    });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
}
