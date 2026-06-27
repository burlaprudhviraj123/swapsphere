package com.prudhvi.swapsphere.repository;

import com.prudhvi.swapsphere.entity.Conversation;
import com.prudhvi.swapsphere.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByConversationOrderBySentAtDesc(Conversation conversation, Pageable pageable);
}