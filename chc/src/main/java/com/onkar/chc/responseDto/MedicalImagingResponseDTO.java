package com.onkar.chc.responseDto;

import com.onkar.chc.entity.MedicalImagingEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalImagingResponseDTO {
    private Long id;
    private String healthCardNo;
    private String imagingType;
    private String title;
    private String description;
    private String hospitalName;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private String uploadedAt;

    public static MedicalImagingResponseDTO fromEntity(MedicalImagingEntity entity) {
        return MedicalImagingResponseDTO.builder()
                .id(entity.getId())
                .healthCardNo(entity.getHealthCardNo())
                .imagingType(entity.getImagingType())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .hospitalName(entity.getHospitalName())
                .fileName(entity.getFileName())
                .fileUrl(entity.getFileUrl())
                .fileType(entity.getFileType())
                .fileSize(entity.getFileSize())
                .uploadedAt(entity.getUploadedAt() != null ? entity.getUploadedAt().toString() : null)
                .build();
    }
}
