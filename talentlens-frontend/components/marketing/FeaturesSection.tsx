"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileSearch, Brain, Target, MessageSquare, BarChart, Trophy } from "lucide-react";

const features = [
  {
    icon: <FileSearch className="w-6 h-6 text-blue-400" />,
    title: "AI Resume Parsing",
    description: "Extract skills, experience, education, projects, and certifications automatically with high-accuracy NLP.",
  },
  {
    icon: <Brain className="w-6 h-6 text-purple-400" />,
    title: "Semantic Matching",
    description: "Compare candidate profiles using transformer embeddings to find true skill overlap beyond keywords.",
  },
  {
    icon: <Target className="w-6 h-6 text-red-400" />,
    title: "Skill Gap Analysis",
    description: "Identify missing required skills instantly before scheduling the first technical interview.",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-green-400" />,
    title: "AI Interview Generator",
    description: "Generate personalized technical and behavioral questions based on the candidate's specific resume claims.",
  },
  {
    icon: <BarChart className="w-6 h-6 text-orange-400" />,
    title: "Recruiter Analytics",
    description: "Track your hiring funnel, candidate quality trends, and skill distribution across all applicants.",
  },
  {
    icon: <Trophy className="w-6 h-6 text-yellow-400" />,
    title: "Candidate Ranking",
    description: "Automatically prioritize top talent with weighted scores for semantics, skills, and experience.",
  }
];

export const FeaturesSection = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-32 bg-[#080808] relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium mb-6"
          >
            Core Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Intelligence at every step of the <span className="font-serif italic text-white/80">hiring funnel</span>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60"
          >
            We replaced boolean searches with semantic embeddings. 
            Discover hidden talent and reduce time-to-hire by 70%.
          </motion.p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative p-8 rounded-2xl bg-[#101010] border border-white/5 hover:bg-[#151515] hover:border-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
