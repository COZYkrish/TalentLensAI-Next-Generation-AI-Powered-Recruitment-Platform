import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/api";

export interface Interview {
  id: number;
  applicationId: number;
  candidateName: string;
  jobTitle: string;
  department: string;
  dateTime: string;
  duration: string;
  type: "VIDEO" | "ON-SITE" | "PHONE";
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  interviewers: string[];
  score?: number;
  feedbackNotes?: string;
}

export function useInterviews() {
  const { data: session } = useSession();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/interviews");
      setInterviews(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchInterviews();
    }
  }, [session]);

  const scheduleInterview = async (request: {
    applicationId: number;
    dateTime: string;
    duration: string;
    type: string;
    interviewers: string[];
  }) => {
    const res = await api.post("/interviews", request);
    setInterviews((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateStatus = async (id: number, status: string) => {
    const res = await api.put(`/interviews/${id}/status?status=${status}`);
    setInterviews((prev) => prev.map((i) => (i.id === id ? res.data : i)));
    return res.data;
  };

  const submitFeedback = async (id: number, score: number, feedbackNotes: string) => {
    const res = await api.put(`/interviews/${id}/feedback`, { score, feedbackNotes });
    setInterviews((prev) => prev.map((i) => (i.id === id ? res.data : i)));
    return res.data;
  };

  return {
    interviews,
    loading,
    error,
    refresh: fetchInterviews,
    scheduleInterview,
    updateStatus,
    submitFeedback,
  };
}
