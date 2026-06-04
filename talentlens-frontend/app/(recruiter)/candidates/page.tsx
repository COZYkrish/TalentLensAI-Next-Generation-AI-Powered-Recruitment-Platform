"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Candidate {
  id: number;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
  createdAt: string;
  status?: string;
}

const COLUMNS = [
  { id: "APPLIED", title: "Applied" },
  { id: "INTERVIEW", title: "Interviewing" },
  { id: "OFFER", title: "Offer Extended" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CandidatesPipelinePage() {
  const { data: session } = useSession();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/candidates", {
          headers: {
            Authorization: `Bearer ${(session as any)?.accessToken ?? ""}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load candidates");
        const data: Candidate[] = await res.json();
        // Default new candidates to APPLIED status
        setCandidates(data.map((c) => ({ ...c, status: c.status ?? "APPLIED" })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [session]);

  const moveCandidate = (id: number, newStatus: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tighter mb-2">Candidate Pipeline</h1>
          <p className="text-muted-foreground">Manage candidate stages via Kanban board.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/candidates/new">
            <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-xl cursor-pointer">
              <Plus className="w-4 h-4 mr-2" /> Add Candidate
            </Button>
          </Link>
          <Button variant="outline" className="border-border rounded-xl cursor-pointer">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading candidates...
        </div>
      )}

      {error && (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-red-400 mb-2">Could not load candidates from backend.</p>
          <p className="text-xs">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[600px]">
          {COLUMNS.map((col) => {
            const colCandidates = candidates.filter((c) => c.status === col.id);
            return (
              <div key={col.id} className="bg-card/30 border border-border rounded-3xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="font-semibold text-lg">{col.title}</h2>
                  <span className="bg-foreground text-background text-xs px-2 py-1 rounded-full">
                    {colCandidates.length}
                  </span>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4">
                  {colCandidates.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                      <Users className="w-8 h-8 opacity-20" />
                      <span>No candidates here</span>
                    </div>
                  )}
                  <AnimatePresence>
                    {colCandidates.map((c) => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-background border border-border rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium border border-primary/30 text-sm">
                            {getInitials(c.name)}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm leading-tight">{c.name}</h3>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{c.email}</p>
                          </div>
                        </div>

                        {c.skills && c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {c.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
                                {skill}
                              </span>
                            ))}
                            {c.skills.length > 3 && (
                              <span className="text-[10px] text-muted-foreground">+{c.skills.length - 3}</span>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 justify-end">
                          {col.id === "APPLIED" && (
                            <Button size="sm" onClick={() => moveCandidate(c.id, "INTERVIEW")} className="h-7 text-xs rounded-lg cursor-pointer">
                              Move to Interview
                            </Button>
                          )}
                          {col.id === "INTERVIEW" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => moveCandidate(c.id, "APPLIED")} className="h-7 text-xs rounded-lg cursor-pointer">
                                Back
                              </Button>
                              <Button size="sm" onClick={() => moveCandidate(c.id, "OFFER")} className="h-7 text-xs rounded-lg cursor-pointer bg-[var(--accent-green)] text-black hover:bg-[var(--accent-green)]/90">
                                Offer
                              </Button>
                            </>
                          )}
                          {col.id === "OFFER" && (
                            <Button size="sm" variant="outline" onClick={() => moveCandidate(c.id, "INTERVIEW")} className="h-7 text-xs rounded-lg cursor-pointer">
                              Back
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
