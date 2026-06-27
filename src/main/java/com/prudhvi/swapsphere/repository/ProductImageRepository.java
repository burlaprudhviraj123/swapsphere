package com.prudhvi.swapsphere.repository;

import com.prudhvi.swapsphere.entity.Product;
import com.prudhvi.swapsphere.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

    List<ProductImage> findByProductOrderByDisplayOrderAsc(Product product);

    Optional<ProductImage> findByProductAndCoverTrue(Product product);
}
