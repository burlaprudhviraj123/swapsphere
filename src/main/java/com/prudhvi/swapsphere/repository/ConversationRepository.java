package com.prudhvi.swapsphere.repository;

import com.prudhvi.swapsphere.entity.Conversation;
import com.prudhvi.swapsphere.entity.Product;
import com.prudhvi.swapsphere.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByBuyerAndSellerAndProduct(User buyer, User seller, Product product);
    Page<Conversation> findByBuyerOrSellerOrderByCreatedAtDesc(User buyer, User seller, Pageable pageable);
    List<Conversation> findByProductOrderByCreatedAtDesc(Product product);
    boolean existsByBuyerAndSellerAndProduct(User currentUser, User seller, Product product);
}
