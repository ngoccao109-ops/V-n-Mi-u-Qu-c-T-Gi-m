import React, { useState } from 'react';
import {
  X,
  BookOpen,
  FileText,
  Layers,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import {
  VERIFIED_ARTICLES,
  VERIFIED_SOURCES,
  KnowledgeArticle
} from '../data/knowledgeBase';

interface KnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSourceId?: string | null;
  customArticles: KnowledgeArticle[];
  onAddCustomArticle: (article: KnowledgeArticle) => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  onClose,
  selectedSourceId,
  customArticles,
  onAddCustomArticle
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'sources' | 'steps' | 'add'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form state for adding custom documents
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<any>('khai_niem');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSources, setNewSources] = useState('Tư liệu bổ sung địa phương');
  const [addSuccess, setAddSuccess] = useState(false);

  if (!isOpen) return null;

  const allArticles = [...VERIFIED_ARTICLES, ...customArticles];

  const filteredArticles = allArticles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newArticle: KnowledgeArticle = {
      id: `custom_${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim() || newTitle.trim(),
      content: newContent.trim(),
      sources: newSources.split(',').map((s) => s.trim()).filter(Boolean)
    };

    onAddCustomArticle(newArticle);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setActiveTab('articles');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fcf9f2] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-[#d9c59f] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#8e2918] to-[#681c10] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-['Playfair_Display',serif] flex items-center gap-2">
                HỒ SƠ TRI THỨC KIỂM CHỨNG
                <span className="text-[11px] bg-amber-400 text-stone-950 font-sans font-semibold px-2 py-0.5 rounded-full">
                  Tháng 9/2026
                </span>
              </h2>
              <p className="text-xs text-amber-200/80">
                Kho dữ liệu độc quyền định chuẩn cho Nhân viên Di sản số Nghĩa Đô
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#f5ebd2] border-b border-[#dfcfad] flex gap-2 md:gap-4 overflow-x-auto text-xs font-semibold text-[#543b23]">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'articles'
                ? 'border-[#992015] text-[#992015] bg-[#fcf9f2] rounded-t-lg'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Hồ sơ di sản ({allArticles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'steps'
                ? 'border-[#992015] text-[#992015] bg-[#fcf9f2] rounded-t-lg'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quy trình 8 bước</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sources'
                ? 'border-[#992015] text-[#992015] bg-[#fcf9f2] rounded-t-lg'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>13 Nguồn chính thống [S1 - S13]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'add'
                ? 'border-[#992015] text-[#992015] bg-[#fcf9f2] rounded-t-lg'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>Mở rộng dữ liệu (Tải lên)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* TAB 1: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm tư liệu (vd: Lại Phú Thạch, nghè giấy, hoa hòe, 600 năm...)"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#dfcead] rounded-lg text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#dfcead] rounded-lg text-xs text-[#543b23] outline-none"
                >
                  <option value="all">Tất cả danh mục</option>
                  <option value="khai_niem">Khái niệm nền tảng</option>
                  <option value="dong_ho">Dòng họ Lại & Di tích</option>
                  <option value="nghe_nhan">Nghệ nhân Lại Phú Thạch</option>
                  <option value="quy_trinh">Quy trình & Nghè giấy</option>
                  <option value="hoa_van">Hoa văn & Ấn triện</option>
                  <option value="bao_quan">Bảo quản sắc phong</option>
                </select>
              </div>

              {/* Articles Grid */}
              <div className="space-y-3">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white p-4 rounded-xl border border-[#e4d6bf] shadow-2xs hover:border-amber-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-sm font-bold text-[#3d2312] font-['Playfair_Display',serif]">
                        {art.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {art.sources.map((src) => (
                          <span
                            key={src}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300"
                          >
                            [{src}]
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#543b23] leading-relaxed whitespace-pre-line">
                      {art.content}
                    </p>

                    {art.cautions && art.cautions.length > 0 && (
                      <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200/80 text-[11px] text-rose-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Quy tắc chuẩn hóa: </span>
                          {art.cautions.join(' ')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STEPS INFOGRAPHIC */}
          {activeTab === 'steps' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Lưu ý sư phạm:</strong> Các nguồn Nhà nước ghi nhận các công đoạn cốt lõi khá thống nhất; việc chia thành 8 bước là cách sư phạm hóa trực quan cho học sinh và du khách dễ theo dõi.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { step: 1, title: 'Chọn và xử lý dó', desc: 'Vỏ cây dó ngâm/xử lý với nước vôi, nấu hoặc đun cách thủy rồi giã cho xơ nhuyễn để chuẩn bị bột giấy.' },
                  { step: 2, title: 'Seo giấy', desc: 'Bột dó phân tán trong bể, người thợ dùng khuôn/liềm seo gạn thành từng tờ. Giấy khổ lớn xưa đòi hỏi nhiều người phối hợp.' },
                  { step: 3, title: 'Ép, bóc và phơi', desc: 'Tờ giấy sau seo được ép bớt nước, bóc ra và làm khô qua nhiều lượt phơi lặp lại.' },
                  { step: 4, title: 'Vào/phết keo', desc: 'Xử lý bề mặt bằng chất kết dính tự nhiên để tăng độ bền, dai và chống mối mọt. Công thức cụ thể thuộc tri thức gia truyền.' },
                  { step: 5, title: 'Nhuộm/phết màu', desc: 'Tạo màu vàng đặc trưng, trong đó hoa hòe là nguyên liệu truyền thống quan trọng. Quét nhiều lượt và phơi xen kẽ.' },
                  { step: 6, title: 'Nghè giấy (Đặc biệt)', desc: 'Đặt trên phiến đá phẳng, người thợ đứng dùng chày gỗ dài nện đều tay để ép chặt thớ xơ, tạo độ đanh, mịn và bóng láng.' },
                  { step: 7, title: 'Tạo bố cục viền/triện', desc: 'Định hình hệ thống triện gấm, viền và họa tiết quy chuẩn theo phẩm cấp văn bản triều đình.' },
                  { step: 8, title: 'Vẽ và hoàn thiện hoa văn', desc: 'Vẽ hoa văn rồng, mây, chữ Thọ bằng kỹ thuật vẽ chạy (nét) và vẽ đồ (phủ kim nhũ hoặc vàng bạc thật).' },
                ].map((st) => (
                  <div key={st.step} className="bg-white p-3.5 rounded-xl border border-[#e4d6bf] flex items-start gap-3 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4982a] to-[#992015] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {st.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3a1d10] uppercase tracking-wide">
                        {st.title}
                      </h4>
                      <p className="text-xs text-[#543b23] mt-1 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOURCES */}
          {activeTab === 'sources' && (
            <div className="space-y-3">
              <p className="text-xs text-[#6e4e2e]">
                Toàn bộ dữ liệu của chatbot được giới hạn nghiêm ngặt theo 13 nguồn tư liệu của cơ quan Nhà nước, viện lưu trữ, bảo tàng và báo chí chính thống:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {VERIFIED_SOURCES.map((src) => {
                  const isHighlighted = selectedSourceId === src.id;
                  return (
                    <div
                      key={src.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isHighlighted
                          ? 'bg-amber-100 border-amber-500 shadow-md'
                          : 'bg-white border-[#e0cfaf] hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#992015] text-white">
                          [{src.id}]
                        </span>
                        <span className="text-[11px] text-stone-500">{src.date}</span>
                      </div>
                      <p className="text-xs font-medium text-[#2d1b0f] leading-snug">
                        {src.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ADD CUSTOM DATA */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="space-y-3 bg-white p-5 rounded-xl border border-[#e0cfaf]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8b4513]">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Bổ sung dữ liệu vào Kho tri thức Nghĩa Đô (Yêu cầu 16)</span>
              </div>
              <p className="text-xs text-[#6e4e2e]">
                Dữ liệu bạn nạp vào đây sẽ ngay lập tức được hệ thống RAG nạp vào bộ nhớ để Robot trả lời học sinh và khách tham quan.
              </p>

              {addSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã thêm thành công tài liệu mới vào bộ nhớ!
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4a2e18] mb-1">Tiêu đề tài liệu:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Giới thiệu thêm về Đình làng Nghĩa Đô..."
                  className="w-full px-3 py-2 border border-[#dfcfad] rounded-lg text-xs outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4a2e18] mb-1">Danh mục:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#dfcfad] rounded-lg text-xs outline-none"
                  >
                    <option value="khai_niem">Khái niệm di sản</option>
                    <option value="dia_diem">Địa điểm / Di tích</option>
                    <option value="dong_ho">Dòng họ & Truyền thống</option>
                    <option value="nghe_nhan">Nghệ nhân & Con người</option>
                    <option value="quy_trinh">Kỹ thuật & Quy trình</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a2e18] mb-1">Nguồn kiểm chứng:</label>
                  <input
                    type="text"
                    value={newSources}
                    onChange={(e) => setNewSources(e.target.value)}
                    placeholder="Ví dụ: Cổng thông tin quận Cầu Giấy, Biên bản..."
                    className="w-full px-3 py-2 border border-[#dfcfad] rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a2e18] mb-1">Tóm tắt ngắn (1-2 câu):</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Tóm tắt ý chính..."
                  className="w-full px-3 py-2 border border-[#dfcfad] rounded-lg text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4a2e18] mb-1">Nội dung văn bản chi tiết:</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Nhập toàn văn tư liệu cần lưu giữ để Robot tra cứu..."
                  className="w-full px-3 py-2 border border-[#dfcfad] rounded-lg text-xs outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#992015] hover:bg-[#7e190f] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Lưu vào Kho tri thức
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#f5ebd2] border-t border-[#dfcfad] flex items-center justify-between text-xs text-[#5c3e21]">
          <span>Phường Nghĩa Đô, Thành phố Hà Nội</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#dfcfad] rounded-lg hover:bg-stone-50 font-medium cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
