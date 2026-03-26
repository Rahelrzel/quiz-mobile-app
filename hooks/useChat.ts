import { useMutation } from "@tanstack/react-query";
import { sendMessage, ChatMessage, ChatResponse } from "../api/chat";

export const useChat = () => {
  return useMutation<
    ChatResponse,
    Error,
    { message: string; history: ChatMessage[] }
  >({
    mutationFn: ({ message, history }) => sendMessage(message, history),
  });
};
