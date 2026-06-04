"use client";

import { motion } from "framer-motion";
import { ParticleField } from "@/components/shared/ParticleField";
import Link from "next/link";
import { ArrowRight, BarChart3, Users, FileText } from "lucide-react";

export const HeroSection = () => {
  const words = "The Future of Recruitment Intelligence".split(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20">
      <ParticleField />
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div className="flex flex-col items-start gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Introducing TalentLens AI 2.0
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-3"
              >
                {word === "Intelligence" ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-serif italic pr-2">
                    {word}
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed"
          >
            AI-powered candidate screening, semantic matching, skill-gap analysis, 
            and intelligent hiring workflows. Stop matching keywords. Start hiring talent.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform"
            >
              Start Recruiting
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Book Demo
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D Preview Panel */}
        <motion.div
          initial={{ opacity: 0, rotateY: 20, rotateX: 10, scale: 0.9 }}
          animate={{ opacity: 1, rotateY: -5, rotateX: 5, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ perspective: "1000px" }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full" />
          
          <div className="relative bg-[#101010] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
            {/* Mock Dashboard Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#080808]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto px-4 py-1 rounded-md bg-white/5 text-xs text-white/40 font-mono">
                talentlens.ai/dashboard
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-6 grid gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Senior React Engineer</h3>
                  <p className="text-xs text-white/50">42 Applicants • 3 Shortlisted</p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20">
                  Active
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="p-4 rounded-xl bg-[#181818] border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/80">Match Score</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    94<span className="text-lg text-white/40">%</span>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="p-4 rounded-xl bg-[#181818] border border-white/5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/80">Skill Gap</span>
                  </div>
                  <div className="text-3xl font-bold text-white">
                    Minimal
                  </div>
                </motion.div>
              </div>

              {/* Mock Applicant Row */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900" />
                  <div>
                    <div className="text-sm font-medium text-white">Sarah Jenkins</div>
                    <div className="text-xs text-white/50">Ex-Stripe • 5 YOE</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 w-[94%]" />
                  </div>
                  <span className="text-xs font-mono text-green-400">94</span>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
