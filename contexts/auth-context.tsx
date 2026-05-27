"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase, getOrCreateSessionId } from "@/lib/supabase"

export interface User {
  id: string
  email: string
  name?: string
  initial?: string
}

interface UserPreferences {
  guidancePreference?: "gita" | "no-preference"
  preferenceSet?: boolean
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  sessionId: string
  preferences: UserPreferences
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string) => Promise<void>
  logout: () => Promise<void>
  updateUserPreference: (preference: "gita" | "no-preference") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState("")
  const [preferences, setPreferences] = useState<UserPreferences>({})

  /* ---------- NAME CLEANER ---------- */

  const extractUserName = (sessionUser: any) => {

    const meta = sessionUser?.user_metadata || {}

    let name =
      meta.full_name ||
      meta.name ||
      meta.given_name ||
      ""

    if (!name) {

      const emailPrefix = sessionUser?.email?.split("@")[0] || "User"

      const clean = emailPrefix.replace(/[0-9]/g, "")

      // Take first 6-8 characters (good enough for first name)
      const shortName = clean.slice(0, 7)

      name = shortName

    }

    return name.charAt(0).toUpperCase() + name.slice(1)

  }

  useEffect(() => {

    const initAuth = async () => {

      try {

        const anonymousSessionId = getOrCreateSessionId()
        setSessionId(anonymousSessionId)

        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {

          const name = extractUserName(session.user)

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name,
            initial: name[0].toUpperCase(),
          })

        }

        const storedPreferences = localStorage.getItem("kaal-preferences")

        if (storedPreferences) {
          setPreferences(JSON.parse(storedPreferences))
        }

      } catch (error) {

        console.error("[Auth] Initialization error:", error)

      } finally {

        setIsLoading(false)

      }

    }

    initAuth()

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (event, session) => {

        if (session?.user) {

          const name = extractUserName(session.user)

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name,
            initial: name[0].toUpperCase(),
          })

        } else {

          setUser(null)

        }

      })

    return () => {
      subscription?.unsubscribe()
    }

  }, [])

  const loginWithGoogle = async () => {

    try {

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      })

      if (error) throw error

    } catch (error) {

      console.error("[Auth] Google login error:", error)
      throw error

    }

  }

  const loginWithEmail = async (email: string) => {

    try {

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
        },
      })

      if (error) throw error

    } catch (error) {

      console.error("[Auth] Email login error:", error)
      throw error

    }

  }

  const logout = async () => {

    try {

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      setUser(null)

    } catch (error) {

      console.error("[Auth] Logout error:", error)
      throw error

    }

  }

  const updateUserPreference = (preference: "gita" | "no-preference") => {

    const updatedPreferences = {
      guidancePreference: preference,
      preferenceSet: true,
    }

    setPreferences(updatedPreferences)

    localStorage.setItem(
      "kaal-preferences",
      JSON.stringify(updatedPreferences)
    )

  }

  return (

    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        sessionId,
        preferences,
        loginWithGoogle,
        loginWithEmail,
        logout,
        updateUserPreference,
      }}
    >

      {children}

    </AuthContext.Provider>

  )

}

export function useAuth() {

  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context

}
