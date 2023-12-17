"use client";
import { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import useMap from "@/hooks/useMap";
import Image from "next/image";
import { io } from "socket.io-client";
import axios from "axios";

interface Position {
  lat?: number | undefined;
  lng?: number | undefined;
}
const socketUrl: any = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

export default function GoogleMapContainer() {
  const { mapInfo, markerToggle, setMarkerToggle, setMapInfo } = useMap();
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

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
  }, []);

  useEffect(() => {
    console.log(mapInfo);
  }, [mapInfo]);

  useEffect(() => {
    console.log(markerToggle);
  }, [markerToggle]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [currLocation, setCurrLocation] = useState<Position>({
    lat: 0,
    lng: 0,
  });

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

  const handleMarkerClick = async (id: string | null) => {
    setSelectedMarker(id);
    if (id) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=photo&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const photoReference =
          response.data.result.photos?.[0]?.photo_reference;
        if (photoReference) {
          setPhotoUrl(
            `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&sensor=false&maxheight=400&maxwidth=600&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          );
        } else {
          setPhotoUrl(null);
        }
      } catch (error) {
        console.error("Error fetching photo:", error);
        setPhotoUrl(null);
      }
    } else {
      setPhotoUrl(null);
    }
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
        >
          <Marker
            key="user-location"
            position={currLocation}
            icon={{
              url: "/motor.png",
              scaledSize: new google.maps.Size(60, 60),
            }}
            onClick={() => handleMarkerClick(null)}
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
              onClick={() => handleMarkerClick(id)}
              label={{
                text: `Parking Space : ${mapInfo[id].currMotor}/${mapInfo[id].maxSpace}`,
                style: markerStyle,
              }}
            >
              {selectedMarker === id && (
                <InfoWindow
                  key={`info-window-${id}`}
                  position={mapInfo[id].position}
                  onCloseClick={() => handleMarkerClick(null)}
                >
                  <div>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt="Location Image"
                        width={400}
                        height={300}
                      />
                    ) : (
                      <p>No photo available</p>
                    )}
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
