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
): Promise<{ fields: formidable.Fields; files: formidable.Files; id: any }> => {
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
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields: any, files) => {
      let id = await insertLog(fields, files);

      if (err) reject(err);
      resolve({ fields, files, id });
    });
  });
};

// const;

const handler: NextApiHandler = async (req, res) => {
  let resp: any;
  const {
    query: { method },
  } = req;
  console.log("request 파라미터", method);
  /**
   * 파일 업로드 및 데이터를 DB서버에 전송하는 로직입니다.
   */
  switch (method) {
    case "insertLog":
      try {
        await fs.readdir(path.join(process.cwd() + "/public", "/uploads"));
      } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/uploads"));
      }
      resp = await readFile(req, true);
      console.log(resp);
      res.json({ id: resp.id, done: "ok" });
      break;

    case "selectLog":
      resp = await selectLog(req);
      console.log(resp);
      res.json({ r: true, row: resp.row, isImgLog: resp.isImgLog });
      break;
  }
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
  fields: InsertLogProps,
  files: any
): Promise<T | unknown> {
  let imgNames: string[] = [];
  try {
    // 이미지가 있는지 체크하여 있을 경우 저장될 이름만 별도의 array에 할당합니다.
    console.log("@@@@@@@@@@@@@@@", files);
    Array.isArray(files.file)
      ? files.file.map((item: any) => {
          imgNames.push(item.newFilename);
        })
      : imgNames.push(files.file.newFilename);

    let id;
    // DB서버로 데이터를 전송합니다. 결과가 성공적일 경우, log pk를 전달받아 뷰단으로 return합니다.
    await axios
      .post("http://localhost:8000/api/log/insertLog", {
        title: fields.title,
        spot_pk: fields.spotPk,
        content: fields.content,
        user_pk: fields.userPk,
        images: imgNames,
      })
      .then((resp) => {
        id = resp.data.id;
      });
    return id;
  } catch (err) {
    console.log(err);
    return err;
  }
}

/**
 * DB서버에 log와 image를 요청합니다.
 *
 * @param logPk log 테이블 pk
 * @returns
 */
async function selectLog<T>(req: NextApiRequest): Promise<T | unknown> {
  const {
    query: { logPk },
  } = req;

  try {
    // DB서버로 데이터를 전송합니다. 결과가 성공적일 경우, log 내용과 이미지명을 제공받습니다.
    const log = await axios.get("http://localhost:8000/api/log/selectLog", {
      params: {
        logPk: logPk,
      },
    });
    return log.data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export default handler;
