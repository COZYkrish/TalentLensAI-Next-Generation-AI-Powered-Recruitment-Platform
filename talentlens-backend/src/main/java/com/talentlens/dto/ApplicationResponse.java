package com.talentlens.dto;

import com.talentlens.entity.Application;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long candidateId;
    private String candidateName;
    private String status;
    private Double aiMatchScore;
    private String aiInsights;
    private String resumeUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ApplicationResponse fromEntity(Application app) {
        ApplicationResponse dto = new ApplicationResponse();
        dto.setId(app.getId());
        
        if (app.getJob() != null) {
            dto.setJobId(app.getJob().getId());
            dto.setJobTitle(app.getJob().getTitle());
        }
        
        if (app.getCandidate() != null) {
            dto.setCandidateId(app.getCandidate().getId());
            dto.setCandidateName(app.getCandidate().getName());
        }
        
        dto.setStatus(app.getStatus());
        dto.setAiMatchScore(app.getAiMatchScore());
        dto.setAiInsights(app.getAiInsights());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setCreatedAt(app.getCreatedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        
        return dto;
    }
}
