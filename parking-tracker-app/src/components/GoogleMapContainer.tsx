"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  useGoogleMap,
  InfoWindow,
  OverlayView,
  Autocomplete,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import useMap from "@/hooks/useMap";
import Image from "next/image";
import { io } from "socket.io-client";
import Button from "./Button";
import SearchInput from "./SearchInput";

interface Position {
  lat?: number | undefined;
  lng?: number | undefined;
}
const socketUrl: any = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
//const socketPath: any = process.env.NEXT_PUBLIC_SOCKET_PATH;

export default function GoogleMapContainer() {
  const { mapInfo, markerToggle, setMarkerToggle, setMapInfo } = useMap();
  const [coords, setCoords] = useState(null);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState<String>("");
  const [duration, setDuration] = useState<String>("");
  const [autoComplete, setAutoComplete] = useState(null);

  const destinationRef = useRef();

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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const [mapRef, setMapRef] = useState();
  const [currLocation, setCurrLocation] = useState<Position>({
    lat: 0,
    lng: 0,
  });

  const onMapLoad = (map: any) => {
    setMapRef(map);
  };

  const calculateRoute = async () => {
    if (destinationRef?.current.value === "") {
      return;
    }
    console.log(destinationRef.current.value);
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: new google.maps.LatLng(currLocation.lat, currLocation.lng),
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const clearRoute = () => {
    setDirectionResponse(null);
    setDistance("");
    setDuration("");
    destinationRef.current.value = "";
    mapRef?.setZoom(15);
    mapRef?.panTo(currLocation);
  };

  /*
  const onLoad = (autoC: any) => setAutoComplete(autoC);

  const onPlaceChanged = () => {
    const lat = autoComplete?.getPlace().geometry.location.lat();
    const lng = autoComplete?.getPlace().geometry.location.lng();
    setCoords({ lat, lng });
  };
  */

  const recenter = () => {
    if (directionResponse) {
      calculateRoute();
    } else {
      mapRef?.setZoom(15);
      mapRef?.panTo(currLocation);
    }
  };

  const handleUserKeyPress = useCallback(
    ({ key }: any) => {
      //need to use useCallback or else lupa kenapa. kalo pake handleMarkerClick, setiap re-render dia bakal ke redefined, reference nya juga beda.
      if (key === "r") {
        mapRef?.panTo(currLocation);
        mapRef?.setZoom(15);
      }
    },
    [currLocation, mapRef]
  );

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

  useEffect(() => {
    window.addEventListener("keyup", handleUserKeyPress);
    return () => {
      window.removeEventListener("keyup", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  const markerStyle = {
    color: "black",
    fontWeight: "bold",
    fontSize: "28px",
  };

  return (
    <div className="h-screen w-screen min-w-96 flex flex-row">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="h-full w-5/6 z-10">
            <GoogleMap
              mapContainerClassName="h-full"
              center={currLocation}
              zoom={15}
              onLoad={onMapLoad}
              fullscreenControl={false}
              options={{
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
              }}
            >
              <Marker
                key="user-location"
                position={currLocation}
                icon={{
                  url: "/motor.png",
                  scaledSize: new google.maps.Size(60, 60),
                }}
                onClick={recenter}
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
                  {/*markerToggle[id] && (
                <InfoWindow
                  key={`info-window-${id}`}
                  position={mapInfo[id].position}
                  onCloseClick={() => toggleMarker(id)}
                >
                  <div>hi</div>
                </InfoWindow>
              )*/}
                </Marker>
              ))}
              {directionResponse && (
                <DirectionsRenderer directions={directionResponse} />
              )}
            </GoogleMap>
          </div>
          <div className="h-full w-1/6 bg-blue-400 flex flex-col items-center z-20 pt-24 gap-y-4">
            <div className="font-bold text-xl">UTILITY BUTTON</div>
            <Button
              className="h-12 w-28"
              text={"RECENTER"}
              onClick={recenter}
            />
            <Autocomplete>
              <SearchInput
                destinationRef={destinationRef}
                onGoClick={calculateRoute}
              />
            </Autocomplete>
            <Button className="h-12 w-28" text={"CLEAR"} onClick={clearRoute} />
          </div>
        </>
      )}
    </div>
  );
}
