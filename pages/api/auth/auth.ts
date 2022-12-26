import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const auth = (userId: any): boolean => {
  console.log("/@@@@@@@@@@@@@@@@hi", userId);
  return true;
};

module.exports.auth = auth;
