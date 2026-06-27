package com.prudhvi.swapsphere.dto;

import com.prudhvi.swapsphere.entity.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    private MessageType type;
    private String content;
}
