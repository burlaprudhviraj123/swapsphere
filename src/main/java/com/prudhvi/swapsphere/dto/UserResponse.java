package com.prudhvi.swapsphere.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private String collegeName;
    private String city;
    private String pincode;
}