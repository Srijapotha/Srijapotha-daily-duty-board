"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
          },
        ])

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }
      }

      toast({
        title: "Registration successful",
        description: "Welcome to TaskMaster Pro! Your account has been created.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
          className="transition-all"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="transition-all"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
          className="transition-all"
        />
        <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
