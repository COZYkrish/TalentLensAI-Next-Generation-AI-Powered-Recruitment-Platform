package com.talentlens.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    private String duration; // e.g. "30 min", "45 min", "60 min"

    private String type; // VIDEO, ON-SITE, PHONE

    private String status; // SCHEDULED, COMPLETED, CANCELLED

    @ElementCollection
    @CollectionTable(name = "interview_interviewers", joinColumns = @JoinColumn(name = "interview_id"))
    @Column(name = "interviewer")
    private List<String> interviewers;

    private Integer score; // Grading score (0-100)

    @Column(columnDefinition = "TEXT")
    private String feedbackNotes; // Feedback notes from the recruiter

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
