"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const jobSchema = z.object({
  title: z.string().min(2, "Job Title is required"),
  department: z.string().min(2, "Department is required"),
  location: z.string().min(2, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function CreateJobPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormValues) => {
    setError(null);
    try {
      const token = (session as any)?.accessToken;
      
      if (!token) {
        setError("You must be logged in as a recruiter to create a job.");
        return;
      }

      const res = await fetch("http://localhost:8080/api/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create job");
      }

      router.push("/jobs");
    } catch (e: any) {
      setError(e.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-tighter mb-2">Create New Job</h1>
        <p className="text-muted-foreground">Post a new open position to attract top talent.</p>
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-lg">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input id="title" placeholder="e.g. Senior Frontend Engineer" className="bg-background/50" {...register("title")} />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="e.g. Engineering" className="bg-background/50" {...register("department")} />
              {errors.department && <p className="text-red-500 text-xs">{errors.department.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g. Remote, New York" className="bg-background/50" {...register("location")} />
              {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <textarea 
              id="description" 
              placeholder="Describe the responsibilities and impact of this role..." 
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("description")} 
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <textarea 
              id="requirements" 
              placeholder="List the skills, experience, and qualifications needed..." 
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register("requirements")} 
            />
            {errors.requirements && <p className="text-red-500 text-xs">{errors.requirements.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl cursor-pointer">
              {isSubmitting ? "Creating..." : "Publish Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
