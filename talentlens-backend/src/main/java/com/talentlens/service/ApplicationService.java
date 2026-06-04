package com.talentlens.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentlens.ai.AIClientService;
import com.talentlens.dto.ApplicationResponse;
import com.talentlens.entity.Application;
import com.talentlens.entity.Job;
import com.talentlens.entity.User;
import com.talentlens.repository.ApplicationRepository;
import com.talentlens.repository.JobRepository;
import com.talentlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final AIClientService aiClientService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ApplicationResponse applyForJob(Long jobId, Long candidateId, MultipartFile resume) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // 1. Parse resume
        Map<String, Object> parseResponse = aiClientService.parseResume(resume);
        String resumeText = (String) parseResponse.getOrDefault("text", "");

        // 2. Get Match Score & Insights
        Map<String, Object> scoreResponse = aiClientService.getMatchScore(resumeText, job.getDescription());
        
        Double matchScore = 0.0;
        if (scoreResponse.containsKey("match_score")) {
            Object scoreObj = scoreResponse.get("match_score");
            if (scoreObj instanceof Number) {
                matchScore = ((Number) scoreObj).doubleValue();
            }
        }

        String aiInsights = "{}";
        try {
            aiInsights = objectMapper.writeValueAsString(scoreResponse);
        } catch (Exception e) {
            System.err.println("Failed to serialize AI insights: " + e.getMessage());
        }

        // 3. Save Application
        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status("APPLIED")
                .aiMatchScore(matchScore)
                .aiInsights(aiInsights)
                .rawResumeText(resumeText)
                .resumeUrl("/uploads/" + resume.getOriginalFilename()) // Mock URL
                .build();

        Application savedApp = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(savedApp);
    }

    public ApplicationResponse updateStatus(Long applicationId, String newStatus) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(newStatus);
        return ApplicationResponse.fromEntity(applicationRepository.save(app));
    }

    public List<ApplicationResponse> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return ApplicationResponse.fromEntity(app);
    }

    public Map<String, Object> getInterviewQuestions(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        String resumeText = app.getRawResumeText() != null ? app.getRawResumeText() : "";
        return aiClientService.getInterviewQuestions(resumeText, app.getJob().getDescription());
    }

    public Map<String, Object> evaluateAnswer(Long applicationId, String question, String answer) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        return aiClientService.evaluateAnswer(question, answer, app.getJob().getDescription());
    }
}

