import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  status: string;
  description: string;
  requirements: string;
}

export interface CandidateProfile {
  id: number;
  name: string;
  email: string;
  skills: string[];
  experience: string[];
  education: string[];
  createdAt: string;
}

export interface RecruiterStats {
  totalCandidates: number;
  activeJobs: number;
  totalJobsCount: number;
  jobs: Job[];
  candidates: CandidateProfile[];
  /** Top 5 most frequent skills across all candidate profiles */
  topSkills: { skill: string; count: number }[];
  /** Jobs grouped by department for charts */
  jobsByDepartment: { dept: string; count: number }[];
  loading: boolean;
  error: string | null;
}

export function useRecruiterStats(): RecruiterStats {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = (session as any)?.accessToken ?? "";

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Jobs is public — no auth needed
        const [jobsRes, candidatesRes] = await Promise.allSettled([
          fetch("http://localhost:8080/api/v1/jobs"),
          fetch("http://localhost:8080/api/v1/candidates", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (jobsRes.status === "fulfilled" && jobsRes.value.ok) {
          setJobs(await jobsRes.value.json());
        }
        if (candidatesRes.status === "fulfilled" && candidatesRes.value.ok) {
          setCandidates(await candidatesRes.value.json());
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [session]);

  // ── Derived analytics ────────────────────────────────────────
  const activeJobs = jobs.filter(
    (j) => j.status?.toUpperCase() === "PUBLISHED" || !j.status
  ).length;

  // Count skill frequency across all candidates
  const skillFreq: Record<string, number> = {};
  candidates.forEach((c) => {
    (c.skills ?? []).forEach((s) => {
      const key = s.toLowerCase();
      skillFreq[key] = (skillFreq[key] ?? 0) + 1;
    });
  });
  const topSkills = Object.entries(skillFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  // Group jobs by department
  const deptMap: Record<string, number> = {};
  jobs.forEach((j) => {
    const dept = j.department || "Other";
    deptMap[dept] = (deptMap[dept] ?? 0) + 1;
  });
  const jobsByDepartment = Object.entries(deptMap).map(([dept, count]) => ({
    dept,
    count,
  }));

  return {
    totalCandidates: candidates.length,
    activeJobs,
    totalJobsCount: jobs.length,
    jobs,
    candidates,
    topSkills,
    jobsByDepartment,
    loading,
    error,
  };
}
