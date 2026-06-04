package com.talentlens.dto;

import com.talentlens.entity.Interview;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewResponse {
    private Long id;
    private Long applicationId;
    private String candidateName;
    private String jobTitle;
    private String department;
    private String dateTime;
    private String duration;
    private String type;
    private String status;
    private List<String> interviewers;
    private Integer score;
    private String feedbackNotes;

    public static InterviewResponse fromEntity(Interview interview) {
        return InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(interview.getApplication().getId())
                .candidateName(interview.getApplication().getCandidate().getName())
                .jobTitle(interview.getApplication().getJob().getTitle())
                .department(interview.getApplication().getJob().getDepartment())
                .dateTime(interview.getDateTime().toString())
                .duration(interview.getDuration())
                .type(interview.getType())
                .status(interview.getStatus())
                .interviewers(interview.getInterviewers())
                .score(interview.getScore())
                .feedbackNotes(interview.getFeedbackNotes())
                .build();
    }
}
