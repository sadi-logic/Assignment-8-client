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
  images: string[];
  address: string | null;
  size: string | null;
  openingHours: string | null;
  minimumBookingHours: number | null;
  reviewCount: number;
  ratingBreakdown: Record<string, number>;
  host: {
    name: string | null;
    imageUrl: string | null;
    bio: string | null;
    verified: boolean;
    rating: number | null;
    studioCount: number | null;
    email: string | null;
  };
  reviews: {
    id: string;
    name: string;
    imageUrl: string | null;
    rating: number;
    date: string | null;
    comment: string;
  }[];
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
  const rawHost = isRecord(value.host) ? value.host : {};
 const hostEmail = getString(
  rawHost.email,
  value.hostEmail,
  value.CreatorEmail,        
  value.creatorEmail,        
  (isRecord(value.creator) ? value.creator.email : undefined)
);
  const minimumBookingHours = getNumber(value.minimumBookingHours, value.minimumDuration);
  const rawReviews = Array.isArray(value.reviews) ? value.reviews : [];
  const reviews = rawReviews.flatMap((review, reviewIndex) => {
    if (!isRecord(review)) return [];
    const reviewRating = getNumber(review.rating, review.stars);
    const comment = getString(review.comment, review.text, review.description);
    if (reviewRating === null || reviewRating > 5 || !comment) return [];
    return [{
      id: getString(review.id, review._id) ?? `review-${reviewIndex + 1}`,
      name: getString(review.name, review.reviewerName) ?? "Guest",
      imageUrl: getString(review.imageUrl, review.avatar),
      rating: reviewRating,
      date: getString(review.date, review.createdAt),
      comment,
    }];
  });
  const rawImages = Array.isArray(value.images)
    ? value.images
    : Array.isArray(value.photos)
      ? value.photos
      : [];
  const images = rawImages.flatMap((image) => {
    const url = typeof image === "string"
      ? getString(image)
      : isRecord(image)
        ? getString(image.url, image.imageUrl, image.src)
        : null;
    return url ? [url] : [];
  });
  const rawBreakdown = isRecord(value.ratingBreakdown)
    ? value.ratingBreakdown
    : isRecord(value.reviewBreakdown)
      ? value.reviewBreakdown
      : {};
  const ratingBreakdown = Object.fromEntries(
    Object.entries(rawBreakdown).flatMap(([stars, count]) => {
      const parsedCount = getNumber(count);
      return /^[1-5]$/.test(stars) && parsedCount !== null
        ? [[stars, parsedCount]]
        : [];
    })
  );
  const count = getNumber(value.reviewCount, value.totalReviews);

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
    images,
    address: getString(value.address, value.fullAddress),
    size: getString(value.size, value.sizeSqFt, value.area),
    openingHours: getString(value.openingHours, value.operatingHours, value.hours),
    minimumBookingHours: minimumBookingHours !== null && minimumBookingHours > 0
      ? minimumBookingHours
      : null,
    reviewCount: count ?? reviews.length,
    ratingBreakdown,
    host: {
      name: getString(rawHost.name, rawHost.hostName, value.hostName, value.ownerName),
      imageUrl: getString(rawHost.imageUrl, rawHost.avatar, value.hostImageUrl),
      bio: getString(rawHost.bio, rawHost.introduction, value.hostBio),
      verified: rawHost.verified === true || value.hostVerified === true,
      rating: getNumber(rawHost.rating, value.hostRating),
      studioCount: getNumber(rawHost.studioCount, rawHost.hostedStudios),
      email: hostEmail ?? null,
    },
    reviews,
  };
}

export async function getStudioById(id: string): Promise<Studio | null> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
  }

  const response = await fetch(
    `${serverUrl.replace(/\/$/, "")}/studios/${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Unable to load studio (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();
  const studioData =
    isRecord(payload) && isRecord(payload.studio)
      ? payload.studio
      : isRecord(payload) && isRecord(payload.data)
        ? payload.data
        : payload;

  return normalizeStudio(studioData, 0);
}

export async function getStudios(limit?: number): Promise<Studio[]> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is not configured.");
  }

  const query = limit === undefined ? "" : `?limit=${encodeURIComponent(String(limit))}`;
  const response = await fetch(`${serverUrl.replace(/\/$/, "")}/studios${query}`, {
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
