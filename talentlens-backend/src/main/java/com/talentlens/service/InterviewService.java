package com.talentlens.service;

import com.talentlens.dto.InterviewRequest;
import com.talentlens.dto.InterviewResponse;
import com.talentlens.entity.Application;
import com.talentlens.entity.Interview;
import com.talentlens.repository.ApplicationRepository;
import com.talentlens.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewResponse scheduleInterview(InterviewRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Interview interview = Interview.builder()
                .application(application)
                .dateTime(LocalDateTime.parse(request.getDateTime()))
                .duration(request.getDuration())
                .type(request.getType())
                .status("SCHEDULED")
                .interviewers(request.getInterviewers())
                .build();

        // Update application status to 'INTERVIEW'
        application.setStatus("INTERVIEW");
        applicationRepository.save(application);

        return InterviewResponse.fromEntity(interviewRepository.save(interview));
    }

    public InterviewResponse updateStatus(Long interviewId, String status) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        interview.setStatus(status);

        if ("CANCELLED".equals(status)) {
            Application application = interview.getApplication();
            application.setStatus("REVIEWING");
            applicationRepository.save(application);
        }

        return InterviewResponse.fromEntity(interviewRepository.save(interview));
    }

    public InterviewResponse submitFeedback(Long interviewId, Integer score, String feedbackNotes) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        interview.setScore(score);
        interview.setFeedbackNotes(feedbackNotes);
        interview.setStatus("COMPLETED");

        return InterviewResponse.fromEntity(interviewRepository.save(interview));
    }

    public List<InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll().stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InterviewResponse> getInterviewsForApplication(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId).stream()
                .map(InterviewResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
