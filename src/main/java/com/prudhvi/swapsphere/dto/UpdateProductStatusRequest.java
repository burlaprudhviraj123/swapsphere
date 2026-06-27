package com.prudhvi.swapsphere.dto;

import com.prudhvi.swapsphere.entity.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateProductStatusRequest {

    @NotNull
    private
    ProductStatus status;

}