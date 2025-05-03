// src/utils/coverage.js

/**
 * Given a polygon (array of {lat, lng}), generate
 * a simple lawnmower (back-and-forth) waypoint list
 * with the specified spacing in meters.
 *
 * NOTE: This is a very basic implementation that
 * treats lat/lng as a flat grid. For real missions,
 * use a proper geodesic library.
 */
export function generateLawnmower(polygon, spacingMeters) {
    if (!polygon || polygon.length < 3) return [];
  
    // Compute bounding box
    const lats = polygon.map(p => p.lat);
    const lngs = polygon.map(p => p.lng);
    const minLat = Math.min(...lats),
          maxLat = Math.max(...lats),
          minLng = Math.min(...lngs),
          maxLng = Math.max(...lngs);
  
    // Number of passes
    const passCount = Math.ceil(((maxLat - minLat) * 111000) / spacingMeters);
  
    const waypoints = [];
    for (let i = 0; i <= passCount; i++) {
      // interpolate latitude
      const lat = minLat + ((maxLat - minLat) * i) / passCount;
      // get line from minLng to maxLng or vice versa
      const lineLngs = i % 2 === 0
        ? [minLng, maxLng]
        : [maxLng, minLng];
  
      lineLngs.forEach(lng => {
        waypoints.push({ lat, lng });
      });
    }
  
    return waypoints;
  }
  