import axios from "axios";
import mysql from "mysql";
import { User } from "./types";

const _createConnection = (): mysql.Connection => {
  return mysql.createConnection({
    host: process.env.DATABASE_ENDPOINT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: "rapidd",
  });
};

export const GCV = {
  annotateImage: async (image: string) => {
    return await axios({
      url: `https://vision.googleapis.com/v1/images:annotate?key=${process.env.API_KEY}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      data: {
        requests: [
          {
            image: {
              content: image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
              },
            ],
          },
        ],
      },
    });
  },
};

export const Database = {
  User: {
    create: async (id: string, email: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `INSERT INTO users (id, email) VALUES ("${id}", "${email}");`,
          (err: mysql.MysqlError, result: any) => {
            connection.end();
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    },
    read: async (id: string): Promise<User> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `SELECT * FROM users where ID="${id}"`,
          (err: mysql.MysqlError, result: any) => {
            connection.end();
            if (err) {
              reject(err);
            } else if (result && result.length > 0) {
              resolve(result[0] as User);
            } else {
              reject(new Error("User does not exist!"));
            }
          }
        );
      });
    },
  },
  seed: async () => {
    const connection = _createConnection();
    try {
      connection.connect();
      connection.query(
        `CREATE TABLE users (id VARCHAR(30) PRIMARY KEY UNIQUE NOT NULL, email VARCHAR(150) UNIQUE NOT NULL, verifiedDriver BOOLEAN NOT NULL DEFAULT FALSE);`,
        (err: mysql.MysqlError, result: any) => {
          if (err) {
            console.warn(err);
          }
        }
      );
      connection.end();
    } catch (err) {
      console.warn(err);
    }
  },
};
