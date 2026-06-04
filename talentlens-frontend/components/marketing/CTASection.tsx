"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-[#101010] border border-white/10 rounded-3xl p-12 md:p-20 overflow-hidden relative">
          
          {/* Inner ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight relative z-10"
          >
            Ready to build your <br className="hidden md:block"/>
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              dream team?
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 mb-10 max-w-2xl mx-auto relative z-10"
          >
            Join 500+ forward-thinking recruiters who have upgraded from keyword matching to true semantic understanding.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 rounded-full font-medium hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
