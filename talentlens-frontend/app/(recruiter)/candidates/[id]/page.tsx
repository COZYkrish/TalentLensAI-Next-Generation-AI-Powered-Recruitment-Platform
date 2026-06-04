"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sparkles, FileText, CheckCircle, XCircle } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";

export default function CandidateProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [candidateData, setCandidateData] = useState<any>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For demo purposes, we will mock the candidate data if the backend isn't populated
    // Usually we would fetch from `/api/v1/applications/${id}` (but we didn't add a GET by ID endpoint, 
    // only GET by jobId. So we'll mock it here based on ID).
    
    setTimeout(() => {
      setCandidateData({
        id,
        name: "Alice Johnson",
        title: "Senior React Developer",
        status: "APPLIED",
        jobTitle: "Senior Frontend Engineer",
        appliedDate: "2 days ago",
        score: 94,
        avatarUrl: "https://github.com/shadcn.png",
        aiInsights: {
          match_score: 94,
          missing_skills: ["GraphQL", "Docker"],
          matching_skills: ["React", "TypeScript", "Next.js", "Redux", "Tailwind CSS"],
          reasoning: "Candidate possesses strong foundational skills in React and TypeScript. Shows 4+ years of relevant frontend experience but lacks some backend/DevOps integration experience requested in the job description."
        }
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const loadInterviewQuestions = async () => {
    if (interviewQuestions) return;
    setLoadingQuestions(true);
    try {
      // Mocking the backend call to GET /api/v1/applications/{id}/interview-questions
      await new Promise(resolve => setTimeout(resolve, 1500));
      setInterviewQuestions({
        questions: [
          {
            type: "technical",
            question: "You have extensive experience in React, but the job requires GraphQL. How would you approach integrating a GraphQL API into an existing React application?",
            rationale: "Assesses ability to bridge the gap in missing GraphQL skill."
          },
          {
            type: "behavioral",
            question: "Tell me about a time you had to learn a completely new deployment tool (like Docker) on the job under a tight deadline.",
            rationale: "Evaluates adaptability for missing Docker experience."
          },
          {
            type: "technical",
            question: "Can you explain how you would optimize a Next.js application that is suffering from slow First Contentful Paint (FCP)?",
            rationale: "Deep dives into claimed Next.js expertise."
          }
        ]
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center text-muted-foreground animate-pulse">Loading Candidate Profile...</div>;
  }

  if (error || !candidateData) {
    return <div className="text-red-500">Error: {error || "Candidate not found"}</div>;
  }

  const { aiInsights } = candidateData;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-xl border-border cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif tracking-tighter mb-1">{candidateData.name}</h1>
          <p className="text-muted-foreground">{candidateData.jobTitle} • {candidateData.appliedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-serif border-4 border-background">
                  {candidateData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-medium">{candidateData.name}</h2>
                  <p className="text-sm text-muted-foreground">{candidateData.title}</p>
                </div>
                <div className="w-full pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium flex items-center gap-1 text-[var(--accent-green)]">
                      <Sparkles className="w-4 h-4" /> AI Match Score
                    </span>
                    <span className="font-serif">{aiInsights.match_score}%</span>
                  </div>
                  <Progress value={aiInsights.match_score} className="h-2 bg-background border border-border" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button variant={candidateData.status === "APPLIED" ? "default" : "outline"} className={`rounded-xl justify-start ${candidateData.status === "APPLIED" ? "bg-foreground text-background" : ""}`}>
                  Applied
                </Button>
                <Button variant={candidateData.status === "INTERVIEW" ? "default" : "outline"} className={`rounded-xl justify-start ${candidateData.status === "INTERVIEW" ? "bg-foreground text-background" : ""}`}>
                  Interviewing
                </Button>
                <Button variant={candidateData.status === "OFFER" ? "default" : "outline"} className={`rounded-xl justify-start ${candidateData.status === "OFFER" ? "bg-[var(--accent-green)] text-black" : ""}`}>
                  Offer Extended
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs.Root defaultValue="overview" className="flex flex-col w-full" onValueChange={(val) => {
            if (val === "interview") loadInterviewQuestions();
          }}>
            <Tabs.List className="flex shrink-0 border-b border-border mb-6">
              <Tabs.Trigger value="overview" className="px-5 py-3 flex-1 md:flex-none text-sm font-medium border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer">
                AI Overview
              </Tabs.Trigger>
              <Tabs.Trigger value="interview" className="px-5 py-3 flex-1 md:flex-none text-sm font-medium border-b-2 border-transparent data-[state=active]:border-[var(--accent-blue)] data-[state=active]:text-[var(--accent-blue)] text-muted-foreground hover:text-foreground transition-colors outline-none cursor-pointer flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" /> Interview Prep
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overview" className="space-y-6 outline-none">
              <Card className="bg-card/50 backdrop-blur-xl border-border">
                <CardHeader>
                  <CardTitle>AI Reasoning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{aiInsights.reasoning}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur-xl border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" /> Matching Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.matching_skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-xl border-border">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400" /> Missing Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {aiInsights.missing_skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-red-400/10 text-red-400 border border-red-400/20 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Tabs.Content>

            <Tabs.Content value="interview" className="outline-none space-y-4">
              <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6 mb-4">
                <h3 className="font-serif text-xl mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--accent-blue)]" /> AI-Generated Interview Guide
                </h3>
                <p className="text-sm text-muted-foreground">
                  These questions are dynamically generated based on the candidate's specific skill gaps and the job requirements to help you conduct a highly targeted interview.
                </p>
              </div>

              {loadingQuestions ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-card/30 animate-pulse border border-border"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {interviewQuestions?.questions.map((q: any, idx: number) => (
                    <Card key={idx} className="bg-card/50 backdrop-blur-xl border-border overflow-hidden">
                      <div className="h-1 w-full bg-[var(--accent-blue)]/50"></div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <span className="uppercase text-[10px] tracking-wider font-bold text-muted-foreground px-2 py-1 bg-background rounded">
                            {q.type}
                          </span>
                        </div>
                        <p className="text-foreground font-medium mb-4 text-lg">{q.question}</p>
                        <div className="bg-background/50 rounded-lg p-3 text-sm flex gap-3">
                          <FileText className="w-4 h-4 mt-0.5 text-[var(--accent-blue)] shrink-0" />
                          <p className="text-muted-foreground"><strong className="text-foreground">Why ask this:</strong> {q.rationale}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
