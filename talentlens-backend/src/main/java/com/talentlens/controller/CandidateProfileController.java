package com.talentlens.controller;

import com.talentlens.dto.CandidateProfileRequest;
import com.talentlens.dto.CandidateProfileResponse;
import com.talentlens.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/candidates")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<CandidateProfileResponse> saveProfile(
            @Valid @RequestBody CandidateProfileRequest request, 
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(candidateProfileService.saveProfile(request, email));
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<CandidateProfileResponse>> getProfiles(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(candidateProfileService.getProfilesForCompany(email));
    }
}
