package com.prudhvi.swapsphere.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.prudhvi.swapsphere.entity.Category;
import com.prudhvi.swapsphere.entity.ProductCondition;
import com.prudhvi.swapsphere.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductDetailsResponse {

    private Long id;

    private List<ProductImageResponse> images;

    private String title;

    private String description;

    private double price;

    private Integer quantity;

    private Category category;

    private ProductCondition condition;

    private String usageDuration;

    private Boolean negotiable;

    private ProductStatus status;

    private String sellerName;

    private String collegeName;

    private String city;

    private Boolean owner;

    private Boolean wishlisted;

    private Boolean interested;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
