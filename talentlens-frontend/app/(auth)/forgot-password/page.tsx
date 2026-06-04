import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl mb-2">Reset Password</h1>
        <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link</p>
      </div>

      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" className="bg-background/50 border-border" />
        </div>
        <Button type="button" className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 rounded-xl mt-6">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
