"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, FileText, CheckCircle2, ChevronLeft, Loader2,
  GraduationCap, Briefcase, Code2, User, Mail, Sparkles, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface ParsedResult {
  text: string;
  skills: string[];
  experience: string[];
  education: string[];
}

/** Clean a filename into a proper display name. */
function cleanFileName(filename: string): string {
  return filename
    .replace(/\.(pdf|docx|doc)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b(resume|cv|curriculum|vitae|application)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Truncate a string to `maxLen` chars, appending ellipsis if needed. */
function truncate(str: string, maxLen: number) {
  return str.length > maxLen ? str.slice(0, maxLen).trimEnd() + "…" : str;
}

// ── Collapsible text block ──────────────────────────────────────────
function ExpandableText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const MAX = 160;
  const isLong = text.length > MAX;

  return (
    <div>
      <p className="text-sm leading-relaxed text-foreground/90">
        {expanded || !isLong ? text : truncate(text, MAX)}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 flex items-center gap-1 text-xs text-[var(--accent-green)] hover:underline cursor-pointer"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
        </button>
      )}
    </div>
  );
}

// ── Skill badge ─────────────────────────────────────────────────────
function SkillBadge({ skill }: { skill: string }) {
  const COLORS: Record<string, string> = {
    python: "#3B82F6", javascript: "#F59E0B", java: "#EF4444", react: "#38BDF8",
    "node.js": "#4ADE80", go: "#14B8A6", typescript: "#3B82F6", sql: "#A855F7",
    docker: "#3B82F6", aws: "#F59E0B", "spring boot": "#4ADE80",
  };
  const color = COLORS[skill.toLowerCase()] ?? "var(--muted-foreground)";
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize"
      style={{ borderColor: `${color}40`, backgroundColor: `${color}12`, color }}
    >
      {skill}
    </span>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function NewCandidatePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setParsedData(null);
      setError(null);
    }
  };

  const handleParse = async () => {
    if (!file) return;
    setIsParsing(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8001/api/v1/ai/parse-resume", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("The AI service failed to parse this resume. Please try again.");
      const data = await res.json();
      setParsedData(data);
      // Smart name auto-fill: clean filename but let user override
      setName(cleanFileName(file.name));
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = async () => {
    if (!parsedData || !name.trim()) {
      setError("Candidate name is required before saving.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = (session as any)?.accessToken;
      if (!token) throw new Error("You must be logged in as a recruiter to save a candidate.");

      const res = await fetch("http://localhost:8080/api/v1/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          skills: parsedData.skills,
          experience: parsedData.experience,
          education: parsedData.education,
          rawText: parsedData.text,
        }),
      });

      if (!res.ok) throw new Error("Failed to save candidate to database. Is the backend running?");
      router.push("/candidates");
    } catch (err: any) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <Link href="/candidates" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Pipeline
        </Link>
        <h1 className="text-3xl font-serif tracking-tighter mb-2">Add New Candidate</h1>
        <p className="text-muted-foreground">Upload a PDF resume and let the AI extract the candidate's skills, education, and experience automatically.</p>
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-lg">
        {!parsedData ? (
          /* ── Upload Zone ── */
          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-2xl p-14 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all relative group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Drag & Drop or Click to Upload</h3>
              <p className="text-sm text-muted-foreground mb-2">Supports PDF resumes. The AI will extract skills, education, and work experience automatically.</p>
              <p className="text-xs text-muted-foreground">Max file size: 10MB</p>

              <input
                type="file"
                id="resume-upload"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf"
                onChange={handleFileChange}
              />

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-center gap-2 text-sm bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] px-4 py-2 rounded-full z-10"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-[220px] font-medium">{file.name}</span>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                </motion.div>
              )}
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-3 rounded-xl px-4">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => router.back()} className="rounded-xl">Cancel</Button>
              <Button
                onClick={handleParse}
                disabled={!file || isParsing}
                className="bg-foreground text-background hover:bg-foreground/90 rounded-xl cursor-pointer min-w-[150px]"
              >
                {isParsing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Parsing with AI...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" /> Parse with AI</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* ── Parsed Results ── */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border pb-5">
              <div>
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-1">
                  <CheckCircle2 className="text-[var(--accent-green)] w-6 h-6" /> AI Extracted Profile
                </h2>
                <p className="text-sm text-muted-foreground">
                  Parsed from <span className="font-medium text-foreground">{file?.name}</span>.
                  Please review and correct any details before saving.
                </p>
              </div>
              <Button variant="outline" onClick={() => { setParsedData(null); setFile(null); }} size="sm" className="shrink-0">
                Upload Different File
              </Button>
            </div>

            {/* ── Candidate Details form (top — full width) ── */}
            <div className="bg-background/40 border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-blue)]/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-[var(--accent-blue)]" />
                </div>
                Candidate Details
                <span className="text-xs font-normal text-muted-foreground ml-1">— Review and correct before saving</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/50"
                    placeholder="e.g. Jane Doe"
                  />
                  <p className="text-xs text-muted-foreground">Auto-filled from filename — correct if needed.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50"
                    placeholder="e.g. jane@example.com"
                  />
                  <p className="text-xs text-muted-foreground">Not always extractable from PDFs — add manually.</p>
                </div>
              </div>
            </div>

            {/* ── Skills ── */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent-green)]/15 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-[var(--accent-green)]" />
                </div>
                Skills Detected
                <span className="text-xs font-semibold text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2 py-0.5 rounded-full ml-1">
                  {parsedData.skills.length} found
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Extracted by matching against a curated technology dictionary. Color-coded by category.
              </p>
              {parsedData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, i) => <SkillBadge key={i} skill={skill} />)}
                </div>
              ) : (
                <div className="bg-background/30 border border-border rounded-xl p-4 text-sm text-muted-foreground">
                  No skills were detected. The resume may use non-standard formatting, or skills may be listed as images.
                </div>
              )}
            </div>

            {/* ── Education + Experience in 2-col ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--accent-purple)]/15 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-[var(--accent-purple)]" />
                  </div>
                  Education
                  <span className="text-xs font-semibold text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-2 py-0.5 rounded-full ml-1">
                    {parsedData.education.length} entry{parsedData.education.length !== 1 ? "s" : ""}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Detected from sentences containing degree or institution keywords.
                </p>
                {parsedData.education.length > 0 ? (
                  <div className="space-y-3">
                    {parsedData.education.map((edu, i) => (
                      <div key={i} className="bg-background/40 border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-3.5 h-3.5 text-[var(--accent-purple)] shrink-0" />
                          <span className="text-xs font-semibold text-[var(--accent-purple)] uppercase tracking-wider">Entry {i + 1}</span>
                        </div>
                        <ExpandableText text={edu} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-background/30 border border-border rounded-xl p-4 text-sm text-muted-foreground">
                    No education entries detected. The AI looks for keywords like "university", "degree", "bachelor", etc.
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[var(--accent-blue)]/15 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-[var(--accent-blue)]" />
                  </div>
                  Work Experience
                  <span className="text-xs font-semibold text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded-full ml-1">
                    {parsedData.experience.length} org{parsedData.experience.length !== 1 ? "s" : ""} found
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Organizations extracted via Named Entity Recognition (NER) from the resume text.
                </p>
                {parsedData.experience.length > 0 ? (
                  <div className="space-y-3">
                    {parsedData.experience.map((exp, i) => (
                      <div key={i} className="bg-background/40 border border-border rounded-xl p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Briefcase className="w-4 h-4 text-[var(--accent-blue)]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wider mb-1">Organization</p>
                          <p className="text-sm font-medium text-foreground">{exp}</p>
                          <p className="text-xs text-muted-foreground mt-1">Detected as a named entity in the document</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-background/30 border border-border rounded-xl p-4 text-sm text-muted-foreground">
                    No organizations detected. The AI uses NER to find company names — try a more structured resume format.
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-3 rounded-xl px-4">
                {error}
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-6 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Saving will store this profile in your company's talent pool.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => router.push("/candidates")} className="rounded-xl cursor-pointer">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !name.trim()}
                  className="bg-[var(--accent-green)] text-black hover:bg-[var(--accent-green)]/90 rounded-xl cursor-pointer font-semibold min-w-[170px]"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 mr-2" /> Save Candidate Profile</>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
