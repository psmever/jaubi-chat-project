export const SocketEvents = {
  RoomJoin: 'room:join',
  RoomLeave: 'room:leave',
  MessageSend: 'message:send',
  MessageCreated: 'message:created',
  MessageRead: 'message:read',
  TypingStart: 'typing:start',
  TypingStop: 'typing:stop'
} as const;

export type SocketEvent = (typeof SocketEvents)[keyof typeof SocketEvents];
