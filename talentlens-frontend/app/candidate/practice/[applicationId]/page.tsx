"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Sparkles, FileText, CheckCircle, XCircle, Play, Send, Loader2, Award,
  BookOpen, ChevronRight, HelpCircle, MessageSquare
} from "lucide-react";
import api from "@/lib/api";

export default function CandidatePracticePage() {
  const { applicationId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [application, setApplication] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Practice state
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [appRes, questionsRes] = await Promise.all([
          api.get(`/applications/${applicationId}`),
          api.get(`/applications/${applicationId}/interview-questions`),
        ]);
        setApplication(appRes.data);
        
        // FastAPI /Spring Boot returns questions map containing List of items
        const generated = questionsRes.data.questions || [];
        setQuestions(generated);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId, session]);

  const handleEvaluateSubmit = async () => {
    if (!selectedQuestion || !candidateAnswer.trim()) return;

    setEvaluating(true);
    setEvaluationResult(null);
    try {
      const res = await api.post(`/applications/${applicationId}/evaluate-answer`, {
        question: selectedQuestion,
        answer: candidateAnswer,
      });
      setEvaluationResult(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground bg-black animate-pulse">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-green)] mr-2" /> Loading practice questions...
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-red-500 bg-black p-4 text-center">
        <XCircle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to load Application</h2>
        <p className="text-sm text-muted-foreground mb-6">{error || "Application not found."}</p>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-green-500/30 selection:text-white p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="rounded-xl border-border cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-2 py-0.5 bg-card border border-border rounded">
            Candidate Practice Area
          </span>
          <h1 className="text-3xl font-serif tracking-tighter mt-2">AI Interview Simulator</h1>
          <p className="text-muted-foreground">{application.jobTitle} • Match Score: {application.aiMatchScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Questions Selector */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--accent-green)]" /> Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No practice questions have been generated for this application yet.
                </p>
              ) : (
                questions.map((q: any, idx: number) => {
                  const isSelected = selectedQuestion === q.question;
                  const isTechnical = q.type?.toUpperCase() === "TECHNICAL";
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedQuestion(q.question);
                        setCandidateAnswer("");
                        setEvaluationResult(null);
                      }}
                      className={`w-full flex items-start text-left gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-lg"
                          : "bg-background/40 border-border/60 hover:bg-card hover:border-foreground/20 text-foreground"
                      }`}
                    >
                      <HelpCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isSelected ? "text-background" : isTechnical ? "text-[var(--accent-blue)]" : "text-[var(--accent-green)]"}`} />
                      <div className="flex-1 min-w-0">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isSelected ? "bg-background/20 text-foreground" : "bg-card text-muted-foreground border border-border"
                        }`}>
                          {q.type || "General"}
                        </span>
                        <p className="text-sm font-medium mt-2 leading-relaxed">{q.question}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 self-center opacity-40" />
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Interactive Sandbox */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!selectedQuestion ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-3xl h-[450px] text-muted-foreground bg-card/20"
              >
                <MessageSquare className="w-12 h-12 mb-4 text-muted-foreground/40" />
                <h3 className="text-lg font-medium text-foreground mb-1">Practice Sandbox</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select an AI-generated question from the left sidebar to begin practice coding/speaking answers and evaluate response effectiveness.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="sandbox"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Sandbox card */}
                <Card className="bg-card/50 backdrop-blur-xl border-border">
                  <CardHeader className="border-b border-border/40 pb-4">
                    <span className="text-xs text-muted-foreground font-semibold">Active Question</span>
                    <CardTitle className="font-serif text-lg mt-1">{selectedQuestion}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidateAnswer">Your Practice Answer</Label>
                      <textarea
                        id="candidateAnswer"
                        rows={6}
                        value={candidateAnswer}
                        onChange={(e) => setCandidateAnswer(e.target.value)}
                        placeholder="Type out your technical explanation, architecture design, or behavioral response here..."
                        className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground outline-none focus:border-foreground/30 resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-foreground text-background hover:bg-foreground/90 rounded-xl cursor-pointer"
                        disabled={evaluating || !candidateAnswer.trim()}
                        onClick={handleEvaluateSubmit}
                      >
                        {evaluating ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Evaluating answer...</>
                        ) : (
                          <><Send className="w-4 h-4 mr-2" /> Submit for AI Feedback</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Feedback Panel */}
                <AnimatePresence>
                  {evaluationResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <Card className="bg-card/50 backdrop-blur-xl border-border overflow-hidden">
                        <div className="h-1 w-full bg-[var(--accent-green)]/80"></div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="font-serif text-lg flex items-center gap-2">
                              <Award className="w-5 h-5 text-[var(--accent-green)]" /> AI Practice Report
                            </CardTitle>
                            <span className="text-2xl font-serif text-[var(--accent-green)] font-bold">{evaluationResult.score}%</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Answer Quality Score</span>
                              <span>{evaluationResult.score}/100</span>
                            </div>
                            <Progress value={evaluationResult.score} className="h-2 bg-background border border-border" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <Card className="bg-background/40 border-border/80">
                              <CardHeader className="py-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" /> Strengths
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-4">
                                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                                  {evaluationResult.strengths?.map((str: string, i: number) => (
                                    <li key={i}>{str}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-background/40 border-border/80">
                              <CardHeader className="py-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                  <XCircle className="w-4 h-4 text-red-400" /> Improvement Areas
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-4">
                                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                                  {evaluationResult.improvements?.map((imp: string, i: number) => (
                                    <li key={i}>{imp}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="border-t border-border/40 pt-4">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Grading Explanation</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{evaluationResult.reasoning}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
