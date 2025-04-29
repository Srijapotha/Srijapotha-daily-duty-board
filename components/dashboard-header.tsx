"use client"

import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListChecks, LogOut, Menu, Settings, UserIcon } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface DashboardHeaderProps {
  user: User
  profile?: { full_name?: string } | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const { signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email?.[0].toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-30 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0 sm:w-[300px]">
              <DashboardSidebar closeSidebar={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <span className="hidden text-xl font-bold md:inline-block">TaskMaster Pro</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {profile?.full_name || "User"}
                <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile">
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
