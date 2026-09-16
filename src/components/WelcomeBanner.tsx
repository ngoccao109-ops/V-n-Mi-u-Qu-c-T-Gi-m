import React from 'react';
import { Sparkles, MessageSquare, BookOpen, Compass, ChevronRight } from 'lucide-react';

interface WelcomeBannerProps {
  onStartChat: () => void;
  onOpenKnowledge: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onStartChat,
  onOpenKnowledge
}) => {
  return (
    <div className="absolute inset-0 z-40 bg-[#2d1b10]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-gradient-to-b from-[#faf6ee] to-[#f4e9d3] rounded-3xl border-2 border-[#d9c49a] shadow-2xl p-6 md:p-8 text-center overflow-hidden">
        {/* Decorative corner scrolls */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-400/20 to-transparent pointer-events-none" />

        {/* Traditional Parchment Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#992015]/10 border border-[#992015]/25 text-[#992015] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Không gian di sản số Nghĩa Đô • Hà Nội
        </div>

        {/* Big Cultural Heading */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a1d0f] font-['Playfair_Display',serif] tracking-tight mb-2">
          Nhân viên Di sản số <span className="text-[#992015]">Nghĩa Đô</span>
        </h2>

        <p className="text-sm md:text-base text-[#68492c] italic max-w-lg mx-auto font-['Be_Vietnam_Pro',sans-serif] mb-6">
          “Chạm để hỏi – Khám phá để hiểu – Gìn giữ để mai sau.”
        </p>

        {/* Quick Highlights Feature Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <div className="bg-white/80 p-3.5 rounded-xl border border-[#e4d6be] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center mb-2 text-amber-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#3d2412]">Di sản giấy sắc</h4>
            <p className="text-[11px] text-[#6e4e2e] mt-0.5">Khám phá quy trình 8 bước và bí quyết gia truyền dòng họ Lại.</p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-[#e4d6be] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center mb-2 text-rose-800">
              <Compass className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#3d2412]">Nhà thờ tổ nghề</h4>
            <p className="text-[11px] text-[#6e4e2e] mt-0.5">Di tích quốc gia xếp hạng năm 2006 tại làng Nghè (Võ Chí Công).</p>
          </div>

          <div className="bg-white/80 p-3.5 rounded-xl border border-[#e4d6be] shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center mb-2 text-emerald-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-[#3d2412]">Robot 3D tương tác</h4>
            <p className="text-[11px] text-[#6e4e2e] mt-0.5">Biểu cảm sinh động, trả lời chuẩn xác theo 13 nguồn kiểm chứng.</p>
          </div>
        </div>

        {/* Prominent Action Button: NHẤN ĐỂ TRÒ CHUYỆN */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onStartChat}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#b92b27] via-[#992015] to-[#7f180e] hover:from-[#cb332f] hover:to-[#911d13] text-white text-base md:text-lg font-bold shadow-xl shadow-red-950/25 border-2 border-amber-300/60 hover:scale-103 transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <MessageSquare className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>NHẤN ĐỂ TRÒ CHUYỆN</span>
            <ChevronRight className="w-5 h-5 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onOpenKnowledge}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-[#ebdcb9] hover:bg-[#dfcd9e] text-[#4a2e18] text-xs md:text-sm font-semibold border border-[#c4ae80] transition-all cursor-pointer"
          >
            Tra cứu Kho tư liệu
          </button>
        </div>
      </div>
    </div>
  );
};
