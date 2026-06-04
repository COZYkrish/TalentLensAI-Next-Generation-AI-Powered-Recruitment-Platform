package com.talentlens.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String department;

    private String location;

    @NotBlank
    private String description;

    @NotBlank
    private String requirements;
}
