/*
  1. userInfo 타입 정의하기
	2. 각 변수들 타입 재정의 필요
*/
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
const auth = require("../auth/auth");

interface Data {
  ok: boolean;
  token: string;
}

interface UserInfo {
  id: string;
  name: string;
  profile_image?: string;
  email?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const token = req.body.token;
  const getUserInfo = async () =>
    // const token = req.body.token;
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

  const user: UserInfo = await getUserInfo();
  await checkUser(user, token);

  res.status(200).json({
    ok: true,
    token: token,
  });
}

// 네이버에서 조회된 ID 값이 데이터베이스에 존재하는지 체크합니다.
const checkUser = async (userInfo: UserInfo, token: string) => {
  console.log("checkUser.");
  const id = userInfo.id;
  await axios
    .post("http://localhost:8000/api/selectUser", {
      id: id,
    })
    .then(async (res) => {
      if (res.data.r == true) {
        axios.defaults.headers.common["Auth"] = token;
        console.log("//////////", auth.auth(id));
        return;
      } else {
        // try catch 필요
        const result = await insertUser(userInfo);
        if (result) axios.defaults.headers.common["Auth"] = `${token}`;
        auth.auth(id);
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

// DB에 user 정보를 생성합니다.
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
