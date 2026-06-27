package com.prudhvi.swapsphere.specification;

import com.prudhvi.swapsphere.dto.ProductFilter;
import com.prudhvi.swapsphere.entity.Product;
import com.prudhvi.swapsphere.entity.ProductStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class ProductSpecification {
    private ProductSpecification() {}
    public static Specification<Product> filterProducts(ProductFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isNull(root.get("deletedAt")));
            predicates.add(cb.equal(root.get("status"), ProductStatus.AVAILABLE));
            if(filter.getCategory() != null)   predicates.add(cb.equal(root.get("category"), filter.getCategory()));
            if(filter.getCondition() != null)    predicates.add(cb.equal(root.get("condition"), filter.getCondition()));
            if(filter.getMinPrice() != null)    predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()));
            if(filter.getMaxPrice() != null)    predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getMaxPrice()));
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
