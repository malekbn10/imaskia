import { NextRequest, NextResponse } from "next/server";

const ALADHAN_BASE = "https://api.aladhan.com/v1";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const date = searchParams.get("date");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "lat and lng parameters are required" },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  const dateStr = date || formatDate(new Date());

  const params = new URLSearchParams({
    latitude: latNum.toString(),
    longitude: lngNum.toString(),
    method: "16",
    school: "0",
  });

  try {
    const res = await fetch(`${ALADHAN_BASE}/timings/${dateStr}?${params}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`AlAdhan responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 502 }
    );
  }
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
