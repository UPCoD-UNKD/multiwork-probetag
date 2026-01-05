package com.multiworkbackend.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginDTO implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    @NotBlank
    @NotEmpty
    private String email;
    @NotBlank
    @NotEmpty
    private String password;
}
