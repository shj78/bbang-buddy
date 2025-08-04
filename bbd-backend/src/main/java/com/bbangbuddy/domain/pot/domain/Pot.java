package com.bbangbuddy.domain.pot.domain;

import com.bbangbuddy.domain.pot.dto.PotDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import javax.persistence.*;

/**
 * @PackageName : com.bbangbuddy.domain.pot.domain
 * @FileName : Pot
 * @Author : hjsim
 * @Date : 2025-06-08
 * @Description : 빵팟 엔티티
 */
@Entity
@Table(name = "BBANGPOT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Pot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "TITLE", nullable = false)
    private String title;

    @Column(name = "DESCRIPTION")
    @Lob
    private String description;

    @Column(name = "LATITUDE", nullable = false, precision = 17, scale = 16)
    private Double latitude;

    @Column(name = "LONGITUDE", nullable = false, precision = 18, scale = 16)
    private Double longitude;

    @Column(name = "ADDRESS", length = 255)
    private String address;

    @Column(name = "MAX_PARTICIPANTS", nullable = false)
    private Integer maxParticipants;

    @Column(name = "CURRENT_PARTICIPANTS", nullable = false)
    @Builder.Default
    private Integer currentParticipants = 0;

    @Column(name = "DUE_DATE", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "IMAGE_PATH")
    private String imagePath;

    @Column(name = "ORIGINAL_FILE_NAME")
    private String originalFileName;

    //여러개의 팟이 한 유저에 할당 가능
    @Column(name = "CREATED_BY", nullable = false)
    private Long createdBy;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    public void updateFromDto(PotDto.Upsert upsert) {
        this.title = upsert.getTitle();
        this.description = upsert.getDescription();
        this.latitude = upsert.getLatitude();
        this.longitude = upsert.getLongitude();
        this.address = upsert.getAddress();
        this.maxParticipants = upsert.getMaxParticipants();
        this.currentParticipants = upsert.getCurrentParticipants() != null ? upsert.getCurrentParticipants() : 0;
        this.dueDate = upsert.getDueDate();
        this.imagePath = upsert.getImagePath();
        this.originalFileName = upsert.getOriginalFileName();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}