"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface Event {
  id: string
  title: string
  description?: string
  date: string
  time: string
  location?: string
  type?: string
  price?: number
  zoom_link?: string
}

interface UseEventsReturn {
  events: Event[]
  loading: boolean
  error: string | null
}

export function useEvents(): UseEventsReturn {

  const { user } = useAuth()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {

    const fetchEvents = async () => {

      try {

        const response = await fetch("/api/events", {
          headers: {
            "x-user-name": user?.name || "",
            "x-user-email": user?.email || ""
          }
        })

        const data = await response.json()

        console.log("EVENTS API RESPONSE:", data)

        /* backend array return karta hai */
        if (Array.isArray(data)) {
          setEvents(data)
        } else if (data.events) {
          setEvents(data.events)
        } else {
          setEvents([])
        }

      } catch (err) {

        console.error("Events fetch error:", err)

        setError("Failed to load events")

      } finally {

        setLoading(false)

      }

    }

    fetchEvents()

  }, [user])

  return { events, loading, error }

}