import api from "../lib/axios";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
}

export const sendMessage = async (
  message: string,
  history: ChatMessage[],
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("chat", {
    message,
    history,
  });
  return response.data;
};
