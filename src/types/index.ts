export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
}

export interface Chat {
  chatId: string;
  messages: ChatMessage[];
}

export interface GreenApiNotification {
  receiptId: number;
  body: {
    typeWebhook: string;
    timestamp: number;
    senderData: {
      chatId: string;
      sender: string;
      senderName?: string;
    };
    messageData?: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
}