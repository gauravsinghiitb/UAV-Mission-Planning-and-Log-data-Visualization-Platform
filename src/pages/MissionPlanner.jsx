import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import MapView from "../components/MapView";
import FlightSettings from "../components/FlightSettings";
import WaypointList from "../components/WaypointList";
import LiveTelemetry from "../components/LiveTelemetry";
import "./MissionPlanner.css";

export default function MissionPlanner() {
  const [points, setPoints] = useState([]);
  const [path, setPath] = useState([]);
  const [altitude, setAltitude] = useState(100); // meters
  const [speed, setSpeed] = useState(10); // m/s
  const mapRef = useRef(null);

  // Handle map clicks to add points
  const handleMapClick = (latlng) => {
    setPoints([...points, { lat: latlng.lat, lng: latlng.lng }]);
  };

  // Point-in-polygon test (ray-casting algorithm)
  const isPointInPolygon = (point, polygon) => {
    const x = point.lat;
    const y = point.lng;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat;
      const yi = polygon[i].lng;
      const xj = polygon[j].lat;
      const yj = polygon[j].lng;
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Calculate polygon area using the shoelace formula (in degrees², approximate)
  const calculatePolygonArea = (polygon) => {
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      area += polygon[i].lat * polygon[j].lng;
      area -= polygon[j].lat * polygon[i].lng;
    }
    area = Math.abs(area) / 2;
    return area;
  };

  // Calculate path distance
  const calculatePathDistance = (path) => {
    let distance = 0;
    for (let i = 1; i < path.length; i++) {
      distance += L.latLng([path[i - 1].lat, path[i - 1].lng]).distanceTo(
        L.latLng([path[i].lat, path[i].lng])
      );
    }
    return distance;
  };

  // Rotate a point around the origin by an angle (in degrees)
  const rotatePoint = (point, angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);
    return {
      lat: point.lat * cosA - point.lng * sinA,
      lng: point.lat * sinA + point.lng * cosA,
    };
  };

  // Generate lawnmower path for a given angle
  const generateLawnmowerPath = (polygon, angleDeg, spacingMeters) => {
    // Rotate polygon points
    const rotatedPoints = polygon.map((p) => rotatePoint(p, angleDeg));
    const lats = rotatedPoints.map((p) => p.lat);
    const lngs = rotatedPoints.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const metersPerDegree = 111000;
    const spacingLat = spacingMeters / metersPerDegree;
    const spacingLng = spacingMeters / metersPerDegree;
    const waypoints = [];
    let direction = 1; // 1 for left-to-right, -1 for right-to-left
    for (let lat = minLat; lat <= maxLat; lat += spacingLat) {
      const lngStart = direction === 1 ? minLng : maxLng;
      const lngEnd = direction === 1 ? maxLng : minLng;
      for (
        let lng = lngStart;
        direction === 1 ? lng <= lngEnd : lng >= lngEnd;
        lng += direction * spacingLng
      ) {
        // Rotate back to original coordinates
        const rotatedPoint = { lat, lng };
        const originalPoint = rotatePoint(rotatedPoint, -angleDeg);
        if (isPointInPolygon(originalPoint, polygon)) {
          waypoints.push(originalPoint);
        }
      }
      direction *= -1; // Alternate direction
    }
    return waypoints;
  };

  // Generate optimized path with adaptive spacing
  const generatePath = () => {
    if (points.length < 3) {
      setPath([]);
      return;
    }
    // Calculate adaptive spacing based on polygon area
    const areaDeg2 = calculatePolygonArea(points);
    const areaM2 = areaDeg2 * (111000 * 111000); // Approximate area in square meters
    let spacingMeters = Math.sqrt(areaM2) / 5; // Proportional to sqrt(area)
    spacingMeters = Math.max(10, Math.min(20, spacingMeters)); // Clamp between 10-20 meters
    const angles = [0, 45, 90]; // Test orientations
    let bestPath = [];
    let bestDistance = Infinity;
    angles.forEach((angle) => {
      const candidatePath = generateLawnmowerPath(points, angle, spacingMeters);
      const distance = calculatePathDistance(candidatePath);
      if (distance < bestDistance && candidatePath.length > 0) {
        bestPath = candidatePath;
        bestDistance = distance;
      }
    });
    setPath(bestPath);
  };

  // Automatically generate path when points change
  useEffect(() => {
    generatePath();
  }, [points]);

  // Calculate mission metrics
  const calculateMetrics = () => {
    const distance = calculatePathDistance(path);
    const time = distance / speed / 60; // time in minutes
    return { distance, time };
  };
  const { distance, time } = calculateMetrics();

  return (
    <div className="mission-planner">
      <h2>Mission Planner</h2>
      <div className="planner-container">
        <div className="map-container">
          <MapView
            latitude={points.length > 0 ? points[0].lat : 27.02}
            longitude={points.length > 0 ? points[0].lng : 81.05}
            path={path.map((wp) => [wp.lat, wp.lng])}
            yaw={0}
            mapRef={mapRef}
            enablePointSelection={true}
            onMapClick={handleMapClick}
            areaPoints={points}
          />
        </div>
        <div className="sidebar">
          <div className="point-list">
            <h3>Area Points</h3>
            {points.map((point, index) => (
              <div key={index} className="point-input">
                <input
                  type="number"
                  step="any"
                  value={point.lat}
                  onChange={(e) => {
                    const newPoints = [...points];
                    newPoints[index].lat = parseFloat(e.target.value) || point.lat;
                    setPoints(newPoints);
                  }}
                />
                <input
                  type="number"
                  step="any"
                  value={point.lng}
                  onChange={(e) => {
                    const newPoints = [...points];
                    newPoints[index].lng = parseFloat(e.target.value) || point.lng;
                    setPoints(newPoints);
                  }}
                />
                <button
                  onClick={() => {
                    const newPoints = points.filter((_, i) => i !== index);
                    setPoints(newPoints);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const map = mapRef.current;
                if (map) {
                  const center = map.getCenter();
                  setPoints([...points, { lat: center.lat, lng: center.lng }]);
                }
              }}
              className="add-point-btn"
            >
              Add Point
            </button>
          </div>
          <FlightSettings
            altitude={altitude}
            setAltitude={setAltitude}
            speed={speed}
            setSpeed={setSpeed}
          />
          <WaypointList waypoints={path} setWaypoints={setPath} />
          <LiveTelemetry />
          <div className="metrics">
            <h3>Mission Metrics</h3>
            <p>Distance: {distance.toFixed(2)} meters</p>
            <p>Time: {time.toFixed(2)} minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}