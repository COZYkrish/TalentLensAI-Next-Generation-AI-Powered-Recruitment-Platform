"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar, Clock, User, Briefcase, Video, MapPin, ChevronRight,
  CheckCircle2, XCircle, Plus, X, Loader2,
} from "lucide-react";

type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
type InterviewType = "VIDEO" | "ON-SITE" | "PHONE";

interface Interview {
  id: number;
  candidateName: string;
  jobTitle: string;
  department: string;
  date: string;
  time: string;
  duration: string;
  type: InterviewType;
  status: InterviewStatus;
  interviewers: string[];
  avatarInitial: string;
  score?: number;
}

const MOCK_INTERVIEWS: Interview[] = [
  { id: 1, candidateName: "Alice Johnson", jobTitle: "Senior React Developer", department: "Engineering", date: "2026-06-03", time: "10:00 AM", duration: "60 min", type: "VIDEO", status: "SCHEDULED", interviewers: ["John D.", "Sara K."], avatarInitial: "A" },
  { id: 2, candidateName: "Bob Smith", jobTitle: "Product Manager", department: "Product", date: "2026-06-04", time: "2:00 PM", duration: "45 min", type: "ON-SITE", status: "SCHEDULED", interviewers: ["Mike R."], avatarInitial: "B" },
  { id: 3, candidateName: "Charlie Davis", jobTitle: "UX Designer", department: "Design", date: "2026-06-01", time: "11:30 AM", duration: "30 min", type: "PHONE", status: "COMPLETED", interviewers: ["Emily T."], avatarInitial: "C", score: 88 },
  { id: 4, candidateName: "Diana Prince", jobTitle: "Senior React Developer", department: "Engineering", date: "2026-05-30", time: "3:00 PM", duration: "60 min", type: "VIDEO", status: "COMPLETED", interviewers: ["John D.", "Sara K."], avatarInitial: "D", score: 96 },
  { id: 5, candidateName: "Ethan Hunt", jobTitle: "Backend Engineer", department: "Engineering", date: "2026-06-02", time: "9:00 AM", duration: "45 min", type: "VIDEO", status: "CANCELLED", interviewers: ["John D."], avatarInitial: "E" },
];

const TABS: { id: InterviewStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "SCHEDULED", label: "Scheduled" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
];

const TYPE_OPTIONS: { value: InterviewType; label: string; icon: React.ElementType }[] = [
  { value: "VIDEO", label: "Video Call", icon: Video },
  { value: "ON-SITE", label: "On-Site", icon: MapPin },
  { value: "PHONE", label: "Phone Call", icon: Clock },
];

const DURATION_OPTIONS = ["30 min", "45 min", "60 min", "90 min"];

const typeIcons = { VIDEO: Video, "ON-SITE": MapPin, PHONE: Clock };

