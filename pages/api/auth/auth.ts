import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const authMiddleware = (userId: any): boolean => {
  console.log("/@@@@@@@@@@@@@@@@hi", userId);
  return true;
};

// 아이디 체크를 위한 미들웨어 사용 (반복 사용가능)
export const authCheck = async (req: any, res: any, next: any) => {
  const { uid } = req;
  console.log("@@uid == ", uid);
  if (uid != "") {
    next();
  } else {
    res.json({ r: false, msg: "로그인 필요" });
  }
};

module.exports.authCheck = authCheck;
