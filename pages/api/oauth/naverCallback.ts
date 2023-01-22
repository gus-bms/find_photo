/**
 * 접근토큰을 전달 받아 DB서버와 통신합니다.
 * 네이버에서 제공해준 사용자 id 값과 DB의 uid값을 대조하여 사용자가 존재하는지 확인합니다.
 * 사용자 조회 및 등록 후 사용자 정보(uid)를 return 합니다.
 *
 * @type class
 * @param token
 * @returns uid
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { createJwt } from "../auth/auth";

interface Data {
  ok: boolean;
  token?: any;
}

interface UserInfo {
  id: string;
  name: string;
  profile_image?: string;
  email?: string;
}

/**
 *
 * @param req client에서 전송된 정보(접근토큰)
 * @param res client에  리턴할 정보(uid)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = req.body.token;
  /**
   * 접근토큰을 사용하여 네이버로부터 사용자 정보를 제공받습니다.
   * 토큰 타입은 Bearer로 고정입니다.
   *
   * @param token 카카오에서 제공된 접근 토큰
   * @returns userInfo
   */
  const getUserInfo = async () =>
    axios({
      url: "https://openapi.naver.com/v1/nid/me",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => {
        console.log(resp);
        return resp.data.response;
      })
      .catch((err) => {
        console.log(err);
      });

  const userInfo: UserInfo = await getUserInfo();
  const isUser = await checkUser(userInfo.id);
  // DB에 사용자가 없을 경우 생성해주는 함수를 호출합니다.
  isUser === false ? await insertUser(userInfo) : await updatePhoto(userInfo);

  if (isUser) {
    console.log("before jwt");
    const jwt = await createJwt(userInfo.id, userInfo.profile_image);
    if (jwt != undefined && jwt != null)
      // res.setHeader("access-token", jwt.accessToken ? jwt.accessToken : '');
      res.status(200).json({
        ok: true,
        token: jwt,
      });
  } else {
    res.status(200).json({
      ok: false,
    });
  }
}

/**
 * DB에서 사용자 정보가 존재하는지 확인합니다.
 * userInfo의 id값(키)을 통하여 확인합니다.
 *
 * @param id string
 * @returns boolean
 */
const checkUser = async (id: string) =>
  await axios
    .get("http://localhost:8000/api/selectUser", {
      params: {
        uid: id,
      },
    })
    .then((res) => {
      return res.data.r;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
/**
 * DB에 사용자 정보를 insert 합니다.
 * uid와 name은 필수값이며 그 외에는 optional 입니다.
 *
 * @param userInfo
 * @returns
 */
const insertUser = async (userInfo: UserInfo): Promise<boolean> =>
  await axios
    .post("http://localhost:8000/api/insertUser", {
      uid: userInfo.id,
      name: userInfo.name,
      profile_image: userInfo.profile_image,
      email: userInfo.email,
    })
    .then(async (res) => {
      return res.data.r == true ? true : false;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

/**
 * DB에 사용자 정보를 insert 합니다.
 * uid와 name은 필수값이며 그 외에는 optional 입니다.
 *
 * @param userInfo
 * @returns
 */
const updatePhoto = async (userInfo: UserInfo): Promise<boolean> =>
  await axios
    .post("http://localhost:8000/api/user/updateProfile", {
      uid: userInfo.id,
      url: userInfo.profile_image,
    })
    .then(async (res) => {
      return res.data.r;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
