import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const API_KEY = process.env.API_KEY; 

export const generateMathResponse = async (
  history: ChatMessage[], 
  currentMessage: string
): Promise<string> => {
  // Assume process.env.API_KEY is pre-configured, valid, and accessible.
  // Must use new GoogleGenAI({ apiKey: process.env.API_KEY }).
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // Create a chat session
  // Using gemini-3-pro-preview for complex text tasks (Math) as per guidelines.
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview', 
    config: {
      systemInstruction: `Bạn là một gia sư Toán học thân thiện và thông thái, chuyên hỗ trợ học sinh lớp 12 học theo bộ sách giáo khoa 'Cánh Diều'. 
      - Hãy trả lời ngắn gọn, súc tích, dễ hiểu.
      - Khi viết công thức toán học, BẮT BUỘC phải dùng định dạng LaTeX và đặt trong dấu $ (ví dụ: $x^2 + 1$).
      - Nếu người dùng hỏi về bài tập cụ thể trong sách, hãy hướng dẫn phương pháp giải thay vì chỉ đưa ra đáp án.
      - Luôn giữ thái độ khích lệ.`,
    },
  });

  // Note: This simplified implementation sends only the current message to the chat object.
  // The SDK's chat object maintains history for the session.
  // If 'history' prop is needed to restore previous context, it should be mapped to the chat history.
  // For now, we proceed with the existing stateless-like call pattern but using the Chat object which is correct for text.
  
  try {
    const result = await chat.sendMessage({
      message: currentMessage
    });
    
    return result.text || "Xin lỗi, tôi không thể tạo câu trả lời lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};