package com.prudhvi.swapsphere.controller;


import com.prudhvi.swapsphere.dto.ConversationResponse;
import com.prudhvi.swapsphere.dto.MessageResponse;
import com.prudhvi.swapsphere.dto.ProductConversationResponse;
import com.prudhvi.swapsphere.dto.SendMessageRequest;
import com.prudhvi.swapsphere.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;


    @GetMapping
    public ResponseEntity<Page<ConversationResponse>>
    getMyConversations(Pageable pageable) {
        return ResponseEntity.ok(conversationService.getMyConversations(pageable));
    }

    @PostMapping("/{conversationId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(@PathVariable Long conversationId, @RequestBody SendMessageRequest request) {

        return ResponseEntity.ok(conversationService.sendMessage(conversationId, request));
    }
    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<Page<MessageResponse>> getMessages(@PathVariable Long conversationId, Pageable pageable) {

        return ResponseEntity.ok(conversationService.getMessages(conversationId, pageable));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ConversationResponse> startConversation(@PathVariable Long productId) {
        return ResponseEntity.ok(conversationService.startConversation(productId));
    }

    @PostMapping("/{conversationId}/reserve")
    public ResponseEntity<String> reserveProduct(@PathVariable Long conversationId) {
        conversationService.reserveProduct(conversationId);
        return ResponseEntity.ok("Product reserved successfully");
    }

    @PostMapping("/{productId}/cancel-reservation")
    public ResponseEntity<String> cancelReservation(@PathVariable Long productId) {
        conversationService.cancelReservation(productId);
        return ResponseEntity.ok("Reservation cancelled successfully");
    }


    @GetMapping("/{productId}/conversations")
    public ResponseEntity<List<ProductConversationResponse>> getProductConversations(@PathVariable Long productId) {
        return ResponseEntity.ok(conversationService.getProductConversations(productId));
    }
}
