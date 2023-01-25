/**
 * 인증 코드를 전달 받아 DB서버와 통신합니다.
 * 카카오에서 제공해준 사용자 id 값과 DB의 uid값을 대조하여 사용자가 존재하는지 확인합니다.
 * 사용자 조회 및 등록 후 사용자 정보(uid)를 return 합니다.
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
import { createJwt } from "../auth/auth";

const host = process.env.HOST_IP;

interface Data {
  ok: boolean;
  token?: any;
}

interface UserInfo {
  id: string;
  properties: {
    nickname: string;
    profile_image?: string;
    email?: string;
  };
}

/**
 *
 * @param req client에서 전송된 정보(인증코드)
 * @param res client에  리턴할 정보(uid)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  /**
   * 카카오에서 접근 토근을 발급 받습니다.
   *
   * @param client_id: 카카오 앱 등록 시 발급받은 id
   * @param code: client에서 전달받은 인증코드
   * @returns kakao access token
   */
  const getToken = async () =>
    axios({
      url: "https://kauth.kakao.com/oauth/token",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_APPKEY,
        code: req.body.authCode,
      },
    })
      .then((resp) => {
        return resp.data.access_token;
      })
      .catch((err) => {
        console.log(err);
      });

  const token = await getToken();
  const userInfo: UserInfo = await getUserInfo(token);
  const isUser = await checkUser(userInfo.id);
  // DB에 데이터가 없을 경우 생성해주는 함수를 호출합니다.
  console.log("isUser == ", isUser);
  isUser === false ? await insertUser(userInfo) : await updatePhoto(userInfo);
  if (isUser) {
    console.log("before jwt");
    const jwt = await createJwt(userInfo.id, userInfo.properties.profile_image);
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
 * 접근 토큰을 사용하여 카카오로부터 사용자 정보를 제공받습니다.
 * 토큰 타입은 Bearer로 고정입니다.
 *
 * @param token 카카오에서 제공된 접근 토큰
 * @returns userInfo
 */
const getUserInfo = async (token: string) =>
  axios
    .get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });

/**
 * DB에서 사용자 정보가 존재하는지 확인합니다.
 * userInfo의 id값(키)을 통하여 확인합니다.
 *
 * @param id string
 * @returns boolean
 */
const checkUser = async (id: string) =>
  await axios
    .get(`${host}/api/selectUser`, {
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
const updatePhoto = async (userInfo: UserInfo): Promise<boolean> =>
  await axios
    .post(`${host}/api/user/updateProfile`, {
      uid: userInfo.id,
      url: userInfo.properties.profile_image,
    })
    .then(async (res) => {
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
    .post(`${host}/api/insertUser`, {
      uid: userInfo.id,
      name: userInfo.properties.nickname,
      profile_image: userInfo.properties.profile_image,
      email: userInfo.properties.email,
    })
    .then(async (res) => {
      return res.data.r;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
