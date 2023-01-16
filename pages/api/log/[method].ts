/**
 * 로그를 작성할 때 DB에 저장된 '동을 .
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

// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";
// import nextConnect from "next-connect";
// import multer from "multer";
// import path from "path";

interface Data {
  ok: boolean;
}

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: {
//     method: string;
//     type: string;
//     title?: string;
//     content?: string;
//     spotPk?: string;
//     userPk: string;
//     images: object;
//   };
// }
/**
 *
 * @param req client에서 전송된 정보
 * @param res client에  리턴할 정보
 */
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   const {
//     body: { images, userPk, spotPk, content, title, type },
//   } = req;
//   let resp: any;

//   console.log("heelo", req.body.data);
//   // if (type === "insert" && title && content && spotPk && userPk) {
//   //   resp = insertLog(title, content, spotPk, userPk, images);
//   // }
//   res.status(200).json({
//     ok: true,
//   });
//   // res.status(500).json({
//   //   ok: false,
//   // });
// }

// }
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
    form.parse(req, async (err, fields, files) => {
      await insertLog(
        fields.title,
        fields.content,
        fields.spotPk,
        fields.userPk,
        files.file
      );

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
async function insertLog<T>(
  title: string,
  content: string,
  spotPk: string,
  userPk: string,
  images?: any[]
): Promise<T | unknown> {
  let imgNames: string[] = [];
  try {
    if (images) {
      images.map((item) => {
        imgNames.push(item.newFilename);
      });
    }
    console.log(imgNames);
    // return true;
    await axios.post("http://localhost:8000/api/log/insertLog", {
      title: title,
      spot_pk: spotPk,
      content: content,
      user_pk: userPk,
      images: imgNames,
    });
    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default handler;
