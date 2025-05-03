export function generateLawnmower(polygon, spacingMeters) {
  if (!polygon || polygon.length < 3) return [];
  const lats = polygon.map((p) => p.lat);
  const lngs = polygon.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const passCount = Math.ceil(((maxLat - minLat) * 111000) / spacingMeters);
  const waypoints = [];
  for (let i = 0; i <= passCount; i++) {
    const lat = minLat + ((maxLat - minLat) * i) / passCount;
    const lineLngs = i % 2 === 0 ? [minLng, maxLng] : [maxLng, minLng];
    lineLngs.forEach((lng) => {
      waypoints.push({ lat, lng });
    });
  }
  return waypoints;
}