package com.bbangbuddy.global.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

/**
 * @PackageName : com.bbangbuddy.global.util
 * @FileName : FileService
 * @Author : hjsim
 * @Date : 2025-06-22
 * @Description :  파일 업로드 및 삭제를 처리하는 서비스 클래스
 */
@Service
@Slf4j
public class FileService {

    @Value("${pot.image.upload.path}")
    private String uploadPath;

    public String saveImage(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path directory = Paths.get(uploadPath);
        Path filePath = directory.resolve(fileName);

        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }

    public void deleteImage(String fileName) {
        if (fileName == null) return;
        try {
            Path filePath = Paths.get(uploadPath, fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", e.getMessage());
        }
    }

}
