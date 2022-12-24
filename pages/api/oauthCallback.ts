/*
  1. userInfo 타입 정의하기
	2. 각 변수들 타입 재정의 필요
*/
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface Data {
  token: string;
  ok: boolean;
}

interface UserInfo {
  id: number;
  properties: {
    nickname: string;
    profile_image?: string;
    email?: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const getToken = async () =>
    axios({
      url: "https://kauth.kakao.com/oauth/token",
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: {
        grant_type: "authorization_code",
        client_id: "9851b7210644addc1e868f1785b8fe5c",
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
  await checkUser(userInfo);

  res.status(200).json({
    ok: true,
    token: token,
  });
}

// 카카오톡 사용자 정보 조회 입니다.
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

// 카카오톡에서 조회된 ID 값이 데이터베이스에 존재하는지 체크합니다.
const checkUser = async (userInfo: UserInfo) => {
  console.log(userInfo);
  const id = userInfo.id;
  await axios
    .post("http://localhost:8000/api/selectUser", {
      id: id,
    })
    .then(async (res) => {
      if (res.data.r == true) return;
      else {
        await insertUser(userInfo);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

// DB에 user 정보를 생성합니다.
const insertUser = async (userInfo: UserInfo) => {
  await axios
    .post("http://localhost:8000/api/insertUser", {
      uid: userInfo.id,
      name: userInfo.properties.nickname,
      profile_image: userInfo.properties.profile_image,
      email: userInfo.properties.email,
    })
    .then(async (res) => {
      return;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
