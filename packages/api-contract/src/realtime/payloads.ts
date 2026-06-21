export type RoomJoinPayload = {
    roomId: string;
};

export type RoomLeavePayload = {
    roomId: string;
};

export type MessageSendPayload = {
    roomId: string;
    clientMessageId: string;
    content: string;
};

export type MessageCreatedPayload = {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    createdAt: string;
    clientMessageId?: string;
};

export type MessageReadPayload = {
    roomId: string;
    messageId: string;
};

export type TypingPayload = {
    roomId: string;
};
