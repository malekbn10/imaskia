// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

/**
 * Calculate Qibla angle from a given position
 * Returns degrees from North (clockwise)
 */
export function getQiblaAngle(lat: number, lng: number): number {
  const latRad = toRadians(lat);
  const lngRad = toRadians(lng);
  const kaabaLatRad = toRadians(KAABA_LAT);
  const kaabaLngRad = toRadians(KAABA_LNG);

  const dLng = kaabaLngRad - lngRad;

  const x = Math.sin(dLng);
  const y =
    Math.cos(latRad) * Math.tan(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(dLng);

  let angle = Math.atan2(x, y);
  angle = toDegrees(angle);

  // Normalize to 0-360
  return ((angle % 360) + 360) % 360;
}

/**
 * Calculate great-circle distance to Mecca in kilometers
 */
export function getDistanceToMecca(lat: number, lng: number): number {
  const R = 6371; // Earth's radius in km
  const latRad = toRadians(lat);
  const kaabaLatRad = toRadians(KAABA_LAT);
  const dLat = toRadians(KAABA_LAT - lat);
  const dLng = toRadians(KAABA_LNG - lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latRad) * Math.cos(kaabaLatRad) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
