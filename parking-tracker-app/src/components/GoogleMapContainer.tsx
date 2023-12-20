"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faBroom, faParking } from "@fortawesome/free-solid-svg-icons";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
  useJsApiLoader,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import useMap from "@/hooks/useMap";
import SearchInput from "./SearchInput";
import Image from "@/app/admin/_components/Imageformap";
import Button from "./Button";

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
  const userLoc = [25.01534580862057, 121.53059158213578]
  // 25.01534580862057, 121.53059158213578
  // 25.014761019203775, 121.53071023554331
  // 25.014471768857863, 121.53109531387497
  // 25.01389857350774, 121.53068388035796
  // 25.01282647874315, 121.52928852043242
  // 25.012360420177494, 121.52875708499637
  // 25.012007887304907, 121.52841426503778
  // 25.01186687387248, 121.52837779482938
  // 25.01193517727403, 121.52855285182955
  // 25.013343100217508, 121.53003111094182
  // 25.013452209538436, 121.53027018166745
  // 25.014077197385895, 121.53106867665343
  //
  //
  //
  // 25.014223342053366, 121.53149873371524

  const viewLoc = [25.015460845030514, 121.53052014667183] 
  const [mapRef, setMapRef] = useState(null);
  const [currLocation, setCurrLocation] = useState<Position>({
    lat: userLoc[0],
    lng:  userLoc[1],
  });
  const viewLocation:Position = {
    lat: viewLoc[0],
    lng: viewLoc[1]
  }

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
        // if (directionResponse) {
        //   calculateRoute();
        //   return;
        // } else {
          mapRef?.setZoom(17);
          mapRef?.panTo(currLocation);
        // }
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
        // setCurrLocation({ lat: latitude, lng: longitude });
      });
      const watcher = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        // setCurrLocation({ lat: latitude, lng: longitude });
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
              scaledSize: new google.maps.Size(30, 30),
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
                      ? new google.maps.Size(30, 30)
                      : new google.maps.Size(40, 40),
                }}
                onClick={() => toggleMarker(id)}
                label={{
                  text: mapInfo[id].currMotor < mapInfo[id].maxSpace 
                        ? `Parking Space: ${mapInfo[id].currMotor}/${mapInfo[id].maxSpace}`
                        : "Full",
                  color: "black", // Example property
                  fontSize: "12px", // Example property
                  // Add other styling properties supported by MarkerLabel here
                }}
              >
              {markerToggle[id] && (
                <InfoWindow
                  key={`info-window-${id}`}
                  position={mapInfo[id].position}
                  onCloseClick={() => toggleMarker(id)}
                >
                  <div style={{ width: '300px', height: '300px', padding: '16px', fontFamily: 'Arial, sans-serif', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px', background: '#fff', color: '#333' }}>
                    <h2 style={{ fontSize: '1.2em', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Parking Space </h2>
                    <p style={{ fontSize: '0.9em', margin: '8px 0' }}>ID: {id}</p>
                    <p style={{ fontSize: '0.9em', margin: '8px 0' }}>Coordinates: {mapInfo[id].position.lat}, {mapInfo[id].position.lng}</p>
                    <p style={{ fontSize: '0.9em', margin: '8px 0' }}>Current Motor: {mapInfo[id].currMotor}</p>
                    <p style={{ fontSize: '0.9em', margin: '8px 0' }}>Max Space: {mapInfo[id].maxSpace}</p>
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <Image folderPath={id} alt={`Parking Space ${id}`} />
                    </div>
                    <Button
                        key={`info-window-button-${id}`}
                        className="h-4 w-10"
                        text={"GO"}
                        onClick={() => {
                          handleMarkerButton(id);
                        }}
                      />                    
                  </div>

                </InfoWindow>
              )}
            </Marker>
          ))}
        <div className="absolute top-20 pl-3 flex items-center">
          <Autocomplete>
            <SearchInput destinationRef={destinationRef} onGoClick={calculateRoute} />
          </Autocomplete>
          <div className="h-8 w-8 ml-2 rounded-full bg-black flex items-center justify-center">
            <FontAwesomeIcon icon={faBroom} className="text-2xl text-white" onClick={clearRoute} />
          </div>
        </div>
        <div className="absolute top-10 py-24 pl-5 cursor-pointer">
          <FontAwesomeIcon
            icon={faCompass}
            className="text-4xl text-black-500"
            onClick={recenter}
          />
        </div>
        <div className="absolute top-10 py-36 pl-5 cursor-pointer">
          <FontAwesomeIcon
            icon={faParking}
            className="text-4xl text-black-500"
            onClick={goToNearest}
          />
        </div>

          {directionResponse && (
            <DirectionsRenderer directions={directionResponse} />
          )}
        </GoogleMap>
      )}

    </div>
  );
}