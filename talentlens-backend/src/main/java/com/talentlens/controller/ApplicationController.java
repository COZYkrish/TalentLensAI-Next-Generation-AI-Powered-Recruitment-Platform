package com.talentlens.controller;

import com.talentlens.dto.ApplicationResponse;
import com.talentlens.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/job/{jobId}/apply")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @PathVariable Long jobId,
            @RequestParam("candidateId") Long candidateId,
            @RequestParam("resume") MultipartFile resume) {
        
        return ResponseEntity.ok(applicationService.applyForJob(jobId, candidateId, resume));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }

    @GetMapping("/{id}/interview-questions")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Map<String, Object>> getInterviewQuestions(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getInterviewQuestions(id));
    }
}

