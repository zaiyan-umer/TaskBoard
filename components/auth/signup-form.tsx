'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useSignup } from "@/hooks/useAuth"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending: loading } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signup({ email, username, password });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome</h1>
                <p className="text-muted-foreground text-balance">
                  Register your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                 autoComplete="off"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => {
                    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      toast.error("Please enter a valid email");
                    }
                  }}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  autoComplete="off"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  id="username"
                  type="text"
                  placeholder="johndoe"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"

                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="cursor-pointer" size={18} /> : <Eye className="cursor-pointer" size={18} />}
                  </button>
                </div>
              </Field>
              <Field>
                <Button className="cursor-pointer gap-2" type="submit" disabled={loading}>
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Registering..." : "Register"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account? <Link className="underline underline-offset-2" href={"/auth/login"}>Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block bg-linear-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-white/20" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-white text-center space-y-4">
                <h2 className="text-4xl font-bold drop-shadow-lg">Task Manager</h2>
                <p className="text-lg opacity-90 drop-shadow">Organize your work, streamline your workflow</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
