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

const host = process.env.HOST_IP;
console.log(host);
/**
 * DB에서 파라미터 값을 포함한 장소가 있는지 확인하여 결과를 list로 반환합니다.
 * 결과가 없을 경우 null을 반환합니다.
 *
 * @param address_dong 주소 '동'
 * @returns spotList
 */
async function selectListSpot<T>(req: NextApiRequest): Promise<T | unknown> {
  const {
    query: { address_dong, pages },
  } = req;
  console.log(pages);
  try {
    const spotList = await axios.get(`${host}/api/spot/selectSpotList`, {
      params: {
        address_dong: address_dong,
        pages: pages != undefined ? pages : 5,
        isInit: pages != undefined ? false : true,
      },
      timeout: 3000,
    });
    return spotList.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function insertSpot<T>(req: NextApiRequest): Promise<T | unknown> {
  const {
    body: { type, spot },
  } = req;
  console.log(type, spot);
  try {
    await axios
      .post(`${host}/api/spot/insertSpot`, {
        name: spot.name,
        address: spot.address,
        address_dong: spot.address_dong,
        type: type,
        user_pk: 18,
      })
      .then((resp) => {});
    return;
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
    case "selectSpotList":
      resp = await selectListSpot(req);
      res.json({ ok: true, spotList: resp });
      break;

    case "selectSpot":
      break;

    case "insertSpot":
      resp = await insertSpot(req);
      console.log(resp);
      res.json({ ok: true });
      break;
  }
};

export default handler;
