import { useState, useEffect, useRef } from 'react';

// Utility to get a small random number
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export default function useFakeTelemetry() {
  // Initial home position (lat, lon). For example, San Francisco:
  const homePos = { lat: 37.7749, lon: -122.4194 };
  const [position, setPosition] = useState(homePos);
  const [path, setPath] = useState([homePos]);    // array of {lat,lon}
  const [battery, setBattery] = useState(100);    // percentage
  const [altitude, setAltitude] = useState(0);    // meters
  const [speed, setSpeed] = useState(0);          // m/s
  const [heading, setHeading] = useState(0);      // degrees
  const [isPaused, setIsPaused] = useState(false);
  const [isLanded, setIsLanded] = useState(false);

  // On each tick, update telemetry if not paused or landed
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isLanded) {
        // Simulate movement: small random offset
        const deltaLat = randomInRange(-0.0005, 0.0005);
        const deltaLon = randomInRange(-0.0005, 0.0005);
        const newPos = {
          lat: position.lat + deltaLat,
          lon: position.lon + deltaLon
        };
        // Update path and position
        setPath(prev => [...prev, newPos]);
        setPosition(newPos);

        // Simulate battery drain
        setBattery(prev => Math.max(prev - randomInRange(0.1, 0.5), 0));

        // Simulate altitude change (e.g. between 0 and 100m)
        setAltitude(prev => Math.max(prev + randomInRange(-1, 1), 0));

        // Simulate speed (0–20 m/s)
        setSpeed(randomInRange(0, 20));

        // Simulate heading (0–359°)
        setHeading(prev => (prev + randomInRange(-10, 10) + 360) % 360);
      }
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, [position, isPaused, isLanded]);

  // Return Home: reset to home position, full battery, no path
  const returnHome = () => {
    setPosition(homePos);
    setPath([homePos]);
    setAltitude(0);
    setSpeed(0);
    setHeading(0);
    setBattery(100);
    setIsPaused(false);
    setIsLanded(false);
  };

  // Land: stop movement, set altitude to 0
  const land = () => {
    setIsLanded(true);
    setAltitude(0);
    setSpeed(0);
  };

  // Pause/Resume toggle
  const togglePause = () => setIsPaused(prev => !prev);

  return {
    position,
    path,
    battery,
    altitude,
    speed,
    heading,
    isPaused,
    returnHome,
    land,
    togglePause
  };
}
