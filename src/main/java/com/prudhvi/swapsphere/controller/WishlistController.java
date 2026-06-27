package com.prudhvi.swapsphere.controller;


import com.prudhvi.swapsphere.dto.ProductCardResponse;
import com.prudhvi.swapsphere.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final ProductService productService;

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId) {
        productService.addToWishlist(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<ProductCardResponse>> getWishlistProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getWishlistProducts(pageable));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable Long productId) {
        productService.removeFromWishlist(productId);
        return ResponseEntity.ok().build();
    }
}
