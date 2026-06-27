package com.prudhvi.swapsphere.service;


import com.prudhvi.swapsphere.dto.*;
import com.prudhvi.swapsphere.entity.*;
import com.prudhvi.swapsphere.exception.BadRequestException;
import com.prudhvi.swapsphere.exception.ProductNotFoundException;
import com.prudhvi.swapsphere.exception.UserNotFoundException;
import com.prudhvi.swapsphere.exception.WishlistException;
import com.prudhvi.swapsphere.repository.ConversationRepository;
import com.prudhvi.swapsphere.repository.ProductImageRepository;
import com.prudhvi.swapsphere.repository.ProductRepository;
import com.prudhvi.swapsphere.repository.UserRepository;
import com.prudhvi.swapsphere.specification.ProductSpecification;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.prudhvi.swapsphere.entity.ProductImage;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final ProductImageRepository productImageRepository;
    private final ConversationRepository conversationRepository;

    @Transactional
    public ProductDetailsResponse createProduct(ProductRequest productRequest, MultipartFile[] images) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        validateImages(images);
        Product product =
                Product.builder()
                        .title(productRequest.getTitle())
                        .description(productRequest.getDescription())
                        .price(productRequest.getPrice())
                        .quantity(productRequest.getQuantity())
                        .category(productRequest.getCategory())
                        .condition(productRequest.getCondition())
                        .usageDuration(productRequest.getUsageDuration())
                        .status(ProductStatus.AVAILABLE)
                        .negotiable(productRequest.getNegotiable() != null ? productRequest.getNegotiable() : false)
                        .seller(seller)
                        .build();

        Product savedProduct = productRepository.save(product);
        return uploadProductImages(savedProduct, images);
    }

    public Page<ProductCardResponse> getAllProducts(Pageable pageable) {
        return productRepository
                .findByStatusAndDeletedAtIsNull(ProductStatus.AVAILABLE, pageable)
                .map(this::mapToProductCardResponse);
    }

    public ProductDetailsResponse getProductById(Long id) {
        User currentUser = getCurrentUser();
        return mapToProductDetailsResponse(productRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found")), currentUser);
    }

    public Page<ProductCardResponse> searchProducts(String keyWord, Pageable pageable) {
        return productRepository.findByTitleContainingIgnoreCaseAndStatusAndDeletedAtIsNull(keyWord, ProductStatus.AVAILABLE, pageable)
                .map(this::mapToProductCardResponse);
    }

    public Page<ProductCardResponse> getMyProducts(Pageable pageable) {
        User seller = userRepository.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return productRepository
                .findBySellerAndDeletedAtIsNull(seller, pageable)
                .map(this::mapToProductCardResponse);
    }

    public ProductDetailsResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        User currentUser = getCurrentUser();
        validateOwnership(product, currentUser);
        product.setTitle(productRequest.getTitle());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setCategory(productRequest.getCategory());
        product.setCondition(productRequest.getCondition());
        product.setUsageDuration(productRequest.getUsageDuration());
        product.setNegotiable(productRequest.getNegotiable());
        Product updatedProduct = productRepository.save(product);
        return mapToProductDetailsResponse(updatedProduct,  currentUser);
    }

    public void deleteProduct(Long id) {
        Product currentProduct = getCurrentProduct(id);
        User currentUser = getCurrentUser();
        validateOwnership(currentProduct, currentUser);
        currentProduct.setDeletedAt(LocalDateTime.now());
        productRepository.save(currentProduct);
    }


    public Page<ProductCardResponse> filterProducts(ProductFilter productFilter, Pageable pageable) {
        if(productFilter.getMinPrice() != null && productFilter.getMaxPrice() != null && productFilter.getMinPrice() > productFilter.getMaxPrice()) {
            throw new BadRequestException("Minimum price cannot be greater than maximum price");
        }
        return productRepository.findAll(ProductSpecification.filterProducts(productFilter), pageable)
                .map(this::mapToProductCardResponse);
    }

    private ProductDetailsResponse uploadProductImages(Product product, MultipartFile[] files) {

        User currentUser = getCurrentUser();

        validateOwnership(product, currentUser);

        List<String> imageUrls = imageService.uploadImages(files);

        List<ProductImage> images = new ArrayList<>();

        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage image = ProductImage.builder()
                    .imageUrl(imageUrls.get(i))
                    .displayOrder(i + 1)
                    .cover(i == 0)
                    .product(product)
                    .build();
            productImageRepository.save(image);
            images.add(image);
        }

        product.getImages().clear();
        product.getImages().addAll(images);
        Product saved = productRepository.save(product);
        return mapToProductDetailsResponse(saved, currentUser);
    }
    public void addToWishlist(Long productId) {
        Product product = productRepository.findByIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        User currentUser = getCurrentUser();
        if(product.getSeller().getId().equals(currentUser.getId())) {
            throw new WishlistException("You cannot wishlist your own product");
        }
        currentUser.getWishlist().add(product);
        userRepository.save(currentUser);
    }

    public void removeFromWishlist(Long productId) {
        Product product = productRepository.findByIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        User currentUser = getCurrentUser();
        currentUser.getWishlist().remove(product);
        userRepository.save(currentUser);
    }

    public Page<ProductCardResponse> getWishlistProducts(Pageable pageable) {
        User currentUser = getCurrentUser();
        return productRepository.findByWishlistedByContainsAndDeletedAtIsNull(currentUser, pageable)
                .map(this::mapToProductCardResponse);
    }

    @Transactional
    public ProductDetailsResponse updateProductStatus(Long productId, UpdateProductStatusRequest request) {

        Product product = getCurrentProduct(productId);

        User currentUser = getCurrentUser();

        validateOwnership(product, currentUser);

        validateStatusTransition(product.getStatus(), request.getStatus());

        product.setStatus(request.getStatus());

        Product updatedProduct = productRepository.save(product);

        return mapToProductDetailsResponse(updatedProduct, currentUser);
    }














    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return  userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    private Product getCurrentProduct(long id) {
        return productRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
    }

    private void validateOwnership(Product product, User user) {
        if(!product.getSeller().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not allowed to perform this operation");
        }
    }

    private ProductDetailsResponse mapToProductDetailsResponse(Product product, User currentUser) {
        return ProductDetailsResponse.builder()
                .id(product.getId())
                .images(product.getImages().stream().map(this::mapToImageResponse).toList())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .condition(product.getCondition())
                .usageDuration(product.getUsageDuration())
                .negotiable(product.getNegotiable())
                .status(product.getStatus())
                .sellerName(product.getSeller().getName())
                .collegeName(product.getSeller().getCollegeName())
                .city(product.getSeller().getCity())
                .owner(currentUser.getId().equals(product.getSeller().getId()))
                .wishlisted(currentUser.getWishlist().contains(product))
                .interested(conversationRepository.existsByBuyerAndSellerAndProduct(currentUser, product.getSeller(), product))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private ProductImageResponse mapToImageResponse(ProductImage image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .displayOrder(image.getDisplayOrder())
                .cover(image.getCover())
                .build();
    }
    private ProductCardResponse mapToProductCardResponse(Product product){
        return ProductCardResponse.builder()
                .id(product.getId())
                .coverImage(
                        product.getImages()
                                .stream()
                                .filter(ProductImage::getCover)
                                .findFirst()
                                .map(this::mapToImageResponse)
                                .orElse(null)
                )
                .condition(product.getCondition())
                .title(product.getTitle())
                .price(product.getPrice())
                .status(product.getStatus())
                .sellerName(product.getSeller().getName())
                .city(product.getSeller().getCity())
                .build();
    }

    private void validateImages(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new BadRequestException("At least one product image is required.");
        }
        if (files.length > 5) {
            throw new BadRequestException("A maximum of 5 images is allowed.");
        }

        for (MultipartFile file : files) {
            String contentType = file.getContentType();

            if (contentType == null || !contentType.startsWith("image/")) {
                throw new BadRequestException("Only image files are allowed.");
            }
            if (file.isEmpty()) {
                throw new BadRequestException("Uploaded image cannot be empty.");
            }

        }
    }

    private void validateStatusTransition(ProductStatus currentStatus, ProductStatus targetStatus) {

        if (currentStatus == targetStatus) {throw new BadRequestException(
                    "Product is already in " + currentStatus + " status.");
        }
        switch (currentStatus) {
            case AVAILABLE -> {
                if (targetStatus != ProductStatus.RESERVED) {
                    throw new BadRequestException("An available product can only be marked as RESERVED.");
                }
            }

            case RESERVED -> {
                if (targetStatus != ProductStatus.AVAILABLE && targetStatus != ProductStatus.SOLD) {
                    throw new BadRequestException("A reserved product can only be marked as AVAILABLE or SOLD.");
                }
            }

            case SOLD -> throw new BadRequestException("A sold product cannot be updated.");

            default -> throw new BadRequestException("Invalid product status transition.");
        }
    }
}
