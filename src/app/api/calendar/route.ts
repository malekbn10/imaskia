import { NextRequest, NextResponse } from "next/server";

const ALADHAN_BASE = "https://api.aladhan.com/v1";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "lat and lng parameters are required" },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    return NextResponse.json(
      { error: "Invalid coordinates" },
      { status: 400 }
    );
  }

  const now = new Date();
  const m = month || String(now.getMonth() + 1);
  const y = year || String(now.getFullYear());

  const params = new URLSearchParams({
    latitude: latNum.toString(),
    longitude: lngNum.toString(),
    method: "16",
    school: "0",
    month: m,
    year: y,
  });

  try {
    const res = await fetch(`${ALADHAN_BASE}/calendar?${params}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`AlAdhan responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch calendar" },
      { status: 502 }
    );
  }
}
