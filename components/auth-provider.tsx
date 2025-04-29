"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { Loader2 } from "lucide-react"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
