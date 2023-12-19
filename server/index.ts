import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { createServer as createTcpServer } from 'net';
import dotenv from "dotenv";
import cors from "cors";

const socketIo = require("socket.io");
const net = require("net"); //For the raw socket TCP connections
const regexPattern = /^(\S+)\s+(.*)$/;

dotenv.config({ path: "./.env.local" }); //Make the env variable accessable

interface Position {
  lat?: number;
  lng?: number;
}

interface ParkingInfo {
  position?: Position;
  currMotor?: number;
  maxSpace?: number;
}

interface ParkingInfos {
  [id: string]: ParkingInfo;
}

interface UpdateParkingData {
  id: string;
  currMotor: number;
}

class Server {
  app: Express;
  server: any;
  tcpClient?: any;
  io: any;
  port?: any;
  //mlServerIp?: any;
  //mlServerPort?: any;
  tcpServer?: any;
  tcpPort?: any;
  parkingInfos: ParkingInfos;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.tcpServer = createTcpServer(this.handleTcpConnection.bind(this));
    this.io = socketIo(this.server, {
      cors: {
        origin: "*",
      },
    });
    this.port = process.env.PORT;
    this.tcpPort = process.env.TCP_PORT
    //this.mlServerIp = process.env.ML_SERVER_IP;
    //this.mlServerPort = process.env.ML_SERVER_PORT;
    //this.tcpClient = new net.Socket();

    this.setUpRoutes();
    this.setUpSocketIo();
    //this.setUpTcpClient();
    this.parkingInfos = {};
  }

  setUpRoutes() {
    this.app.use(cors());
    this.app.get("/", (req: Request, res: Response) => {
      res.send("Hello World");
    });
  }

  setUpSocketIo() {
    this.io.on("connection", (socket: any) => {
      socket.emit("initialization", this.parkingInfos);
    });
  }

  startServer() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  startTcpServer() {
    this.tcpServer.listen(this.tcpPort, () => {
      console.log(`TCP Server listening on port ${this.tcpPort}`);
    });
  }

  handleTcpConnection(socket: any) {
    socket.on("data", (data: any) => {
      const receivedData = data.toString("utf8");
      const matched = receivedData.match(regexPattern);
      if (matched) {
        try {
          const command = matched[1];
          const data = JSON.parse(matched[2]);
          if (command === "create") {
            this.handleCreateParkingInfo(data);
          }
          if (command === "update") {
            this.handleUpdateParkingInfo(data);
          }
          if (command === "test") {
            this.handleTest();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  handleCreateParkingInfo(data: ParkingInfos) {
    for (const key in data) {
      this.parkingInfos[key] = data[key];
    }
  }

  handleUpdateParkingInfo(data: UpdateParkingData) {
    const id = data["id"];
    const currMotor = data["currMotor"];
    console.log(data)
    // this.parkingInfos[id]["currMotor"] = currMotor;
    this.io.emit("update", {
      id,
      currMotor,
    });
  }

  handleTest() {
    console.log(this.parkingInfos);
  }

  /*
  setUpTcpClient() {
    this.tcpClient.on("data", (data: any) => {
      console.log(data);
    });
    this.tcpClient.on("end", () => {
      console.log("Connection to the ML server has ended");
    });
    this.tcpClient.on("error", (err: any) => {
      console.log("TCP Client error :", err.message);
    });
  }

  startTcpClient() {
    this.tcpClient.connect(this.mlServerPort, this.mlServerIp, () => {
      console.log("Connecting to ML server via TCP...");
    });
  }
  */
}
const server = new Server();
server.startServer();
server.startTcpServer();