const statusStyles: Record<InterviewStatus, { bg: string; text: string; label: string }> = {
  SCHEDULED: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Scheduled" },
  COMPLETED: { bg: "bg-green-500/10", text: "text-[var(--accent-green)]", label: "Completed" },
  CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", label: "Cancelled" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ── Schedule Modal ──────────────────────────────────────────────────
interface ScheduleModalProps {
  onClose: () => void;
  onAdd: (interview: Interview) => void;
}

function ScheduleModal({ onClose, onAdd }: ScheduleModalProps) {
  const [form, setForm] = useState({
    candidateName: "",
    jobTitle: "",
    department: "",
    date: "",
    time: "",
    duration: "60 min",
    type: "VIDEO" as InterviewType,
    interviewers: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.candidateName.trim()) e.candidateName = "Required";
    if (!form.jobTitle.trim()) e.jobTitle = "Required";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    if (!form.interviewers.trim()) e.interviewers = "Required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async

    const newInterview: Interview = {
      id: Date.now(),
      candidateName: form.candidateName.trim(),
      jobTitle: form.jobTitle.trim(),
      department: form.department.trim() || "General",
      date: form.date,
      time: form.time,
      duration: form.duration,
      type: form.type,
      status: "SCHEDULED",
      interviewers: form.interviewers.split(",").map((s) => s.trim()).filter(Boolean),
      avatarInitial: getInitials(form.candidateName),
    };

    setSaving(false);
    onAdd(newInterview);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-border">
          <div>
            <h2 className="text-xl font-serif tracking-tight">Schedule Interview</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to book a new interview slot.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-border transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
          {/* Candidate & Job */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="candidateName">Candidate Name *</Label>
              <Input
                id="candidateName"
                value={form.candidateName}
                onChange={(e) => set("candidateName", e.target.value)}
                placeholder="e.g. Alice Johnson"
                className={`bg-background/50 ${errors.candidateName ? "border-red-500" : ""}`}
              />
              {errors.candidateName && <p className="text-xs text-red-400">{errors.candidateName}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={form.jobTitle}
                onChange={(e) => set("jobTitle", e.target.value)}
                placeholder="e.g. Senior React Developer"
                className={`bg-background/50 ${errors.jobTitle ? "border-red-500" : ""}`}
              />
              {errors.jobTitle && <p className="text-xs text-red-400">{errors.jobTitle}</p>}
            </div>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="e.g. Engineering"
              className="bg-background/50"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={`bg-background/50 ${errors.date ? "border-red-500" : ""}`}
              />
              {errors.date && <p className="text-xs text-red-400">{errors.date}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                className={`bg-background/50 ${errors.time ? "border-red-500" : ""}`}
              />
              {errors.time && <p className="text-xs text-red-400">{errors.time}</p>}
            </div>
          </div>

          {/* Duration & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Duration</Label>
              <div className="flex gap-2 flex-wrap">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set("duration", d)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                      form.duration === d
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Interview Type</Label>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => set("type", value)}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                      form.type === value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interviewers */}
          <div className="space-y-1.5">
            <Label htmlFor="interviewers">Interviewers * <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
            <Input
              id="interviewers"
              value={form.interviewers}
              onChange={(e) => set("interviewers", e.target.value)}
              placeholder="e.g. John D., Sara K."
              className={`bg-background/50 ${errors.interviewers ? "border-red-500" : ""}`}
            />
            {errors.interviewers && <p className="text-xs text-red-400">{errors.interviewers}</p>}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl cursor-pointer">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-foreground text-background hover:bg-foreground/90 rounded-xl cursor-pointer min-w-[140px]"
            >
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scheduling...</> : "Schedule Interview"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<InterviewStatus | "ALL">("ALL");
  const [interviews, setInterviews] = useState<Interview[]>(MOCK_INTERVIEWS);
  const [showModal, setShowModal] = useState(false);

  const filtered = activeTab === "ALL" ? interviews : interviews.filter((i) => i.status === activeTab);

  const updateStatus = (id: number, status: InterviewStatus) => {
    setInterviews((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const addInterview = (interview: Interview) => {
    setInterviews((prev) => [interview, ...prev]);
    setActiveTab("SCHEDULED");
  };

  const upcoming = interviews.filter((i) => i.status === "SCHEDULED").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ScheduleModal onClose={() => setShowModal(false)} onAdd={addInterview} />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tighter mb-2">Interviews</h1>
          <p className="text-muted-foreground">
            Manage your candidate interviews across all active roles.{" "}
            <span className="text-[var(--accent-green)] font-medium">{upcoming} upcoming</span>
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-foreground text-background hover:bg-foreground/90 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Schedule Interview
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Scheduled", value: interviews.filter((i) => i.status === "SCHEDULED").length, color: "#3B82F6" },
          { label: "Completed", value: interviews.filter((i) => i.status === "COMPLETED").length, color: "#4ADE80" },
          { label: "Cancelled", value: interviews.filter((i) => i.status === "CANCELLED").length, color: "#ef4444" },
        ].map((s) => (
          <Card key={s.label} className="bg-card/50 backdrop-blur-xl border-border">
            <CardContent className="pt-5 pb-4">
              <div className="text-3xl font-bold font-serif" style={{ color: s.color }}>{s.value}</div>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-all border-b-2 cursor-pointer ${
              activeTab === tab.id
                ? "border-[var(--accent-green)] text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interview List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              No interviews in this category.
            </motion.div>
          )}
          {filtered.map((interview) => {
            const TypeIcon = typeIcons[interview.type];
            const statusStyle = statusStyles[interview.status];
            return (
              <motion.div
                key={interview.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-card/50 backdrop-blur-xl border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                        {interview.avatarInitial}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-base">{interview.candidateName}</h3>
                          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                            {statusStyle.label}
                          </span>
                          {interview.score && (
                            <span className="text-xs font-medium text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2.5 py-0.5 rounded-full">
                              Score: {interview.score}%
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          <Briefcase className="w-3 h-3 inline mr-1" />
                          {interview.jobTitle} · {interview.department}
                        </p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(interview.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {interview.time} · {interview.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <TypeIcon className="w-3.5 h-3.5" />
                            {interview.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {interview.interviewers.join(", ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {interview.status === "SCHEDULED" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                              onClick={() => updateStatus(interview.id, "CANCELLED")}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                            </Button>
                            <Button
                              size="sm"
                              className="h-8 text-xs rounded-lg bg-[var(--accent-green)] text-black hover:bg-[var(--accent-green)]/90 cursor-pointer"
                              onClick={() => updateStatus(interview.id, "COMPLETED")}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg cursor-pointer">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
