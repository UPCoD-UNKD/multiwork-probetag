package com.multiworkbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

/**
 * Data Transfer Object for Comment entity.
 * Uses UserSummaryDTO for creator to avoid lazy initialization issues.
 * Conversion should be done through CommentMapper.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private UserSummaryDTO creator;
    private String text;
    private LocalDate date;
    private LocalTime time;
    private Set<CommentDTO> replies;
}
