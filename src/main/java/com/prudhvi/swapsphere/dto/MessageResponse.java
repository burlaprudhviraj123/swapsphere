package com.prudhvi.swapsphere.dto;

import com.prudhvi.swapsphere.entity.MessageType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MessageResponse {

    private Long id;

    private Long senderId;

    private String senderName;

    private MessageType type;

    private String content;

    private LocalDateTime sentAt;
}
