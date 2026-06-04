package com.talentlens.dto;

import com.talentlens.entity.Job;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String department;
    private String location;
    private String status;
    private String companyName;
    private LocalDateTime createdAt;

    public static JobResponse fromEntity(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDepartment(job.getDepartment());
        response.setLocation(job.getLocation());
        response.setStatus(job.getStatus());
        if (job.getCompany() != null) {
            response.setCompanyName(job.getCompany().getName());
        }
        response.setCreatedAt(job.getCreatedAt());
        return response;
    }
}
