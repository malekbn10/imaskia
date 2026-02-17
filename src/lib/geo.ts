import { City, Coordinates } from "@/types";
import { cities } from "@/data/cities";

/**
 * Euclidean distance between two coordinate points
 * Good enough for finding nearest city within Tunisia
 */
export function euclideanDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = lat1 - lat2;
  const dLng = lng1 - lng2;
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Find the nearest city from the list of Tunisian cities
 */
export function findNearestCity(lat: number, lng: number): City {
  let nearest = cities[0];
  let minDist = Infinity;

  for (const city of cities) {
    const dist = euclideanDistance(lat, lng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return nearest;
}

/**
 * Search cities by name (Arabic or French)
 */
export function searchCities(query: string): City[] {
  if (!query.trim()) return cities;
  const q = query.toLowerCase().trim();
  return cities.filter(
    (city) =>
      city.nameFr.toLowerCase().includes(q) ||
      city.nameAr.includes(q) ||
      city.id.includes(q)
  );
}

/**
 * Get a city by its ID
 */
export function getCityById(id: string): City | undefined {
  return cities.find((city) => city.id === id);
}

/**
 * Get coordinates from a city
 */
export function getCityCoords(city: City): Coordinates {
  return { lat: city.lat, lng: city.lng };
}
