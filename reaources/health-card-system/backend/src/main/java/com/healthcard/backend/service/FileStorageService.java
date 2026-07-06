package com.healthcard.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".pdf", ".jpg", ".jpeg", ".png");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf", "image/jpeg", "image/png"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    @Value("${app.file-storage.upload-dir}")
    private String uploadDir;

    public String store(MultipartFile file, Long subFolderId) {
        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10MB");
        }

        // Validate content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed");
        }

        // Sanitize and validate filename
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());

        // Prevent path traversal
        if (original.contains("..") || original.contains("/") || original.contains("\\")) {
            throw new IllegalArgumentException("Invalid filename");
        }

        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')).toLowerCase() : "";

        // Validate file extension
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new IllegalArgumentException("Invalid file extension. Only PDF, JPG, JPEG, and PNG files are allowed");
        }

        try {
            Path dir = Paths.get(uploadDir, String.valueOf(subFolderId));
            Files.createDirectories(dir);

            String storedName = UUID.randomUUID() + ext;
            Path target = dir.resolve(storedName);
            Files.copy(file.getInputStream(), target);

            log.info("Stored file: {} -> {} (size: {} bytes)", original, storedName, file.getSize());
            return subFolderId + "/" + storedName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
}
