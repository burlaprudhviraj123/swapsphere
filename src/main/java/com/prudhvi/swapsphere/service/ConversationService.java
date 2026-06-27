package com.prudhvi.swapsphere.service;

import com.prudhvi.swapsphere.dto.ConversationResponse;
import com.prudhvi.swapsphere.dto.MessageResponse;
import com.prudhvi.swapsphere.dto.ProductConversationResponse;
import com.prudhvi.swapsphere.dto.SendMessageRequest;
import com.prudhvi.swapsphere.entity.*;
import com.prudhvi.swapsphere.exception.*;
import com.prudhvi.swapsphere.repository.ConversationRepository;
import com.prudhvi.swapsphere.repository.MessageRepository;
import com.prudhvi.swapsphere.repository.ProductRepository;
import com.prudhvi.swapsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;


    public ConversationResponse startConversation(Long productId) {
        User currentUser = getCurrentUser();
        Product product = productRepository.findByIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));
        if(product.getSeller().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You cannot chat with yourself");
        }
        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new BadRequestException("This product is no longer available.");
        }
        Optional<Conversation> existing = conversationRepository.findByBuyerAndSellerAndProduct(currentUser, product.getSeller(), product);
        if(existing.isPresent()) {
            return mapToConversationResponse(existing.get(), currentUser);
        }
        Conversation conversation = Conversation.builder()
                .buyer(currentUser)
                .seller(product.getSeller())
                .product(product)
                .build();
        Conversation saved = conversationRepository.save(conversation);
        return mapToConversationResponse(saved, currentUser);
    }

    public Page<ConversationResponse> getMyConversations(Pageable pageable) {
        User currentUser = getCurrentUser();

        return conversationRepository.findByBuyerOrSellerOrderByCreatedAtDesc(currentUser, currentUser, pageable)
                .map(conversation -> mapToConversationResponse(conversation, currentUser));
    }

    public MessageResponse sendMessage(Long conversationId, SendMessageRequest request) {
        User currentUser = getCurrentUser();
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));
        validateConversationAccess(conversation, currentUser);
        Message message = Message.builder()
                .conversation(conversation)
                .sender(currentUser)
                .type(request.getType())
                .content(request.getContent())
                .build();
        Message saved = messageRepository.save(message);
        return MessageResponse.builder()
                .id(saved.getId())
                .senderId(saved.getSender().getId())
                .senderName(saved.getSender().getName())
                .type(saved.getType())
                .content(saved.getContent())
                .sentAt(saved.getSentAt())
                .build();
    }

    public Page<MessageResponse> getMessages(Long conversationId, Pageable pageable) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));
        User currentUser = getCurrentUser();
        validateConversationAccess(conversation, currentUser);
        return messageRepository.findByConversationOrderBySentAtDesc(conversation, pageable)
                .map(this::mapToMessageResponse);

    }

    private MessageResponse mapToMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .type(message.getType())
                .content(message.getContent())
                .sentAt(message.getSentAt())
                .build();
    }
    public void reserveProduct(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));
        User currentUser = getCurrentUser();
        if(!conversation.getSeller().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not allowed to reserve this product");
        }

        Product product = conversation.getProduct();

        if(product.getStatus() == ProductStatus.SOLD) {
            throw new ReservationException("Product already sold");
        }

        if(product.getStatus() == ProductStatus.RESERVED || product.getReservedFor() != null) {
            throw new ReservationException("Product already reserved");
        }

        product.setStatus(ProductStatus.RESERVED);
        product.setReservedFor(conversation.getBuyer());

        productRepository.save(product);
    }

    public void cancelReservation(Long productId) {

        Product product = productRepository.findByIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if(product.getStatus() != ProductStatus.RESERVED) {
            throw new ReservationException("Product is not reserved");
        }

        User currentUser = getCurrentUser();

        boolean isSeller = product.getSeller().getId().equals(currentUser.getId());

        boolean isReservedBuyer = product.getReservedFor() != null && product.getReservedFor().getId().equals(currentUser.getId());

        if(!isSeller && !isReservedBuyer) {
            throw new AccessDeniedException("You are not allowed to cancel this reservation");
        }

        product.setStatus(ProductStatus.AVAILABLE);
        product.setReservedFor(null);

        productRepository.save(product);
    }
    public List<ProductConversationResponse> getProductConversations(Long productId) {

        Product product = productRepository.findByIdAndDeletedAtIsNull(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        User currentUser = getCurrentUser();

        if (!product.getSeller().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not allowed to view these conversations");
        }

        return conversationRepository.findByProductOrderByCreatedAtDesc(product)
                .stream()
                .map(conversation -> ProductConversationResponse.builder()
                        .conversationId(conversation.getId())
                        .buyerId(conversation.getBuyer().getId())
                        .buyerName(conversation.getBuyer().getName())
                        .startedAt(conversation.getCreatedAt())
                        .build())
                .toList();
    }














    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
    private void validateConversationAccess(Conversation conversation, User currentUser) {
        if(!conversation.getBuyer().getId().equals(currentUser.getId()) && !conversation.getSeller().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You are not part of this conversation");
        }
    }

    private ConversationResponse mapToConversationResponse(Conversation conversation, User currentUser) {
        User otherUser;
        if(conversation.getBuyer().getId().equals(currentUser.getId())) {
            otherUser = conversation.getSeller();
        }
        else {
            otherUser = conversation.getBuyer();
        }

        return ConversationResponse.builder()
                .id(conversation.getId())
                .productId(conversation.getProduct().getId())
                .productTitle(conversation.getProduct().getTitle())
                .productImageUrl(conversation.getProduct().getCoverImageUrl())
                .otherUserId(otherUser.getId())
                .otherUserName(otherUser.getName())
                .createdAt(conversation.getCreatedAt())
                .build();
    }

}
