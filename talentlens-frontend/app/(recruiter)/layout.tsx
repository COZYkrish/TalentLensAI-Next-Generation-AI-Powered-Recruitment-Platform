import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Sidebar />
      <Header />
      <main className="ml-64 p-8 flex-1">
        {children}
      </main>
    </div>
  );
}
