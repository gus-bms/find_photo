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

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface Data {
  spotList?: any[];
  ok: boolean;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  query: {
    method: string;
    address_dong: string;
  };
}
/**
 *
 * @param req client에서 전송된 정보(검색어 keyword)
 * @param res client에  리턴할 정보(spotList)
 */
export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { address_dong },
  } = req;

  const spotList = address_dong
    ? await getSpotList<[] | null>(address_dong)
    : null;
  // switch keyword
  if (Array.isArray(spotList)) {
    res.status(200).json({
      spotList: spotList,
      ok: true,
    });
  } else {
    res.status(500).json({
      ok: false,
    });
  }
}

/**
 * DB에서 파라미터 값을 포함한 장소가 있는지 확인하여 결과를 list로 반환합니다.
 * 결과가 없을 경우 null을 반환합니다.
 *
 * @param address_dong 주소 '동'
 * @returns spotList
 */
async function getSpotList<T>(address_dong: string): Promise<T | unknown> {
  console.log(address_dong);
  try {
    const spotList = await axios.get(
      "http://localhost:8000/api/selectSpotList",
      {
        params: {
          address_dong: address_dong,
        },
        timeout: 3000,
      }
    );
    return spotList.data.list;
  } catch (err) {
    console.log(err);
    return err;
  }
}
