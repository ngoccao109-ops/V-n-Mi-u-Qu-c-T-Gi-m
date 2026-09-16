import {
  VERIFIED_ARTICLES,
  VERIFIED_QA_LIST,
  FALLBACK_UNKNOWN_ANSWER,
  KnowledgeArticle,
  QAItem
} from '../data/knowledgeBase';

export type RobotEmotion =
  | 'idle'
  | 'greeting'
  | 'listening'
  | 'thinking'
  | 'explaining'
  | 'happy'
  | 'laughing'
  | 'confused'
  | 'shakeHead'
  | 'sad'
  | 'goodbye';

export interface ChatResponse {
  answer: string;
  emotion: RobotEmotion;
  sources?: string[];
  matchedArticleId?: string;
  isFallback?: boolean;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,?!:;'"()\[\]{}_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check for conversational small-talk and compliments
export function analyzeIntent(query: string): ChatResponse | null {
  const norm = normalize(query);

  // Gratitude & praise
  if (
    norm.includes('cam on') ||
    norm.includes('thank') ||
    norm.includes('hay qua') ||
    norm.includes('tuyet voi') ||
    norm.includes('dep qua') ||
    norm.includes('gioi qua') ||
    norm.includes('rat hay') ||
    norm.includes('khen') ||
    norm === 'ok' ||
    norm === 'da ro'
  ) {
    return {
      answer: 'Rất vui vì đã giúp bạn hiểu thêm về di sản giấy sắc Nghĩa Đô! Bạn có muốn tôi kể thêm về công đoạn nào hay câu chuyện dòng họ Lại không?',
      emotion: 'happy'
    };
  }

  // Greeting
  if (
    norm === 'chao' ||
    norm === 'xin chao' ||
    norm === 'hello' ||
    norm === 'hi' ||
    norm.startsWith('xin chao') ||
    norm.startsWith('chao ban') ||
    norm.startsWith('chao robot')
  ) {
    return {
      answer: 'Xin chào bạn! Tôi là Nhân viên Di sản số Nghĩa Đô. Rất vui được đồng hành cùng bạn khám phá nghề làm giấy sắc phong độc đáo này. Bạn muốn bắt đầu từ đâu nào?',
      emotion: 'greeting'
    };
  }

  // Goodbye
  if (
    norm.includes('tam biet') ||
    norm.includes('bye') ||
    norm.includes('hen gap lai') ||
    norm.includes('nghi thoi') ||
    norm.includes('chao tam biet')
  ) {
    return {
      answer: 'Cảm ơn bạn đã cùng tôi khám phá di sản Nghĩa Đô! Chúc bạn một ngày tràn đầy niềm vui và luôn yêu quý các giá trị văn hóa truyền thống nhé!',
      emotion: 'goodbye'
    };
  }

  // Obvious out-of-domain checks (weather, math, sport, celebrity, general politics, coding, crypto...)
  const outOfDomainKeywords = [
    'thoi tiet', 'troi mua', 'troi nang', 'nhiet do hom nay',
    'cong thuc toan', 'giai toan', 'tinh toan', 'phuong trinh',
    'bong da', 'ronaldo', 'messi', 'ngoai hang anh', 'world cup',
    'ca si', 'dien vien', 'showbiz', 'nguoi noi tieng', 'tiktok',
    'bitcoin', 'crypto', 'chung khoan', 'gia vang hom nay',
    'chinh tri', 'tong thong', 'chien tranh nga', 'ukraina',
    'viet code', 'python', 'javascript', 'html'
  ];

  for (const ood of outOfDomainKeywords) {
    if (norm.includes(ood)) {
      return {
        answer: FALLBACK_UNKNOWN_ANSWER,
        emotion: 'shakeHead',
        isFallback: true
      };
    }
  }

  return null;
}

// Strict retrieval engine based ONLY on the verified knowledge base
export function searchKnowledgeBase(
  query: string,
  customArticles?: KnowledgeArticle[]
): ChatResponse {
  const normQuery = normalize(query);
  const words = normQuery.split(' ').filter(w => w.length > 1);

  // 1. Check conversational intents first
  const intentRes = analyzeIntent(query);
  if (intentRes) return intentRes;

  // 2. Exact or near-exact match against verified QA list
  let bestQA: QAItem | null = null;
  let bestQAScore = 0;

  for (const qa of VERIFIED_QA_LIST) {
    const normQ = normalize(qa.question);
    
    // Direct inclusion
    if (normQuery === normQ || normQuery.includes(normQ) || normQ.includes(normQuery)) {
      bestQA = qa;
      bestQAScore = 100;
      break;
    }

    // Word overlap match
    const qaWords = normQ.split(' ');
    let matchCount = 0;
    for (const w of words) {
      if (qaWords.includes(w)) matchCount++;
    }
    const score = (matchCount / Math.max(words.length, qaWords.length)) * 100;
    if (score > bestQAScore) {
      bestQAScore = score;
      bestQA = qa;
    }
  }

  // High confidence QA match (> 45% keyword relevance)
  if (bestQA && bestQAScore >= 45) {
    return {
      answer: bestQA.answer,
      emotion: (bestQA.emotion as RobotEmotion) || 'explaining',
      sources: bestQA.sources
    };
  }

  // 3. Match against verified articles (including user-added knowledge)
  const allArticles = [...VERIFIED_ARTICLES, ...(customArticles || [])];
  let bestArticle: KnowledgeArticle | null = null;
  let bestArtScore = 0;

  for (const article of allArticles) {
    const normTitle = normalize(article.title);
    const normSummary = normalize(article.summary);
    const normContent = normalize(article.content);

    let score = 0;
    for (const w of words) {
      if (normTitle.includes(w)) score += 5;
      if (normSummary.includes(w)) score += 3;
      if (normContent.includes(w)) score += 1;
    }

    if (score > bestArtScore) {
      bestArtScore = score;
      bestArticle = article;
    }
  }

  // If sufficient relevance found in articles (at least 6 points):
  if (bestArticle && bestArtScore >= 6) {
    // Specific domain synthesis based on matched topic
    let answer = '';
    let emotion: RobotEmotion = 'explaining';

    if (bestArticle.id === 'khai_niem_nen_tang') {
      if (normQuery.includes('do') && !normQuery.includes('sac')) {
        answer = 'Giấy dó là vật liệu giấy thủ công truyền thống nền tảng. Giấy sắc được phát triển từ giấy dó sau khi trải qua các công đoạn xử lý công phu, do đó không phải mọi giấy dó đều là giấy sắc bạn nhé!';
      } else if (normQuery.includes('sac phong') || normQuery.includes('phong')) {
        answer = 'Sắc phong là văn bản chính thống do triều đình phong kiến ban hành (phong tặng chức tước cho quan lại hoặc phong thần). Sắc phong là văn bản lịch sử, còn giấy sắc là chất liệu giấy đặc biệt để viết nên văn bản đó.';
      } else {
        answer = 'Bạn cần phân biệt rõ ba khái niệm: Giấy dó là vật liệu thủ công nền tảng; Giấy sắc (giấy Nghè) là giấy đã qua xử lý công phu để dùng viết sắc; còn Sắc phong là văn bản chính thức của triều đình ban.';
      }
    } else if (bestArticle.id === 'nha_tho_to_nghe') {
      answer = 'Nhà thờ tổ nghề làm giấy sắc - Họ Lại hiện nằm tại ngõ 27, ngách 27/39 Võ Chí Công, phường Nghĩa Đô, Hà Nội. Nơi đây đã được xếp hạng Di tích Lịch sử cấp Quốc gia vào năm 2006 (theo Quyết định số 79/2006/QĐ-BVHTT).';
      emotion = 'happy';
    } else if (bestArticle.id === 'dong_ho_lai_truyen_thong') {
      answer = 'Theo gia phả và các nguồn báo chí chính thống ghi lại, nghề giấy sắc gắn liền với dòng họ Lại ở Nghĩa Đô từ thời Lê - Trịnh. Nguồn VOV2 nêu người khởi nghiệp giấy sắc trong gia phả là Lại Giản Trực, gắn liền với gia đình chúa Trịnh Tráng thế kỷ XVII.';
    } else if (bestArticle.id === 'nghe_nhan_lai_phu_thach') {
      if (normQuery.includes('sinh') || normQuery.includes('tuoi') || normQuery.includes('bao nhieu tuoi')) {
        answer = 'Tài liệu hiện có không ghi nhận ngày tháng năm sinh chính xác của ông Lại Phú Thạch, chỉ biết ông là truyền nhân đời thứ 26 của dòng họ Lại và bắt đầu phục dựng lại nghề khi đã ngoài 60 tuổi.';
      } else {
        answer = 'Ông Lại Phú Thạch là truyền nhân đời thứ 26 của dòng họ Lại, hiện được các cơ quan báo chí chính thống ghi nhận là người trực tiếp gìn giữ và thực hành nghề làm giấy sắc truyền thống tại Nghĩa Đô.';
      }
    } else if (bestArticle.id === 'thao_tac_nghe_giay') {
      answer = 'Nghè giấy là công đoạn người thợ đặt tờ giấy lên phiến đá phẳng, dùng chày gỗ dài nện đều tay. Thao tác này đòi hỏi sự phối hợp khéo léo để nén chặt xơ dó, giúp bề mặt giấy trở nên đanh chắc, mịn màng và láng bóng.';
    } else if (bestArticle.id === 'bao_quan_sac_phong') {
      answer = 'Theo khuyến nghị của cơ quan lưu trữ, sắc phong cần được giữ ở nhiệt độ 18–22°C, độ ẩm 45–55% trong hộp phi axit. Tuyệt đối không được ép plastic hay dán băng dính vì sẽ phá hủy vĩnh viễn xơ giấy cổ.';
    } else {
      // General article summary (2-4 sentences max, concise)
      const sentences = bestArticle.content
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 20 && !s.startsWith('•'));
      answer = sentences.slice(0, 3).join(' ') || bestArticle.summary;
    }

    return {
      answer,
      emotion,
      sources: bestArticle.sources,
      matchedArticleId: bestArticle.id
    };
  }

  // 4. If query is partially recognizable but lack specifics
  if (normQuery.length < 5 || normQuery === 'gi' || normQuery === 'la gi') {
    return {
      answer: 'Tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi cụ thể hơn về giấy sắc, nghệ nhân Lại Phú Thạch, quy trình 8 bước hay Nhà thờ họ Lại không?',
      emotion: 'confused'
    };
  }

  // 5. Strict rule: If knowledge base has no sufficient information -> EXACT FALLBACK
  return {
    answer: FALLBACK_UNKNOWN_ANSWER,
    emotion: 'shakeHead',
    isFallback: true
  };
}
