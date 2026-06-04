"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-black/40 border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-black" />
        </div>
        <span className="font-serif text-xl font-medium tracking-tight text-white">
          TalentLens <span className="text-white/60">AI</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
        <Link href="#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#pricing" className="hover:text-white transition-colors">
          Pricing
        </Link>
        <Link href="#about" className="hover:text-white transition-colors">
          About
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-white/80 hover:text-white transition-colors hidden sm:block"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="group relative px-4 py-2 bg-white text-black text-sm font-medium rounded-full overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Recruiting
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
    </motion.header>
  );
};
