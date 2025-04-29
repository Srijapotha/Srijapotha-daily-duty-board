import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { CheckCircle2, Clock, ListChecks, Star } from "lucide-react"

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskMaster Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-muted/40 py-20 text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Manage Tasks <span className="text-primary">Efficiently</span>
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">
            TaskMaster Pro helps you organize your work, prioritize tasks, and track your progress all in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/login?tab=register">
              <Button size="lg" className="h-12 px-8">
                Get Started
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Task Management</h3>
              <p className="text-muted-foreground">
                Create, organize, and track your tasks with ease. Mark tasks as complete when you're done.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Priority Levels</h3>
              <p className="text-muted-foreground">
                Assign priority levels to your tasks to focus on what matters most.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Analytics</h3>
              <p className="text-muted-foreground">
                Track your productivity with detailed analytics and visualizations of your task completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">What Our Users Say</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <p className="mb-4 italic text-muted-foreground">
                "TaskMaster Pro has completely transformed how I manage my daily tasks. The interface is intuitive and
                the priority system helps me stay focused."
              </p>
              <p className="font-semibold">- Sarah Johnson</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <p className="mb-4 italic text-muted-foreground">
                "I've tried many task management apps, but this one stands out with its clean design and powerful
                features. The analytics help me understand my productivity patterns."
              </p>
              <p className="font-semibold">- Michael Chen</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <p className="mb-4 italic text-muted-foreground">
                "As a team leader, I appreciate how TaskMaster Pro helps me organize and prioritize our projects. It's
                become an essential tool for our workflow."
              </p>
              <p className="font-semibold">- Alex Rodriguez</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="rounded-lg bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="mb-4 text-3xl font-bold">Ready to Boost Your Productivity?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg">
              Join thousands of users who have transformed their task management experience with TaskMaster Pro.
            </p>
            <Link href="/login?tab=register">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">TaskMaster Pro</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskMaster Pro. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
