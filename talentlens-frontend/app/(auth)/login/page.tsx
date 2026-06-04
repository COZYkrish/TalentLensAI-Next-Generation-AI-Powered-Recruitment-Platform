"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="w-full bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" className="bg-background/50 border-border" {...register("email")} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-[var(--accent-blue)] hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" className="bg-background/50 border-border" {...register("password")} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 rounded-xl mt-6 cursor-pointer">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/register" className="text-foreground font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
