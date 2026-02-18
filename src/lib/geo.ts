import { City, Coordinates } from "@/types";
import { cities as localCities } from "@/data/cities";

const MUNICIPALITY_API = "https://tn-municipality-api.vercel.app/api/municipalities";

// ── Types for the external API ──────────────────

interface Delegation {
  Name: string;
  NameAr: string;
  Value: string;
  PostalCode: string;
  Latitude: number;
  Longitude: number;
}

interface Governorate {
  Name: string;
  NameAr: string;
  Value: string;
  Delegations: Delegation[];
}

// ── Convert API delegation to our City type ─────

function delegationToCity(gov: Governorate, del: Delegation): City {
  return {
    id: `${gov.Value}_${del.Value}_${del.PostalCode}`.toLowerCase().replace(/\s+/g, "_"),
    nameAr: del.NameAr,
    nameFr: del.Name,
    lat: del.Latitude,
    lng: del.Longitude,
  };
}

// ── Euclidean distance (kept for local fallback) ─

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

// ── Local fallback (static 48 cities) ───────────

export function findNearestCity(lat: number, lng: number): City {
  let nearest = localCities[0];
  let minDist = Infinity;
  for (const city of localCities) {
    const dist = euclideanDistance(lat, lng, city.lat, city.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  return nearest;
}

// ── Remote: find nearest city via API ───────────

export async function findNearestCityRemote(lat: number, lng: number): Promise<City> {
  try {
    const res = await fetch(`${MUNICIPALITY_API}/near?lat=${lat}&lng=${lng}&radius=20`);
    if (!res.ok) throw new Error("API error");
    const data: Governorate[] = await res.json();

    // Flatten all delegations and find the closest one
    let nearest: City | null = null;
    let minDist = Infinity;
    for (const gov of data) {
      for (const del of gov.Delegations) {
        if (!del.Latitude || !del.Longitude) continue;
        const dist = euclideanDistance(lat, lng, del.Latitude, del.Longitude);
        if (dist < minDist) {
          minDist = dist;
          nearest = delegationToCity(gov, del);
        }
      }
    }
    if (nearest) return nearest;
  } catch {
    // Fall through to local fallback
  }
  return findNearestCity(lat, lng);
}

// ── Remote: fetch all cities for search ─────────

let cachedCities: City[] | null = null;

export async function fetchAllCities(): Promise<City[]> {
  if (cachedCities) return cachedCities;

  try {
    const res = await fetch(MUNICIPALITY_API);
    if (!res.ok) throw new Error("API error");
    const data: Governorate[] = await res.json();

    // Deduplicate by delegation Value (keep first occurrence per delegation per governorate)
    const seen = new Set<string>();
    const cities: City[] = [];
    for (const gov of data) {
      for (const del of gov.Delegations) {
        if (!del.Latitude || !del.Longitude) continue;
        const key = `${gov.Value}_${del.Value}`;
        if (seen.has(key)) continue;
        seen.add(key);
        cities.push(delegationToCity(gov, del));
      }
    }

    cachedCities = cities;
    return cities;
  } catch {
    return localCities;
  }
}

// ── Search cities (local sync version) ──────────

export function searchCities(query: string): City[] {
  if (!query.trim()) return localCities;
  const q = query.toLowerCase().trim();
  return localCities.filter(
    (city) =>
      city.nameFr.toLowerCase().includes(q) ||
      city.nameAr.includes(q) ||
      city.id.includes(q)
  );
}

// ── Search cities (async, uses API data) ────────

export async function searchCitiesAsync(query: string): Promise<City[]> {
  const allCities = await fetchAllCities();
  if (!query.trim()) return allCities.slice(0, 50);
  const q = query.toLowerCase().trim();
  return allCities.filter(
    (city) =>
      city.nameFr.toLowerCase().includes(q) ||
      city.nameAr.includes(q) ||
      city.id.includes(q)
  );
}

// ── Get city by ID ──────────────────────────────

export function getCityById(id: string): City | undefined {
  return localCities.find((city) => city.id === id);
}

// ── Get coordinates from city ───────────────────

export function getCityCoords(city: City): Coordinates {
  return { lat: city.lat, lng: city.lng };
}
