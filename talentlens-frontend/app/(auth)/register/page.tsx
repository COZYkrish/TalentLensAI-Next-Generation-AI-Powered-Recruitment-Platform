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

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          role: "RECRUITER", // Defaulting to recruiter for this demo form
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || "Failed to register. Please try again.");
        return;
      }

      // Automatically sign in after registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but failed to sign in automatically.");
      } else {
        router.push("/jobs");
      }
    } catch (e) {
      setError("Network error occurred.");
    }
  };

  return (
    <div className="w-full bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl mb-2">Create an Account</h1>
        <p className="text-muted-foreground text-sm">Start hiring 10x faster with AI</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" className="bg-background/50 border-border" {...register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" placeholder="Acme Inc." className="bg-background/50 border-border" {...register("companyName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" className="bg-background/50 border-border" {...register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" className="bg-background/50 border-border" {...register("password")} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 rounded-xl mt-6 cursor-pointer">
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
