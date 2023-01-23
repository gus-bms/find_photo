/**
 * 전달된 검색어를 받아와 DB서버와 통신합니다.
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

import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

/**
 * DB서버에 log와 image를 요청합니다.
 *
 * @param logPk log 테이블 pk
 * @returns
 */
async function updateUser<T>(req: NextApiRequest): Promise<T | unknown> {
  const {
    body: { intro },
  } = req;
  const {
    cookies: { uid },
  } = req;
  console.log(req.cookies);
  console.log(intro);
  try {
    // DB서버로 데이터를 전송합니다. 결과가 성공적일 경우, log 내용과 이미지명을 제공받습니다.
    const resp = await axios.post("http://localhost:8000/api/user/update", {
      intro: intro,
      uid: uid,
    });
    return resp.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 * DB서버에 log와 image를 요청합니다.
 *
 * @param logPk log 테이블 pk
 * @returns
 */
async function selectUser<T>(req: NextApiRequest): Promise<T | unknown> {
  const {
    cookies: { uid },
  } = req;
  console.log(req.cookies);
  try {
    // DB서버로 데이터를 전송합니다. 결과가 성공적일 경우, log 내용과 이미지명을 제공받습니다.
    const log = await axios.get("http://localhost:8000/api/selectUser", {
      params: {
        uid: uid,
      },
    });
    return log.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

const handler: NextApiHandler = async (req, res) => {
  let resp: any;
  const {
    query: { method },
  } = req;
  console.log("request 파라미터", method);
  /**
   * 파일 업로드 및 데이터를 DB서버에 전송하는 로직입니다.
   */
  switch (method) {
    case "selectUser":
      resp = await selectUser(req);
      res.json({ ok: true, user: resp });
      break;

    case "updateUser":
      resp = await updateUser(req);
      console.log(resp);
      res.json({ ok: true, user: resp });
      break;
  }
};

export default handler;
