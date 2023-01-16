/**
 * DB 서버에 전송하여 로그를 저장합니다.
 *
 * @type class
 * @param authCode
 * @returns uid
 * @author gus-bms
 * @version 0.5
 * @project find-photo
 */

interface Data {
  ok: boolean;
}
interface InsertLogProps {
  title: string;
  content: string;
  spotPk: string;
  userPk: string;
  images?: [];
}
/**
 *
 * @param req client에서 전송된 정보
 * @param res client에  리턴할 정보
 */
import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import axios from "axios";

// 파일형식을 읽어올 때 multipart/multi-form 형식이기 때문에 기존 바디파서를 지워줍니다.
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * 프로미스 공부할 것
 * formidable 공부할 것
 *
 * @param req
 * @param saveLocally
 * @returns
 */
const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/uploads");
    options.multiples = true;
    options.filename = (name, ext, path, form) => {
      return Date.now().toString() + "_" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  // console.log(form);
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields: any, files) => {
      await insertLog(fields);

      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/uploads"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"));
  }
  await readFile(req, true);
  res.json({ done: "ok" });
};

/**
 * log DB에 log를 insert합니다.
 * 결과가 없을 경우 null을 반환합니다.
 *
 * @param title 제목
 * @param spot_pk spot 테이블 pk
 * @param content 내용
 * @returns
 */
async function insertLog<T>(fields: InsertLogProps): Promise<T | unknown> {
  let imgNames: string[] = [];
  try {
    if (fields.images) {
      fields.images.map((item: any) => {
        imgNames.push(item.newFilename);
      });
    }
    console.log(imgNames);
    // return true;
    await axios.post("http://localhost:8000/api/log/insertLog", {
      title: fields.title,
      spot_pk: fields.spotPk,
      content: fields.content,
      user_pk: fields.userPk,
      images: imgNames,
    });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default handler;
