"use client";

import { useEffect, useState } from "react";
import { useRecruiterStats } from "@/hooks/useRecruiterStats";
import { HiringFunnelChart } from "@/components/dashboard/HiringFunnelChart";
import { CandidateQualityChart } from "@/components/dashboard/CandidateQualityChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Calendar, TrendingUp, Loader2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FADE_UP = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  loading: boolean;
}) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-border/50 animate-pulse rounded-md" />
        ) : (
          <div className="text-2xl font-bold font-serif">{value}</div>
        )}
        <p className="text-xs mt-1 text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { totalCandidates, activeJobs, totalJobsCount, jobs, candidates, topSkills, loading } =
    useRecruiterStats();

  const recentCandidates = candidates.slice(0, 5);
  const recentJobs = jobs.slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      <motion.div {...FADE_UP} transition={{ duration: 0.3 }}>
        <h1 className="text-3xl font-serif tracking-tighter mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back. Here is what's happening with your hiring process today.
        </p>
      </motion.div>

      {/* ── Stats Cards ── */}
      <motion.div
        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={FADE_UP} transition={{ duration: 0.3 }}>
          <StatCard
            title="Total Candidates"
            value={loading ? "—" : totalCandidates}
            subtitle="Saved in talent pool"
            icon={Users}
            color="#3B82F6"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={FADE_UP} transition={{ duration: 0.3 }}>
          <StatCard
            title="Active Jobs"
            value={loading ? "—" : activeJobs}
            subtitle={`${totalJobsCount} total positions`}
            icon={Briefcase}
            color="#4ADE80"
            loading={loading}
          />
        </motion.div>
        <motion.div variants={FADE_UP} transition={{ duration: 0.3 }}>
          <StatCard
            title="Interviews Scheduled"
            value="2"
            subtitle="This week"
            icon={Calendar}
            color="#A855F7"
            loading={false}
          />
        </motion.div>
        <motion.div variants={FADE_UP} transition={{ duration: 0.3 }}>
          <StatCard
            title="Top Skills Found"
            value={loading ? "—" : topSkills.length}
            subtitle="Across all candidates"
            icon={TrendingUp}
            color="#F59E0B"
            loading={loading}
          />
        </motion.div>
      </motion.div>

      {/* ── Charts ── */}
      <motion.div {...FADE_UP} transition={{ duration: 0.4, delay: 0.1 }} className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <HiringFunnelChart />
        <CandidateQualityChart />
      </motion.div>

      {/* ── Live Activity: Recent Candidates + Recent Jobs ── */}
      <motion.div
        {...FADE_UP}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Candidates */}
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Recent Candidates</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/candidates">View All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-border/30 animate-pulse rounded-xl" />
              ))
            ) : recentCandidates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No candidates yet. <Link href="/candidates/new" className="text-[var(--accent-green)] hover:underline">Add one →</Link>
              </div>
            ) : (
              recentCandidates.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-border/20 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.skills?.slice(0, 3).join(" · ") || "No skills extracted"}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-green)] shrink-0" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-serif">Active Job Listings</CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/jobs">View All <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-border/30 animate-pulse rounded-xl" />
              ))
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No jobs yet. <Link href="/jobs/new" className="text-[var(--accent-green)] hover:underline">Create one →</Link>
              </div>
            ) : (
              recentJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-border/20 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-[var(--accent-blue)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.department} · {job.location}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] shrink-0">
                    {job.status || "Published"}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Top Skills from Talent Pool ── */}
      {!loading && topSkills.length > 0 && (
        <motion.div {...FADE_UP} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-green)]" />
                Top Skills in Your Talent Pool
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {topSkills.map(({ skill, count }) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full text-sm"
                  >
                    <span className="capitalize font-medium">{skill}</span>
                    <span className="text-xs text-[var(--accent-green)] font-semibold bg-[var(--accent-green)]/10 px-1.5 py-0.5 rounded-full">
                      ×{count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
