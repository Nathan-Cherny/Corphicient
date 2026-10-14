
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch a dad joke" },
        { status: res.status }
      );
    }

    const joke = await res.json();

    return NextResponse.json(joke);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to retrieve a dad joke" },
      { status: 500 }
    );
  }
}
