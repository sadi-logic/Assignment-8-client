export type Studio = {
  id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number | null;
  imageUrl: string | null;
  rating: number | null;
  description: string;
  amenities: string[];
  maxCapacity: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function getNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return null;
}

export function normalizeStudio(value: unknown, index: number): Studio {
  if (!isRecord(value)) {
    throw new Error("The studios response contains an invalid listing.");
  }

  const rawAmenities = value.amenities;
  const rating = getNumber(value.rating, value.averageRating);

  return {
    id: getString(value._id, value.id, value.studioId) ?? `studio-${index + 1}`,
    title: getString(value.title, value.name) ?? "Untitled studio",
    category: getString(value.category, value.type) ?? "Creative space",
    location: getString(value.location, value.city, value.address) ?? "Location not listed",
    hourlyRate: getNumber(value.hourlyRate, value.pricePerHour),
    imageUrl: getString(value.imageUrl, value.coverImageUrl, value.image),
    rating: rating !== null && rating <= 5 ? rating : null,
    description: getString(value.overview, value.description) ?? "",
    amenities: Array.isArray(rawAmenities)
      ? rawAmenities.filter((item): item is string => typeof item === "string")
      : [],
    maxCapacity: getNumber(value.maxCapacity, value.capacity),
  };
}

export async function getStudios(): Promise<Studio[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
  }

  const response = await fetch(`${serverUrl.replace(/\/$/, "")}/studios`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load studios (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  const listings = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.studios)
      ? payload.studios
      : isRecord(payload) && Array.isArray(payload.data)
        ? payload.data
        : null;

  if (!listings) {
    throw new Error("The studios response has an unexpected format.");
  }

  return listings.map(normalizeStudio);
}
