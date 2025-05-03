import React, { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Polygon, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

function MapEvents({ onMapClick, enablePointSelection }) {
  useMapEvents({
    click: (e) => {
      if (enablePointSelection && onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

export default function MapView({
  latitude,
  longitude,
  path,
  yaw,
  mapRef: externalRef,
  enablePointSelection = false,
  onMapClick,
  areaPoints = [],
  dronePosition,
  dronePath = [],
}) {
  const localRef = useRef(null);

  useEffect(() => {
    if (externalRef && localRef.current) {
      externalRef.current = localRef.current;
    }
  }, [externalRef]);

  if (!latitude || !longitude) {
    return <div className="map card">Waiting for location...</div>;
  }

  const center = [latitude, longitude];
  const rotatedIcon = new L.DivIcon({
    html: `<div style="transform: rotate(${yaw}deg); font-size: 30px;">🛩️</div>`,
    className: "",
    iconSize: [30, 30],
  });

  const droneIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "500px", width: "100%" }}
        whenCreated={(mapInstance) => {
          localRef.current = mapInstance;
          if (externalRef) externalRef.current = mapInstance;
        }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={rotatedIcon} />
        {areaPoints.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]} icon={droneIcon} />
        ))}
        {areaPoints.length >= 3 && (
          <Polygon
            positions={areaPoints.map((p) => [p.lat, p.lng])}
            pathOptions={{ color: "red", fillOpacity: 0.4 }}
          />
        )}
        {path.length > 0 && (
          <Polyline positions={path} pathOptions={{ color: "blue", weight: 3 }} />
        )}
        {dronePosition && <Marker position={[dronePosition.lat, dronePosition.lng]} icon={droneIcon} />}
        {dronePath.length > 0 && (
          <Polyline positions={dronePath} pathOptions={{ color: "green", weight: 3 }} />
        )}
        {enablePointSelection && <MapEvents onMapClick={onMapClick} enablePointSelection={enablePointSelection} />}
      </MapContainer>
    </div>
  );
}