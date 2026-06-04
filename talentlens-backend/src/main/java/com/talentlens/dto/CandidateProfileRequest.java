package com.talentlens.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String email;
    private List<String> skills;
    private List<String> experience;
    private List<String> education;
    private String rawText;
}
