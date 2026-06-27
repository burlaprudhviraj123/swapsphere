package com.prudhvi.swapsphere.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductConversationResponse {

    private Long conversationId;
    private Long buyerId;
    private String buyerName;
    private LocalDateTime startedAt;
}