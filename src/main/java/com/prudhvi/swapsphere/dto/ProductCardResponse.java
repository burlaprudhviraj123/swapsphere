package com.prudhvi.swapsphere.dto;

import com.prudhvi.swapsphere.entity.ProductCondition;
import com.prudhvi.swapsphere.entity.ProductStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductCardResponse {

    private Long id;

    private ProductImageResponse coverImage;

    private String title;

    private double price;

    private ProductCondition condition;

    private ProductStatus status;

    private String sellerName;

    private String city;

}
