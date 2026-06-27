package com.prudhvi.swapsphere.dto;

import com.prudhvi.swapsphere.entity.Category;
import com.prudhvi.swapsphere.entity.ProductCondition;
import lombok.Data;

@Data
public class ProductFilter {

    private Category category;

    private ProductCondition condition;

    private Double minPrice;

    private Double maxPrice;
}
