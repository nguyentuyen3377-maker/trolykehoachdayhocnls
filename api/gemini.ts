
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { subject, grade, level } = req.body;

  if (!subject || !grade) {
    return res.status(400).json({ error: 'Thiếu thông tin đầu vào (Môn học/Khối lớp)' });
  }

  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Chưa cấu hình API Key. Vui lòng kiểm tra biến môi trường.' });
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Bạn là chuyên gia sư phạm Tiểu học Việt Nam. Hãy lập Kế hoạch dạy học 35 tuần cho:
  - Môn: ${subject}
  - Khối: ${grade}
  - Mức độ: ${level}
  
  Yêu cầu:
  1. Tuân thủ Chương trình GDPT 2018 và Khung năng lực số (Thông tư 02/2025).
  2. Mỗi dòng tương ứng với 1 tuần (Tổng cộng 35 dòng từ Tuần 1 đến Tuần 35).
  3. Tích hợp mã chỉ báo NLS (ví dụ: NLS 1.1, NLS 2.2) phù hợp bài học.
  4. Nội dung lồng ghép phải thực tế, dễ triển khai tại trường học Việt Nam.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              weekMonth: { type: Type.STRING },
              theme: { type: Type.STRING },
              lessonName: { type: Type.STRING },
              periods: { type: Type.NUMBER },
              digitalCompetencyCode: { type: Type.STRING },
              integrationSuggestions: { type: Type.STRING },
              note: { type: Type.STRING }
            },
            required: ["weekMonth", "theme", "lessonName", "periods", "digitalCompetencyCode", "integrationSuggestions"]
          }
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error('AI không trả về dữ liệu');

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Lỗi máy chủ', 
      message: error.message 
    });
  }
}
