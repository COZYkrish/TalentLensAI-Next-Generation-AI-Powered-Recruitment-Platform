"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar, Clock, User, Briefcase, Video, MapPin, ChevronRight,
  CheckCircle2, XCircle, Plus, X, Loader2, Award, ClipboardList
} from "lucide-react";
import { useInterviews, Interview } from "@/hooks/useInterviews";
import api from "@/lib/api";

type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
type InterviewType = "VIDEO" | "ON-SITE" | "PHONE";

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
  onAdd: (interview: {
    applicationId: number;
    dateTime: string;
    duration: string;
    type: string;
    interviewers: string[];
  }) => Promise<any>;
}

function ScheduleModal({ onClose, onAdd }: ScheduleModalProps) {
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
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

  useEffect(() => {
    // Fetch all active applications to populate candidate picker
    api.get("/applications")
      .then((res) => setApplications(res.data))
      .catch((err) => console.error("Error fetching applications:", err));
  }, []);

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedAppId) e.applicationId = "Required";
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
    try {
      // date: "2026-06-03", time: "10:00" -> ISO: "2026-06-03T10:00:00"
      const dateTimeString = `${form.date}T${form.time}:00`;
      await onAdd({
        applicationId: selectedAppId!,
        dateTime: dateTimeString,
        duration: form.duration,
        type: form.type,
        interviewers: form.interviewers.split(",").map((s) => s.trim()).filter(Boolean),
      });
      onClose();
    } catch (err: any) {
      setErrors({ submit: err.response?.data?.message || err.message });
    } finally {
      setSaving(false);
    }
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
          {/* Candidate Selection Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="applicationSelect">Select Candidate Application *</Label>
            <select
              id="applicationSelect"
              value={selectedAppId || ""}
              onChange={(e) => {
                const appId = Number(e.target.value);
                setSelectedAppId(appId);
                const app = applications.find(a => a.id === appId);
                if (app) {
                  set("candidateName", app.candidateName);
                  set("jobTitle", app.jobTitle);
                  set("department", app.department || "Engineering");
                }
              }}
              className="w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-foreground/30"
            >
              <option value="" className="bg-card">-- Select an active Application --</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id} className="bg-card">
                  {app.candidateName} - {app.jobTitle} (Match: {app.aiMatchScore}%)
                </option>
              ))}
            </select>
            {errors.applicationId && <p className="text-xs text-red-400">{errors.applicationId}</p>}
          </div>

          {selectedAppId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4"
            >
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground block">Candidate Name</span>
                <span className="text-sm font-medium">{form.candidateName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground block">Target Role</span>
                <span className="text-sm font-medium">{form.jobTitle} ({form.department})</span>
              </div>
            </motion.div>
          )}

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

          {errors.submit && <p className="text-xs text-red-400 font-medium">{errors.submit}</p>}

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
  const { interviews, loading, scheduleInterview, updateStatus, submitFeedback } = useInterviews();
  const [activeTab, setActiveTab] = useState<InterviewStatus | "ALL">("ALL");
  const [showModal, setShowModal] = useState(false);

  // Recruiter grading state
  const [gradingInterviewId, setGradingInterviewId] = useState<number | null>(null);
  const [feedbackScore, setFeedbackScore] = useState<number>(85);
  const [feedbackNotes, setFeedbackNotes] = useState<string>("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const filtered = activeTab === "ALL" ? interviews : interviews.filter((i) => i.status === activeTab);

  const handleGradingSubmit = async (interviewId: number) => {
    setSubmittingFeedback(true);
    try {
      await submitFeedback(interviewId, feedbackScore, feedbackNotes);
      setGradingInterviewId(null);
      setFeedbackScore(85);
      setFeedbackNotes("");
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const upcoming = interviews.filter((i) => i.status === "SCHEDULED").length;

  return (
    <div className="space-y-8 pb-12">
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ScheduleModal onClose={() => setShowModal(false)} onAdd={scheduleInterview} />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tighter mb-2">Interviews</h1>
          <p className="text-muted-foreground">
            Manage your candidate interviews across all active roles.{" "}
            {loading ? (
              <span className="text-xs text-muted-foreground animate-pulse ml-2">Loading...</span>
            ) : (
              <span className="text-[var(--accent-green)] font-medium">{upcoming} upcoming</span>
            )}
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
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-green)]" /> Loading live interviews...
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              No interviews in this category.
            </motion.div>
          ) : (
            filtered.map((interview) => {
              const TypeIcon = typeIcons[interview.type] || Video;
              const statusStyle = statusStyles[interview.status];
              const initials = getInitials(interview.candidateName);
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
                          {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-base">{interview.candidateName}</h3>
                            <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle?.bg || 'bg-border/30'} ${statusStyle?.text || 'text-muted'}`}>
                              {statusStyle?.label || interview.status}
                            </span>
                            {interview.score && (
                              <span className="text-xs font-medium text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" /> Score: {interview.score}%
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
                              {new Date(interview.dateTime.split("T")[0]).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {interview.dateTime.split("T")[1]?.slice(0, 5) || interview.dateTime} · {interview.duration}
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

                          {/* Recruiter feedback notes display */}
                          {interview.feedbackNotes && (
                            <div className="mt-3 p-3 bg-background/30 border border-border/40 rounded-xl text-xs flex gap-2 text-muted-foreground">
                              <ClipboardList className="w-3.5 h-3.5 mt-0.5 text-[var(--accent-green)] shrink-0" />
                              <p><strong className="text-foreground">Feedback:</strong> {interview.feedbackNotes}</p>
                            </div>
                          )}

                          {/* Inline Feedback Grading Form */}
                          {gradingInterviewId === interview.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 border border-border bg-background/50 rounded-2xl space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submit Interview Feedback</h4>
                                <button onClick={() => setGradingInterviewId(null)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <Label htmlFor="gradeScore">Rating (0-100)</Label>
                                  <Input
                                    id="gradeScore"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={feedbackScore}
                                    onChange={(e) => setFeedbackScore(Number(e.target.value))}
                                    className="h-9 bg-background/50 text-sm"
                                  />
                                </div>
                                <div className="md:col-span-3 space-y-1">
                                  <Label htmlFor="feedbackComments">Feedback Notes</Label>
                                  <Input
                                    id="feedbackComments"
                                    value={feedbackNotes}
                                    onChange={(e) => setFeedbackNotes(e.target.value)}
                                    placeholder="Enter summary notes on technical skills, communication, fit..."
                                    className="h-9 bg-background/50 text-sm"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  className="h-8 text-xs bg-[var(--accent-green)] text-black hover:bg-[var(--accent-green)]/90 cursor-pointer"
                                  disabled={submittingFeedback}
                                  onClick={() => handleGradingSubmit(interview.id)}
                                >
                                  {submittingFeedback ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1" />}
                                  Submit Grading & Complete
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start mt-1">
                          {interview.status === "SCHEDULED" && gradingInterviewId !== interview.id && (
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
                                onClick={() => setGradingInterviewId(interview.id)}
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
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
