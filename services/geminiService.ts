
import { Type } from "@google/genai";

/**
 * Service to handle full curriculum generation using the internal Gemini API proxy.
 */
export class GeminiService {
  async generateFullPlan(subject: string, grade: string, level: string) {
    const prompt = `Bạn là một chuyên gia lập trình giáo dục và sư phạm Tiểu học tại Việt Nam. 
    Hãy tạo Kế hoạch dạy học 35 tuần cho:
    - Môn học: ${subject}
    - Khối lớp: ${grade}
    - Mức độ đạt được: ${level}
    
    Yêu cầu:
    1. Tuân thủ Chương trình GDPT 2018 (Thông tư 32/2018).
    2. Tích hợp Khung năng lực số (Thông tư 02/2025 và Công văn 3456/BGDĐT).
    3. Phân bổ đủ 35 tuần thực học.
    
    Trả về kết quả dưới dạng JSON là một mảng các đối tượng cho bảng kế hoạch.`;

    // Define response schema using the Type enum as per standard library guidelines
    const config = {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            weekMonth: { type: Type.STRING, description: "Ví dụ: Tuần 1" },
            theme: { type: Type.STRING, description: "Chủ đề hoặc mạch nội dung" },
            lessonName: { type: Type.STRING, description: "Tên bài học" },
            periods: { type: Type.NUMBER, description: "Số tiết" },
            digitalCompetencyCode: { type: Type.STRING, description: "Mã chỉ báo năng lực số (ví dụ: NLS 1.1)" },
            integrationSuggestions: { type: Type.STRING, description: "Gợi ý nội dung lồng ghép/điều chỉnh" },
            note: { type: Type.STRING, description: "Ghi chú" }
          },
          required: ["weekMonth", "theme", "lessonName", "periods", "digitalCompetencyCode", "integrationSuggestions"]
        }
      }
    };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, config }),
      });

      if (!response.ok) throw new Error('Failed to fetch from Gemini API');
      const data = await response.json();
      // Ensure we handle cases where response.text might be undefined or incorrectly formatted
      return JSON.parse(data.text || "[]");
    } catch (error) {
      console.error("Gemini Generation Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
