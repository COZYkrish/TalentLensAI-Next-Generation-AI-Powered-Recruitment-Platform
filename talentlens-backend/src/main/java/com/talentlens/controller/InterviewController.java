package com.talentlens.controller;

import com.talentlens.dto.InterviewRequest;
import com.talentlens.dto.InterviewResponse;
import com.talentlens.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<InterviewResponse> scheduleInterview(@RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.scheduleInterview(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<InterviewResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam("status") String status) {
        return ResponseEntity.ok(interviewService.updateStatus(id, status));
    }

    @PutMapping("/{id}/feedback")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<InterviewResponse> submitFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Integer score = (Integer) body.get("score");
        String feedbackNotes = (String) body.get("feedbackNotes");
        return ResponseEntity.ok(interviewService.submitFeedback(id, score, feedbackNotes));
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'CANDIDATE')")
    public ResponseEntity<List<InterviewResponse>> getInterviewsForApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.getInterviewsForApplication(applicationId));
    }
}
