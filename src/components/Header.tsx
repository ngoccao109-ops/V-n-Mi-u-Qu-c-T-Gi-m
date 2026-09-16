import React from 'react';
import { Volume2, VolumeX, RotateCcw, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onResetChat: () => void;
  onOpenKnowledge: () => void;
  onOpenIntroBanner?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isVoiceEnabled,
  onToggleVoice,
  onResetChat,
  onOpenKnowledge,
  onOpenIntroBanner
}) => {
  return (
    <header className="w-full bg-[#fbf7ed]/90 backdrop-blur-md border-b border-[#e2d5bd] px-4 py-3 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Cultural Title */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onOpenIntroBanner}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4982a] to-[#992015] p-0.5 shadow-md flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            title="Xem bảng giới thiệu di sản"
          >
            <div className="w-full h-full bg-[#3a1d12] rounded-[10px] flex items-center justify-center text-[#fcd34d]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#361f10] font-['Playfair_Display',serif]">
                NHÂN VIÊN DI SẢN SỐ NGHĨA ĐÔ
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-[#8b2318]/10 text-[#8b2318] px-2 py-0.5 rounded-full border border-[#8b2318]/20">
                <ShieldCheck className="w-3 h-3 text-[#8b2318]" />
                Tri thức kiểm chứng
              </span>
            </div>
            <p className="text-xs text-[#705335] italic font-['Be_Vietnam_Pro',sans-serif]">
              “Chạm để hỏi – Khám phá để hiểu – Gìn giữ để mai sau.”
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Audio read-aloud toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
              isVoiceEnabled
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200/80'
            }`}
            title={isVoiceEnabled ? 'Tắt đọc giọng nói' : 'Bật đọc câu trả lời bằng giọng nói'}
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span className="hidden md:inline">Giọng đọc: BẬT</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-500" />
                <span className="hidden md:inline">Giọng đọc: TẮT</span>
              </>
            )}
          </button>

          {/* Knowledge base inspector button */}
          <button
            type="button"
            onClick={onOpenKnowledge}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 bg-[#f5ebd2] hover:bg-[#ebdcb9] text-[#4a2e18] border border-[#d6c39e] transition-all shadow-xs"
            title="Xem hồ sơ tri thức kiểm chứng và 13 nguồn tư liệu"
          >
            <BookOpen className="w-4 h-4 text-[#8b4513]" />
            <span>Kho tri thức</span>
          </button>

          {/* Reset session button */}
          <button
            type="button"
            onClick={onResetChat}
            className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 hover:border-rose-200 transition-all shadow-xs"
            title="Làm mới cuộc trò chuyện"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bắt đầu lại</span>
          </button>
        </div>
      </div>
    </header>
  );
};
