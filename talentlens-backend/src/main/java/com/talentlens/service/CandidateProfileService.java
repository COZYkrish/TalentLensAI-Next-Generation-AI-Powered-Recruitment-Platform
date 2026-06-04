package com.talentlens.service;

import com.talentlens.dto.CandidateProfileRequest;
import com.talentlens.dto.CandidateProfileResponse;
import com.talentlens.entity.CandidateProfile;
import com.talentlens.entity.Company;
import com.talentlens.entity.User;
import com.talentlens.repository.CandidateProfileRepository;
import com.talentlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;

    public CandidateProfileResponse saveProfile(CandidateProfileRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        CandidateProfile profile = CandidateProfile.builder()
                .name(request.getName())
                .email(request.getEmail())
                .skills(request.getSkills())
                .experience(request.getExperience())
                .education(request.getEducation())
                .rawText(request.getRawText())
                .company(recruiter.getCompany())
                .build();

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return mapToResponse(saved);
    }

    public List<CandidateProfileResponse> getProfilesForCompany(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        
        Company company = recruiter.getCompany();
        if (company == null) {
            throw new RuntimeException("Recruiter has no company associated");
        }

        return candidateProfileRepository.findByCompanyId(company.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CandidateProfileResponse mapToResponse(CandidateProfile profile) {
        return CandidateProfileResponse.builder()
                .id(profile.getId())
                .name(profile.getName())
                .email(profile.getEmail())
                .skills(profile.getSkills())
                .experience(profile.getExperience())
                .education(profile.getEducation())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
