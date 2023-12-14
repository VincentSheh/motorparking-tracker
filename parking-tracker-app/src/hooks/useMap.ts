"use client";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
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
  const router = useRouter()

  const fetchParkings = async () => {
    const res = await fetch("http://localhost:3000/api/parkings")
    if (!res.ok) {
      setMapInfo({});
      // router.push("/map");
      return;
    }
    const data = await res.json(); 
    const parkingData = data.parkingInfos
    console.log(parkingData)
    const tempMarkerToggle = {};
    // Object.keys(parkingData).forEach((id: any) => {
    //   parkingData[id] = false
    // });
    setMarkerToggle(tempMarkerToggle);
    console.log(parkingData)
    setMapInfo(parkingData);    

  }
  useEffect(()=>{
    fetchParkings()
  
  },[router])
  
  //const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socket = io(socketUrl);
    socket.on("initialization", (data: any) => {
      // const tempMarkerToggle = {};
      // Object.keys(data).forEach((id: any) => {
      //   tempMarkerToggle[id] = false
      // });
      // setMarkerToggle(tempMarkerToggle);
      // console.log(data)
      // setMapInfo(data);
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
