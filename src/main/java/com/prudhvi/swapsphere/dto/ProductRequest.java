package com.prudhvi.swapsphere.dto;

import com.prudhvi.swapsphere.entity.Category;
import com.prudhvi.swapsphere.entity.ProductCondition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {

    @NotBlank
    private String title;

    private String description;

    @Positive
    private double price;

    @Positive
    private Integer quantity;

    @NotNull
    private Category category;

    @NotNull
    private ProductCondition condition;

    private String usageDuration;

    private Boolean negotiable;
}