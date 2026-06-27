package com.prudhvi.swapsphere.controller;


import com.prudhvi.swapsphere.dto.*;
import com.prudhvi.swapsphere.entity.Category;
import com.prudhvi.swapsphere.entity.ProductCondition;
import com.prudhvi.swapsphere.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDetailsResponse> createProduct(@RequestPart("product") @Valid ProductRequest productRequest, @RequestPart("images") MultipartFile[] images) {
        return ResponseEntity.ok(productService.createProduct(productRequest, images));
    }


    @GetMapping
    public ResponseEntity<Page<ProductCardResponse>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailsResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductCardResponse>> searchProducts(@RequestParam("keyword") String keyword, Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(keyword, pageable));
    }

    @GetMapping("/my-products")
    public ResponseEntity<Page<ProductCardResponse>> getMyProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getMyProducts(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailsResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productService.updateProduct(id, productRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<ProductCardResponse>>
    filterProducts(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) ProductCondition condition,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            Pageable pageable
    ) {
        ProductFilter filter = new ProductFilter();
        filter.setCategory(category);
        filter.setCondition(condition);
        filter.setMinPrice(minPrice);
        filter.setMaxPrice(maxPrice);
        return ResponseEntity.ok(productService.filterProducts(filter, pageable));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductDetailsResponse> updateProductStatus(@PathVariable Long id, @Valid @RequestBody UpdateProductStatusRequest request) {

        return ResponseEntity.ok(productService.updateProductStatus(id, request));
    }
}
