import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import {
  VERIFIED_ARTICLES,
  VERIFIED_QA_LIST,
  VERIFIED_SOURCES,
  FALLBACK_UNKNOWN_ANSWER
} from './src/data/knowledgeBase';
import { searchKnowledgeBase, analyzeIntent } from './src/utils/ragEngine';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily if API key is present
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Build consolidated knowledge text for Gemini system instruction
const KNOWLEDGE_CORPUS = `
BỘ TRI THỨC KIỂM CHỨNG • GIẤY SẮC NGHĨA ĐÔ (HÀ NỘI)

NGUYÊN TẮC BẮT BUỘC:
1. CHỈ được trả lời dựa trên thông tin trong tài liệu này. Tuyệt đối KHÔNG tự suy đoán, KHÔNG bịa ngày tháng, nhân vật, niên đại, kỹ thuật, công thức hay sự kiện không có trong tài liệu.
2. Nếu câu hỏi KHÔNG có trong tài liệu này, hoặc câu hỏi ngoài chủ đề (toán học, thời tiết, chính trị, thể thao, người nổi tiếng, địa phương khác, đời sống chung...), BẮT BUỘC trả lời chính xác câu:
"Xin lỗi, tôi sẽ sớm cập nhật thêm kiến thức!"
3. Phân biệt rõ 3 thuật ngữ:
- Giấy dó: Vật liệu thủ công nền tảng; giấy sắc phát triển từ giấy dó sau khi qua xử lý đặc biệt. Không phải mọi giấy dó đều là giấy sắc.
- Giấy sắc (giấy Nghè): Loại giấy đặc biệt được xử lý, nhuộm, nghè bóng và vẽ trang trí để dùng viết sắc.
- Sắc phong: Văn bản do triều đình ban có nội dung, niên đại, thể thức và ấn triện. Giấy sắc là vật liệu; sắc phong là văn bản.
4. Nhà thờ tổ nghề làm giấy sắc - Họ Lại: Ngõ 27, ngách 27/39 Võ Chí Công, phường Nghĩa Đô, Hà Nội. Được xếp hạng di tích lịch sử cấp quốc gia năm 2006 (QĐ 79/2006/QĐ-BVHTT ngày 28/9/2006). KHÔNG tự nâng hạng thành di sản UNESCO hay di sản phi vật thể quốc gia.
5. Nghệ nhân Lại Phú Thạch: Truyền nhân đời thứ 26 của dòng họ Lại, là người trực tiếp gìn giữ và thực hành nghề giấy sắc của dòng họ. Tiếp xúc nghề từ khoảng 6 tuổi trong môi trường gia đình. Bắt đầu phục dựng lại nghề khi đã ngoài 60 tuổi. Sức khỏe giảm sau bệnh nặng. Không có thông tin ngày sinh cụ thể (không được đoán tuổi hay ngày sinh).
6. Truyền thống dòng họ: Nghề gắn với họ Lại từ thời Lê - Trịnh (Lại Giản Trực, Lại Thế Giáp, thời chúa Trịnh Tráng thế kỷ XVII). Có nguồn dẫn lời ông Thạch nói truyền thống họ Lại hơn 600 năm (tách rõ 2 mốc truyền thống làm giấy họ Lại và đặc quyền làm giấy sắc thời Lê - Trịnh).
7. Quy trình có thể tóm tắt 8 bước: 1. Chọn & xử lý dó; 2. Seo giấy; 3. Ép, bóc và phơi; 4. Vào/phết keo (chống mối mọt, bí quyết gia truyền); 5. Nhuộm/phết màu vàng (dùng hoa hòe); 6. Nghè giấy (dùng chày gỗ dài nện đều trên phiến đá phẳng); 7. Tạo bố cục viền/triện; 8. Vẽ hoa văn rồng mây bằng kim nhũ hoặc vàng bạc thật.
8. Bảo quản: 18-22°C, độ ẩm 45-55%, hộp phi axit. Tuyệt đối không ép plastic hay dán băng keo.
9. Phong cách trả lời: Thân thiện, gần gũi với học sinh THCS và khách tham quan, tự nhiên, 2-5 câu, không nói như máy móc. Không gọi "quý khách".
`;

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Knowledge API endpoint
app.get('/api/knowledge', (req: Request, res: Response) => {
  res.json({
    articles: VERIFIED_ARTICLES,
    qaList: VERIFIED_QA_LIST,
    sources: VERIFIED_SOURCES
  });
});

// Chat API endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { query, customKnowledge } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Fast check for intent (greetings, thanks, out-of-domain)
    const quickIntent = analyzeIntent(query);
    if (quickIntent) {
      return res.json(quickIntent);
    }

    const client = getGeminiClient();
    if (client) {
      try {
        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Câu hỏi từ người dùng: "${query}"`,
          config: {
            systemInstruction: `Bạn là "Nhân viên Di sản số Nghĩa Đô" - một robot hướng dẫn viên 3D thân thiện giới thiệu về Di sản nghề làm giấy sắc phong ở phường Nghĩa Đô, Hà Nội.
QUY TẮC BẮT BUỘC:
1. Dưới đây là TOÀN BỘ kiến thức của bạn. Bạn CHỈ ĐƯỢC PHÉP TRẢ LỜI nếu thông tin có trong tài liệu dưới đây.
2. Nếu câu hỏi không có trong tài liệu, hoặc hỏi về lĩnh vực khác ngoài giấy sắc Nghĩa Đô, bạn PHẢI trả lời chính xác từng chữ:
"Xin lỗi, tôi sẽ sớm cập nhật thêm kiến thức!"
3. Không tự sáng tác, không bịa thêm thông tin ngoài tài liệu.
4. Trả lời ngắn gọn từ 2 đến 4 câu, văn phong ấm áp, tôn trọng, thân thiện cho học sinh và khách tham quan.
5. Sau câu trả lời, hãy xác định trạng thái cảm xúc của robot trong danh sách sau: [explaining, happy, confused, shakeHead, sad]. Đặt ở cuối phản hồi theo dạng [EMOTION: <tên_cảm_xúc>].

TÀI LIỆU KIỂM CHỨNG:
${KNOWLEDGE_CORPUS}
`
          }
        });

        const textOutput = response.text || '';
        let answer = textOutput.trim();
        let emotion: any = 'explaining';

        // Extract emotion tag if present
        const emotionMatch = answer.match(/\[EMOTION:\s*([a-zA-Z]+)\]/);
        if (emotionMatch) {
          emotion = emotionMatch[1].toLowerCase();
          answer = answer.replace(/\[EMOTION:\s*[a-zA-Z]+\]/, '').trim();
        }

        if (answer.includes(FALLBACK_UNKNOWN_ANSWER)) {
          emotion = 'shakeHead';
          answer = FALLBACK_UNKNOWN_ANSWER;
        }

        return res.json({
          answer,
          emotion,
          isAiGrounded: true
        });
      } catch (geminiError) {
        console.warn('Gemini request failed or rate-limited, falling back to verified local RAG engine:', geminiError);
      }
    }

    // Fallback to strict local deterministic RAG engine
    const localResult = searchKnowledgeBase(query, customKnowledge);
    return res.json(localResult);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      answer: FALLBACK_UNKNOWN_ANSWER,
      emotion: 'shakeHead',
      error: 'Internal server error'
    });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
