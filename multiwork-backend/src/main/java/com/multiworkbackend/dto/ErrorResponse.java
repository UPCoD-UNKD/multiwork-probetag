package com.multiworkbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private String message;
}
