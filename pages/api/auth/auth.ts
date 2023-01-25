import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import axios from "axios";
import * as jose from "jose";

const host = process.env.HOST_IP;

/**
 * JWT를 발행합니다.
 * Access Token의 유효시간은 5분이며, Refresh Token의 유효기간은 31일입니다.
 * Access Token이 만료될 경우 Refresh Token을 활용하여 재발급 받습니다.
 * @param uid
 * @param profileImage
 * @returns
 */
export const createJwt = async (uid: any, profileImage: any, type?: string) => {
  try {
    const accessToken = await new Promise(async (resolve, reject) => {
      console.log("create jwt");
      const token = await new jose.SignJWT({
        uid: uid,
        profileImage: profileImage,
      }) // details to  encode in the token
        .setProtectedHeader({ alg: "HS256" }) // algorithm
        .setIssuedAt()
        .setExpirationTime("1m") // token expiration time, e.g., "1 day"
        .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET_KEY)); // secretKey generated from previous step
      console.log(token); // log token to console
      resolve(token);
    });
    /**
     * refresh token을 발급합니다.
     * refresh token이 정상적으로 발급이 되면 DB에 데이터를 저장해주어야 합니다.
     */
    if (!type) {
      const refreshToken = await new Promise(async (resolve, reject) => {
        console.log("create jwt");
        const token = await new jose.SignJWT({}) // details to  encode in the token
          .setProtectedHeader({ alg: "HS256" }) // algorithm
          .setIssuedAt()
          .setExpirationTime("5m") // token expiration time, e.g., "1 day"
          .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET_KEY)); // secretKey generated from previous step
        console.log(token); // log token to console
        await axios.post(`${host}/api/user/updateRefreshToken`, {
          uid: uid,
          refreshToken: token,
        });
        resolve(token);
      });
      console.log("@@ AT, RT == ", accessToken, refreshToken);
      return { r: true, accessToken: accessToken, refreshToken: refreshToken };
    }
    return { r: true, accessToken: accessToken };
  } catch (err: any) {
    console.log(err);
    return { r: false, errCode: err.code };
  }
};

export const checkJWT = async (token: string, secretKey?: string) => {
  const secret =
    process.env.ACCESS_TOKEN_SECRET_KEY != undefined
      ? process.env.ACCESS_TOKEN_SECRET_KEY
      : secretKey;
  try {
    const { payload: jwtData } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    return jwtData;
  } catch (err: any) {
    console.log(err);
    if (err.code == "ERR_JWT_EXPIRED") {
      return { r: false, errCode: err.code };
    }
    // JWT validation failed or token is invalid
  }
};

export const checkRefreshToken = async (token: string) => {
  console.log(token);
  const secret = process.env.REFRESH_TOKEN_SECRET_KEY;
  try {
    const resp: any = await jose.jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    console.log("verify refresh", resp);
    return { r: true };
  } catch (err: any) {
    console.log(err);
    if (err.code == "ERR_JWT_EXPIRED") {
      return { r: false, errCode: err.code };
    }
    // JWT validation failed or token is invalid
  }
};

export const refreshJWT = async (token: string) => {
  console.log(token);
  try {
    // const user = await checkUser(token);
    const user: any = await fetch(
      `${host}/api/selectUser?refresh_token=${token}`,
      {
        method: "GET",
      }
    )
      .then((data) => data.json())
      .then((text) => {
        console.log("user", text);
        return text;
      });

    console.log("user", typeof user, user.r);
    if (user.r) {
      const jwt = await createJwt(user.uid, user.profileUrl, "access");
      return { r: true, jwt: jwt };
    } else {
      return { r: false };
    }
  } catch (err: any) {
    console.log(err);
    if (err.code == "ERR_JWT_EXPIRED") {
      return { r: false, errCode: err.code };
    }
    // JWT validation failed or token is invalid
  }
};
const checkUser = async (token: string) =>
  await axios
    .get(`${host}/api/selectUser`, {
      params: {
        refresh_token: token,
      },
    })
    .then((res) => {
      return res.data.r;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
