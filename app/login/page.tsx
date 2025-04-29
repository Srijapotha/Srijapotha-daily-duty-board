import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegisterForm } from "@/components/register-form"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function LoginPage() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Welcome to TaskMaster Pro</h1>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Account Access</CardTitle>
              <CardDescription>Login or create an account to manage your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
