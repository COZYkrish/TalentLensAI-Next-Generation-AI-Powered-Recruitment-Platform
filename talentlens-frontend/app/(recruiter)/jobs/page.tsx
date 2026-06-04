"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Briefcase } from "lucide-react";
import Link from "next/link";
import { JobCard } from "@/components/jobs/JobCard";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  status: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/jobs");
        if (!res.ok) throw new Error("Failed to load jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif tracking-tighter mb-2">Jobs</h1>
          <p className="text-muted-foreground">Manage your open positions and track applicants.</p>
        </div>
        <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">
          <Link href="/jobs/new"><Plus className="w-4 h-4 mr-2" /> Create Job</Link>
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading jobs...
        </div>
      )}

      {error && (
        <div className="text-center py-24 text-muted-foreground">
          <p className="text-red-400 mb-2">Could not load jobs from backend.</p>
          <p className="text-xs">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
          <Briefcase className="w-12 h-12 opacity-20" />
          <p>No jobs posted yet. Create your first job to get started.</p>
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">
            <Link href="/jobs/new"><Plus className="w-4 h-4 mr-2" /> Create Job</Link>
          </Button>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                department: job.department,
                location: job.location,
                type: "Full-time",
                status: job.status ?? "Published",
                applicants: 0,
                matches: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
