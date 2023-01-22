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

import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import axios from "axios";
import aws from "aws-sdk";
import fs from "fs";
import { authCheck } from "../auth/auth";

interface InsertLogProps {
  title: string;
  content: string;
  spotPk: string;
  userPk: string;
  representImg: string;
  images?: [];
}

// 파일형식을 읽어올 때 multipart/multi-form 형식이기 때문에 기존 바디파서를 지워줍니다.
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * formidable을 활용하여 AWS S3에 이미지를 업로드합니다.
 * 프로미스 공부할 것
 * formidable 공부할 것
 *
 * @param req
 * @param saveLocally
 * @returns
 */
const saveS3 = async (req: NextApiRequest) => {
  try {
    console.log("start insert s3");
    let fileNames = [];
    let res;
    const fileData: any = await new Promise((resolve, reject) => {
      const options: formidable.Options = {};
      options.multiples = true;
      options.filename = (name, ext, path, form) => {
        // 공백일 경우 backgroundImageUrl css가 적용이 되지않기때문에,
        // 공백을 언더바로 치환합니다.
        let newName = path.originalFilename?.replace(/\s/g, "_");
        return Date.now().toString() + "_" + newName;
      };

      const form = new formidable.IncomingForm(options);
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        return resolve({ fields, files });
      });
    });
    if (Array.isArray(fileData.files.file)) {
      console.log("is Array true");

      const resp = fileData.files.file.map(async (file: any) => {
        res = await uploadS3(file);
        return res;
      });
      await Promise.all(resp);
      console.log(resp);
    } else {
      console.log("single");
      res = await uploadS3(fileData.files.file);
      console.log(res);
    }
    if (res) {
      let id = insertLog(fileData.fields, fileData.files);
      return id;
    } else {
      console.log("@@res", res);
    }
  } catch (err) {
    console.log(err);
  }
};

const uploadS3 = async (file: any) => {
  const fileBuffer = fs.createReadStream(file.filepath);
  fileBuffer.on("error", (err) => console.log(err));
  const fileName = "fsupload/" + file.newFilename;
  // s3 클라이언트 연결
  const s3 = new aws.S3({
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY
        ? process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY
        : "",
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY
        ? process.env.NEXT_PUBLIC_AWS_S3_SECRET_KEY
        : "",
    },
    region: "ap-northeast-2",
  });

  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKEY_NAME
      ? process.env.NEXT_PUBLIC_AWS_S3_BUCKEY_NAME
      : "",
    Key: fileName,
    ACL: "public-read",
    Body: fileBuffer,
    ContentType: "img/png",
  };
  let res;

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err: any, data: any) {
      // err가 null 이면 성공
      // 성공하면 maria DB에 insert
      if (err == null) {
        console.log("success upload s3!");
        res = true;
        resolve({ res, fileName });
      } else {
        console.log(err);
        res = false;
      }
    });
  });
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
    console.log("@@fields = ", fields);
    Array.isArray(files.file)
      ? files.file.map((item: any) => {
          imgNames.push(item.newFilename);
        })
      : imgNames.push(files.file.newFilename);

    let representImg = imgNames.find((item) => {
      let reg = item.split("_")[0];
      return item.split(reg + "_")[1] == fields.representImg;
    });
    let id;
    // DB서버로 데이터를 전송합니다. 결과가 성공적일 경우, log pk를 전달받아 뷰단으로 return합니다.
    await axios
      .post("http://localhost:8000/api/log/insertLog", {
        title: fields.title,
        spot_pk: fields.spotPk,
        content: fields.content,
        user_pk: fields.userPk,
        images: imgNames,
        representImg: representImg,
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

/**
 * DB서버에 userPk에 해당하는 로그리스트를 요청합니다.
 *
 * @param userPk user 테이블 pk
 * @returns
 */
async function selectListLog<T>(req: NextApiRequest): Promise<T | unknown> {
  const {
    query: { userPk, spotPk, type },
  } = req;
  if (typeof type == "string") {
    let param = userPk ? userPk : spotPk;
    try {
      // DB서버로 데이터를 전송합니다. 결과가 성공적일 경우, log 내용과 이미지명을 제공받습니다.
      const logList = await axios.get(
        "http://localhost:8000/api/log/selectListLog",
        {
          params: {
            [type]: param,
          },
        }
      );
      return logList.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
}

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
      resp = await saveS3(req);
      console.log("@@resp", resp);
      res.json({ done: "ok", id: resp });
      break;

    case "selectLog":
      resp = await selectLog(req);
      resp.r
        ? res.json({ r: true, row: resp.row, isImgLog: resp.isImgLog })
        : res.json({ r: false });
      break;

    case "selectListLog":
      resp = await selectListLog(req);
      console.log(resp);
      res.json({ r: true, row: resp.row, isImgLog: resp.isImgLog });
      break;
  }
};

export default handler;
