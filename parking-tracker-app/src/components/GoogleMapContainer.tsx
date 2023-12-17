"use client";
import { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  useGoogleMap,
  InfoWindow,
  OverlayView
} from "@react-google-maps/api";
import useMap from "@/hooks/useMap";
import { io } from "socket.io-client";
import Image from "@/app/admin/_components/Imageformap";
interface Position {
  lat?: number | undefined;
  lng?: number | undefined;
}
const socketUrl: any = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
//const socketPath: any = process.env.NEXT_PUBLIC_SOCKET_PATH;

export default function GoogleMapContainer() {
  const { mapInfo, markerToggle, setMarkerToggle, setMapInfo } = useMap();

  /*
  useEffect(() => {
    const socket = io(socketUrl);
    socket.on("initialization", (data: any) => {
      setMapInfo(data);
    });
    socket.on("update", (data: any) => {
      const { id, currMotor } = data;
      setMapInfo((prev) => ({
        ...prev,
        ...(prev[id]["currMotor"] = currMotor),
      }));
    });
  }, []);*/

  useEffect(() => {
    console.log(mapInfo);
  }, [mapInfo]);

  useEffect(() => {
    console.log(markerToggle);
  }, [markerToggle]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [mapRef, setMapRef] = useState();
  const [currLocation, setCurrLocation] = useState<Position>({
    lat: 0,
    lng: 0,
  });

  const onMapLoad = (map: any) => {
    setMapRef(map);
  };

  const handleMarkerClick = () => {
    mapRef?.panTo(currLocation);
  };

  const toggleMarker = (id: string) => {
    console.log(`run toggle marker for id:${id}`);
    const tempMarkerToggle = markerToggle;
    tempMarkerToggle[id] = tempMarkerToggle[id] ? false : true;
    setMarkerToggle(tempMarkerToggle);
    console.log(markerToggle);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrLocation({ lat: latitude, lng: longitude });
      });
      const watcher = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const markerStyle = {
    color: "black",
    fontWeight: "bold",
    fontSize: "28px",
  };

  return (
    <div className="h-screen w-screen">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="h-full"
          center={currLocation}
          zoom={15}
          onLoad={onMapLoad}
          fullscreenControl={false}
        >
          <Marker
            key="user-location"
            position={currLocation}
            icon={{
              url: "/motor.png",
              scaledSize: new google.maps.Size(60, 60),
            }}
            onClick={handleMarkerClick}
          />
          {Object.keys(mapInfo).map((id) => (
            <Marker
              key={id}
              position={mapInfo[id].position}
              icon={{
                url:
                  mapInfo[id].currMotor < mapInfo[id].maxSpace
                    ? "/available.png"
                    : "/full.png",
                scaledSize:
                  mapInfo[id].currMotor < mapInfo[id].maxSpace
                    ? new google.maps.Size(60, 60)
                    : new google.maps.Size(40, 40),
              }}
              onClick={() => toggleMarker(id)}
              label={{
                text: `Parking Space : ${mapInfo[id].currMotor}/${mapInfo[id].maxSpace}`,
                style: markerStyle,
              }}
            >
            {markerToggle[id]=true && (
              <InfoWindow
                key={`info-window-${id}`}
                position={mapInfo[id].position}
                onCloseClick={() => toggleMarker(id)}
              >
                <div style={{ width: '300px', height: '300px' }}>
                  <p>ID: {id}</p>
                  <p>Coordinates: {mapInfo[id].position.lat}, {mapInfo[id].position.lng}</p>
                  <p>Current Motor: {mapInfo[id].currMotor}</p>
                  <p>Max Space: {mapInfo[id].maxSpace}</p>
                  <Image folderPath={id} alt={`Parking Space ${id}`} />
                </div>
              </InfoWindow>
            )}
            </Marker>
          ))}
        </GoogleMap>
      )}
    </div>
  );
}