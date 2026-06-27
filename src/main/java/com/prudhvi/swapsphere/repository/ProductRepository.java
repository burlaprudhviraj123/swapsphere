package com.prudhvi.swapsphere.repository;

import com.prudhvi.swapsphere.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByTitleContainingIgnoreCaseAndStatusAndDeletedAtIsNull(String keyword, ProductStatus status, Pageable pageable);
    Page<Product> findBySellerAndDeletedAtIsNull(User user, Pageable pageable);
    Optional<Product> findByIdAndDeletedAtIsNull(Long id);
    Page<Product> findByWishlistedByContainsAndDeletedAtIsNull(User user, Pageable pageable);
    Page<Product> findByStatusAndDeletedAtIsNull(ProductStatus status, Pageable pageable);
}
