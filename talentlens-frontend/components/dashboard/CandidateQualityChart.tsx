"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Users } from "lucide-react";

const data = [
  { range: "< 50%", count: 120, color: "var(--border)" },
  { range: "50-69%", count: 340, color: "var(--muted-foreground)" },
  { range: "70-79%", count: 420, color: "var(--accent-blue)" },
  { range: "80-89%", count: 280, color: "var(--accent-green)" },
  { range: "90-100%", count: 88, color: "var(--foreground)" },
];

export function CandidateQualityChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-lg">Candidate Quality</CardTitle>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">AI Match Score Distribution</p>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="range" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'var(--border)', opacity: 0.2 }}
              contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} 
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
