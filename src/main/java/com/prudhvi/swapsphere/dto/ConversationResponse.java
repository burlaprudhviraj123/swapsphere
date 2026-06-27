package com.prudhvi.swapsphere.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConversationResponse {
    private Long id;

    private Long productId;

    private String productTitle;

    private String productImageUrl;

    private Long otherUserId;

    private String otherUserName;

    private LocalDateTime createdAt;
}
