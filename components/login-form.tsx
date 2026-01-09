'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import Link from "next/link"
import { api } from "@/lib/axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.status === 200) {
        toast.success("Login successful!");
        if(res.data.role === "admin"){
          router.push("/dashboard")
        }
        else router.push("/");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to login. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
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
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link className="ml-auto text-sm underline-offset-2 hover:underline" href={""}>Forgot your password?</Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
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
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>
 
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link className="underline underline-offset-2" href={"/auth/register"}>Signup</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
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
