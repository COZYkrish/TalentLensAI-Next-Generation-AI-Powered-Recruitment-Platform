package com.talentlens.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewRequest {
    private Long applicationId;
    private String dateTime; // e.g. "2026-06-03T10:00:00"
    private String duration;
    private String type;
    private List<String> interviewers;
}
