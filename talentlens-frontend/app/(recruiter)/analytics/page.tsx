"use client";

import { useEffect, useState } from "react";
import { useRecruiterStats } from "@/hooks/useRecruiterStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, Briefcase, Clock, Target, Award, Loader2 } from "lucide-react";

// Static trend data (no historical API exists yet)
const hiringTrend = [
  { month: "Jan", applications: 320, hires: 8 },
  { month: "Feb", applications: 410, hires: 12 },
  { month: "Mar", applications: 550, hires: 15 },
  { month: "Apr", applications: 480, hires: 10 },
  { month: "May", applications: 620, hires: 18 },
  { month: "Jun", applications: 710, hires: 22 },
];

const sourcePieData = [
  { name: "LinkedIn", value: 38, color: "#3B82F6" },
  { name: "Direct Apply", value: 28, color: "#4ADE80" },
  { name: "Referrals", value: 18, color: "#A855F7" },
  { name: "Job Boards", value: 16, color: "#F59E0B" },
];

const timeToHire = [
  { month: "Jan", days: 34 },
  { month: "Feb", days: 28 },
  { month: "Mar", days: 31 },
  { month: "Apr", days: 22 },
  { month: "May", days: 19 },
  { month: "Jun", days: 17 },
];

const tooltipStyle = {
  backgroundColor: "#101010",
  borderColor: "#262626",
  borderRadius: "8px",
  color: "#DEDBC8",
};

const FADE_UP = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const DEPT_COLORS = ["#3B82F6", "#4ADE80", "#A855F7", "#F59E0B", "#EF4444", "#14B8A6"];

export default function AnalyticsPage() {
  const { totalCandidates, activeJobs, totalJobsCount, topSkills, jobsByDepartment, loading } =
    useRecruiterStats();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Build real skill distribution chart from live data
  const skillChartData = topSkills.slice(0, 6).map((s) => ({
    skill: s.skill.length > 10 ? s.skill.slice(0, 10) + "…" : s.skill,
    count: s.count,
  }));

  const metrics = [
    { label: "Total Candidates", value: loading ? "…" : String(totalCandidates), change: "Live", icon: Users, color: "#3B82F6" },
    { label: "Active Jobs", value: loading ? "…" : String(activeJobs), change: `${totalJobsCount} total`, icon: Briefcase, color: "#4ADE80" },
    { label: "Avg. Time to Hire", value: "17 days", change: "-12%", icon: Clock, color: "#A855F7" },
    { label: "Offer Accept Rate", value: "91%", change: "+5%", icon: Target, color: "#F59E0B" },
    { label: "AI Match Accuracy", value: "87%", change: "+3%", icon: Award, color: "#4ADE80" },
    { label: "Unique Skills Found", value: loading ? "…" : String(topSkills.length), change: "Live", icon: TrendingUp, color: "#3B82F6" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <motion.div {...FADE_UP} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-serif tracking-tighter mb-2">Analytics</h1>
        <p className="text-muted-foreground">
          Deep insights into your recruitment performance.{" "}
          {loading && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Loading live data...</span>}
        </p>
      </motion.div>

      {/* ── Metric Cards ── */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.07 } } }}
      >
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <motion.div key={m.label} variants={FADE_UP} transition={{ duration: 0.35 }}>
              <Card className="bg-card/50 backdrop-blur-xl border-border">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${m.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <span className="text-xs font-medium" style={{ color: m.color }}>{m.change}</span>
                  </div>
                  <div className="text-xl font-bold font-serif">{m.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{m.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Hiring Trend (static) ── */}
      {mounted && (
        <motion.div {...FADE_UP} transition={{ duration: 0.45, delay: 0.1 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="font-serif">Hiring Trend — Last 6 Months</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hiringTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gHire" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Area type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} fill="url(#gApp)" name="Applications" />
                    <Area type="monotone" dataKey="hires" stroke="#4ADE80" strokeWidth={2} fill="url(#gHire)" name="Hires" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Row: Source Pie + Time-to-Hire ── */}
      {mounted && (
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" {...FADE_UP} transition={{ duration: 0.45, delay: 0.15 }}>
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="font-serif">Application Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourcePieData} cx="45%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" nameKey="name">
                      {sourcePieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(val: any) => [`${val}%`, "Share"]} />
                    <Legend iconType="circle" formatter={(val) => <span className="text-xs text-muted-foreground">{val}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="font-serif">Avg. Time to Hire (days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeToHire} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} days`]} />
                    <Line type="monotone" dataKey="days" stroke="#A855F7" strokeWidth={2.5} dot={{ r: 4, fill: "#A855F7" }} name="Days" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Row: Live — Jobs by Dept + Live Skills Distribution ── */}
      {mounted && (
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" {...FADE_UP} transition={{ duration: 0.45, delay: 0.2 }}>
          {/* LIVE: Jobs by Department */}
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif">Jobs by Department</CardTitle>
                <span className="text-xs text-[var(--accent-green)] font-medium px-2 py-0.5 bg-[var(--accent-green)]/10 rounded-full">● Live</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                  </div>
                ) : jobsByDepartment.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No jobs data yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobsByDepartment} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                      <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <YAxis dataKey="dept" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={80} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Jobs" radius={[0, 4, 4, 0]}>
                        {jobsByDepartment.map((_, i) => (
                          <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* LIVE: Top Skills in Talent Pool */}
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif">Top Skills in Talent Pool</CardTitle>
                <span className="text-xs text-[var(--accent-green)] font-medium px-2 py-0.5 bg-[var(--accent-green)]/10 rounded-full">● Live</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading...
                  </div>
                ) : skillChartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No candidates with skills yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="skill" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                        {skillChartData.map((_, i) => (
                          <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
