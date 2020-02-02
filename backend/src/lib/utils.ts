import axios from "axios";
import mysql from "mysql";
import { User, Location, DetailedRide } from "./types";

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
  DriversLicenses: {
    create: async (email: string, data: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `INSERT INTO drivers_licenses (email, data) VALUES ("${email}", "${data}");`,
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
  },
  Location: {
    create: async (
      owner: string,
      latitude: string,
      longitude: string,
      formattedAddress: string
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `INSERT INTO locations (owner,latitude,longitude,formatted_address) VALUES ("${owner}", "${latitude}","${longitude}","${formattedAddress}");`,
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
    get: async (owner: string): Promise<Location[]> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `SELECT * FROM locations WHERE owner="${owner}";`,
          (err: mysql.MysqlError, result: any) => {
            connection.end();
            if (err) {
              reject(err);
            } else {
              const locations = result as Location[];
              resolve(locations);
            }
          }
        );
      });
    },
  },
  Ride: {
    create: async (rider: string, location: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `INSERT INTO ride_requests (rider_id, location_id) VALUES ("${rider}", "${location}");`,
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
    get: async (id: string): Promise<DetailedRide[]> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `SELECT ride_requests.id, ride_requests.rider_id, ride_requests.location_id, locations.latitude, locations.longitude, locations.formatted_address, ride_requests.created_at FROM ride_requests INNER JOIN locations WHERE ride_requests.rider_id!="${id}" AND ride_requests.location_id=locations.id;`,
          (err: mysql.MysqlError, result: any) => {
            connection.end();
            if (err) {
              reject(err);
            } else {
              const rides = result as DetailedRide[];
              resolve(rides);
            }
          }
        );
      });
    },
    exitsForRider: async (id: string): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `SELECT id FROM ride_requests WHERE rider_id="${id}";`,
          (err: mysql.MysqlError, result: any) => {
            connection.end();
            if (err) {
              reject(err);
            } else {
              const rides = result as any[];
              resolve(rides.length > 0);
            }
          }
        );
      });
    },
  },
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
    updateDriverStatus: async (
      id: number,
      verifiedDriver: boolean
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const connection = _createConnection();
        connection.connect();
        connection.query(
          `UPDATE users SET verifiedDriver=${
            verifiedDriver ? "TRUE" : "FALSE"
          } where ID="${id}";`,
          (err: mysql.MysqlError, result: any) => {
            connection.end();
            if (err) {
              reject(err);
            } else if (result && result.length > 0) {
              resolve();
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
      connection.query(
        `CREATE TABLE drivers_licenses (id INT(6) AUTO_INCREMENT PRIMARY KEY, email VARCHAR(150) UNIQUE NOT NULL, data MEDIUMTEXT NOT NULL);`,
        (err: mysql.MysqlError, result: any) => {
          if (err) {
            console.warn(err);
          }
        }
      );
      connection.query(
        `CREATE TABLE locations (id INT(6) AUTO_INCREMENT PRIMARY KEY, owner VARCHAR(30) NOT NULL, latitude VARCHAR(20) NOT NULL, longitude VARCHAR(20) NOT NULL, formatted_address VARCHAR(255) NOT NULL);`,
        (err: mysql.MysqlError, result: any) => {
          if (err) {
            console.warn(err);
          }
        }
      );
      connection.query(
        "CREATE TABLE ride_requests (id INT(6) AUTO_INCREMENT PRIMARY KEY, rider_id VARCHAR(30) NOT NULL, location_id INT(6) NOT NULL, status INT(1) NOT NULL DEFAULT 0, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);",
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
