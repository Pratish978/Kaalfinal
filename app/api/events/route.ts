import { NextRequest, NextResponse } from "next/server"

const FASTAPI_BASE_URL =
  process.env.FASTAPI_BASE_URL || "http://localhost:8000"

const API_KEY = process.env.API_KEY || "andai"


/* ---------------- GET EVENTS ---------------- */

export async function GET(request: NextRequest) {
  try {

    const name = request.headers.get("x-user-name") || ""
    const email = request.headers.get("x-user-email") || ""

    const params = new URLSearchParams()

    if (name) params.append("name", name)
    if (email) params.append("email", email)

    const url = `${FASTAPI_BASE_URL}/events${
      params.toString() ? `?${params.toString()}` : ""
    }`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY
      },
      cache: "no-store",
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail || "Failed to fetch events" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {

    console.error("[EVENTS API ERROR]", error)

    return NextResponse.json(
      { error: "Unable to fetch events" },
      { status: 500 }
    )

  }
}


/* ---------------- CREATE EVENT ---------------- */

export async function POST(request: NextRequest) {
  try {

    const body = await request.json()

    const name = request.headers.get("x-user-name") || ""
    const email = request.headers.get("x-user-email") || ""

    const params = new URLSearchParams()

    if (name) params.append("name", name)
    if (email) params.append("email", email)

    const url = `${FASTAPI_BASE_URL}/events${
      params.toString() ? `?${params.toString()}` : ""
    }`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail || "Failed to create event" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)

  } catch (error) {

    console.error("[EVENT CREATE ERROR]", error)

    return NextResponse.json(
      { error: "Unable to create event" },
      { status: 500 }
    )

  }
}