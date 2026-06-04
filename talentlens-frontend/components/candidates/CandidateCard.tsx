import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, FileText } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export function CandidateCard({ candidate }: { candidate: any }) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 transition-colors">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={candidate.avatarUrl} />
            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{candidate.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{candidate.title}</span>
              <span>•</span>
              <span>Applied {candidate.appliedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="flex-1 md:w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[var(--accent-green)] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Match Score
              </span>
              <span className="text-sm font-serif">{candidate.score}%</span>
            </div>
            {/* The default shadcn progress uses bg-primary for indicator, we can style the container if needed */}
            <Progress value={candidate.score} className="h-2 bg-background border border-border" />
          </div>
          
          <div className="flex gap-2">
            <Button size="icon" variant="outline" className="border-border rounded-xl h-9 w-9 cursor-pointer">
              <FileText className="w-4 h-4" />
            </Button>
            <Button asChild variant="default" className="bg-foreground text-background hover:bg-foreground/90 rounded-xl h-9 px-4 cursor-pointer">
              <Link href={`/candidates/${candidate.id}`}>View AI Insights</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
