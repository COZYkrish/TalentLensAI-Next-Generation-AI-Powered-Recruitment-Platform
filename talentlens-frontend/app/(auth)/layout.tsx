import { ParticleField } from "@/components/shared/ParticleField";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4 overflow-hidden">
      <ParticleField />
      <Link href="/" className="absolute top-8 left-8 z-10 flex items-center gap-2 font-serif text-xl tracking-tighter">
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-blue)]" />
        TalentLens AI
      </Link>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
