"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

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

const socketUrl: any = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
//const socketPath: any = process.env.NEXT_PUBLIC_SOCKET_PATH;

export default function useMap() {
  const [mapInfo, setMapInfo] = useState<any>({});
  const [markerToggle, setMarkerToggle] = useState<any>({});
  //const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(socketUrl);
    socket.on("initialization", (data: any) => {
      const tempMarkerToggle = {};
      Object.keys(data).forEach((id: any) => {
        tempMarkerToggle[id] = false
      });
      setMarkerToggle(tempMarkerToggle);
      setMapInfo(data);
    });
    socket.on("update", (data: any) => {
      const { id, currMotor } = data;
      setMapInfo((prev) => ({
        ...prev,
        ...(prev[id]["currMotor"] = currMotor),
      }));
    });
  }, []);
  return { mapInfo, markerToggle, setMarkerToggle, setMapInfo };
}
