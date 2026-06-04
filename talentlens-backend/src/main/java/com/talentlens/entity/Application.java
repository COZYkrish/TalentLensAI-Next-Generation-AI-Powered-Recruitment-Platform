package com.talentlens.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    private String status; // APPLIED, REVIEWING, INTERVIEW, OFFER, REJECTED

    private Double aiMatchScore; // 0-100 score from AI

    @Column(columnDefinition = "TEXT")
    private String aiInsights; // Text summary of why they match

    @Column(columnDefinition = "TEXT")
    private String rawResumeText; // Extracted plain text of resume

    private String resumeUrl; // URL of the submitted resume

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
