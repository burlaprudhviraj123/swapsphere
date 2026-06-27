package com.prudhvi.swapsphere.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 20)
    private String password;

    @NotBlank
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Enter a valid 10 digit mobile number"
    )
    private String phoneNumber;

    @NotBlank
    @Pattern(
            regexp = "^[0-9]{6}$",
            message = "Pincode must contain exactly 6 digits"
    )
    private String pincode;

    @NotBlank
    @Size(max = 150)
    private String collegeName;

    @NotBlank
    @Size(max = 100)
    private String city;
}