"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import useMap from "@/hooks/useMap";
import SearchInput from "./SearchInput";
import AutocompleteContainer from "./Search";
import Image from "@/app/admin/_components/image";

interface Position {
  lat?: number | undefined;
  lng?: number | undefined;
}

const markerStyle = {
  color: "black",
  fontWeight: "bold",
  fontSize: "28px",
};

export default function GoogleMapContainer() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const router = useRouter();

  const { mapInfo, markerToggle, setMarkerToggle, setMapInfo } = useMap();
  const [directionResponse, setDirectionResponse] = useState(null);

  const destinationRef = useRef();

  const [mapRef, setMapRef] = useState(null);
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
    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: new google.maps.LatLng(currLocation.lat, currLocation.lng),
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionResponse(results);
  };

  const clearRoute = () => {
    setDirectionResponse(null);
    destinationRef.current.value = "";
    mapRef?.setZoom(15);
    mapRef?.panTo(currLocation);
  };

  const recenter = () => {
    if (directionResponse) {
      calculateRoute();
      return;
    } else {
      mapRef?.setZoom(15);
      mapRef?.panTo(currLocation);
    }
  };

  const handleUserKeyPress = useCallback(
    ({ key }: any) => {
      if (key === "r") {
        if (directionResponse) {
          calculateRoute();
          return;
        } else {
          mapRef?.setZoom(15);
          mapRef?.panTo(currLocation);
        }
      }
    },
    [currLocation, mapRef]
  );

  const toggleMarker = (id: string) => {
    const tempMarkerToggle = markerToggle;
    tempMarkerToggle[id] = !tempMarkerToggle[id];
    setMarkerToggle(tempMarkerToggle);
    router.refresh();
  };

  const handleMarkerButton = async (id: any) => {
    const position = mapInfo[id]?.position;
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: position });
    const positionAddress = response.results[0].formatted_address;
    destinationRef.current.value = positionAddress;
    await calculateRoute();
  };

  const goToNearest = async () => {
    const directionsService = new google.maps.DirectionsService();
    const geocoder = new google.maps.Geocoder();
    const mapInfoIdArr = Object.keys(mapInfo);
    let nearestResult: any = null;
    let nearestDistance: any = null;
    let nearestIdx: any = null;

    for (let i = 0; i < mapInfoIdArr.length; i++) {
      const position = mapInfo[mapInfoIdArr[i]]?.position;
      const result = await directionsService.route({
        origin: new google.maps.LatLng(currLocation.lat, currLocation.lng),
        destination: new google.maps.LatLng(position.lat, position.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      });
      const distance = result.routes[0].legs[0].distance.value;
      if (nearestDistance === null || distance < nearestDistance) {
        nearestDistance = distance;
        nearestResult = result;
        nearestIdx = i;
      }
    }

    const response = await geocoder.geocode({
      location: mapInfo[mapInfoIdArr[nearestIdx]].position,
    });
    destinationRef.current.value = response.results[0].formatted_address;
    await calculateRoute();
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

  return (
    <div className="relative h-screen w-screen">
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
              {markerToggle[id] && (
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
          {directionResponse && (
            <DirectionsRenderer directions={directionResponse} />
          )}
        </GoogleMap>
      )}
      <div className="absolute top-0 left-0 p-4">
        <AutocompleteContainer destinationRef={destinationRef} calculateRoute={calculateRoute} />
        <SearchInput destinationRef={destinationRef} onGoClick={calculateRoute} />
      </div>
    </div>
  );
}