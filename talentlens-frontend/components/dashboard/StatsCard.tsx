import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export function StatsCard({ title, value, change, icon: Icon, trend }: { title: string, value: string, change: string, icon: LucideIcon, trend: "up" | "down" | "neutral" }) {
  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-serif">{value}</div>
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-[var(--accent-green)]' : trend === 'down' ? 'text-[var(--destructive)]' : 'text-muted-foreground'}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
