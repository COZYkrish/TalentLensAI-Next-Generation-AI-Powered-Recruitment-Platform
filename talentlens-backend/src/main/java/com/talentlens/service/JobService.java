package com.talentlens.service;

import com.talentlens.dto.JobRequest;
import com.talentlens.dto.JobResponse;
import com.talentlens.entity.Company;
import com.talentlens.entity.Job;
import com.talentlens.entity.User;
import com.talentlens.repository.JobRepository;
import com.talentlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public JobResponse createJob(JobRequest request, String userEmail) {
        User recruiter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        
        Company company = recruiter.getCompany();
        if (company == null) {
            throw new RuntimeException("Recruiter must be associated with a company to post jobs");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .department(request.getDepartment())
                .location(request.getLocation())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .status("PUBLISHED")
                .company(company)
                .build();

        Job savedJob = jobRepository.save(job);
        return JobResponse.fromEntity(savedJob);
    }
}
