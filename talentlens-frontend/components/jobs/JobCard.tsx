import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";

export function JobCard({ job }: { job: any }) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border hover:bg-card/80 transition-colors">
      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium">{job.title}</h3>
            <Badge variant={job.status === 'Published' ? 'default' : 'secondary'} className={job.status === 'Published' ? 'bg-[var(--accent-green)] text-black' : ''}>
              {job.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.department}</div>
            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
            <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {job.type}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-serif">{job.applicants}</div>
            <div className="text-xs text-muted-foreground">Applicants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-serif text-[var(--accent-blue)] flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" /> {job.matches}
            </div>
            <div className="text-xs text-[var(--accent-blue)]/70">AI Matches</div>
          </div>
          <Button asChild variant="outline" className="border-border rounded-xl">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
