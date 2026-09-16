import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Sparkles, Copy, Check, Info } from 'lucide-react';
import { RobotEmotion } from '../utils/ragEngine';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  emotion?: RobotEmotion;
  sources?: string[];
  isFallback?: boolean;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (query: string) => void;
  onTypingStateChange: (isTyping: boolean) => void;
  onSpeakText: (text: string) => void;
  onSelectSuggestion: (question: string) => void;
  onOpenSourceModal: (sourceId: string) => void;
}

const DEFAULT_SUGGESTIONS = [
  'Giấy sắc là gì?',
  'Bác Lại Phú Thạch là ai?',
  'Nghè giấy để làm gì?',
  'Nghề làm giấy sắc ở Nghĩa Đô có gì đặc biệt?',
  'Nhà thờ họ Lại ở đâu?',
  'Quy trình làm giấy sắc gồm những bước nào?'
];

const EXTRA_TAGS = [
  'Phân biệt giấy dó và giấy sắc',
  'Sắc phong là gì?',
  'Vì sao giấy có màu vàng?',
  'Hoa văn rồng mây kim nhũ',
  'Bảo quản sắc phong cổ'
];

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  isThinking,
  onSendMessage,
  onTypingStateChange,
  onSpeakText,
  onSelectSuggestion,
  onOpenSourceModal
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    onTypingStateChange(val.trim().length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInput('');
    onTypingStateChange(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#fcf9f2]/95 backdrop-blur-md rounded-2xl border border-[#e5d8be] shadow-xl shadow-stone-900/5 overflow-hidden">
      {/* Chat header panel banner */}
      <div className="px-5 py-3 bg-gradient-to-r from-[#f7eed9] via-[#fdfbf6] to-[#f4e8cb] border-b border-[#e5d8be] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#633a16]">
            Hộp thoại tương tác di sản
          </span>
        </div>
        <span className="text-[11px] text-[#82613d] bg-amber-100/70 border border-amber-200/80 px-2 py-0.5 rounded-md">
          Chỉ sử dụng tư liệu kiểm chứng
        </span>
      </div>

      {/* Suggestion Pills Horizontal Carousel */}
      <div className="px-4 py-2.5 bg-[#fbf6ea] border-b border-[#ebdcb9] overflow-x-auto flex items-center gap-2 scrollbar-thin">
        <span className="text-[11px] font-medium text-[#7d5329] whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          Gợi ý hỏi:
        </span>
        {DEFAULT_SUGGESTIONS.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(sug)}
            className="px-2.5 py-1 rounded-full text-xs bg-white hover:bg-amber-50 text-[#54361b] hover:text-[#992015] border border-[#d9c7a3] hover:border-amber-400 whitespace-nowrap transition-all shadow-2xs font-medium cursor-pointer"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages List Body */}
      <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[88%] sm:max-w-[80%]">
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-[#992015] p-0.5 shrink-0 shadow-sm mt-0.5">
                  <div className="w-full h-full rounded-full bg-[#2a170b] flex items-center justify-center text-amber-300 font-bold text-xs">
                    AI
                  </div>
                </div>
              )}

              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-[#8d2a19] to-[#6a1a0c] text-white rounded-tr-none'
                    : msg.isFallback
                    ? 'bg-amber-50/90 text-amber-950 border border-amber-300/80 rounded-tl-none font-medium'
                    : 'bg-white text-[#2a1e12] border border-[#e8dcc4] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line font-['Be_Vietnam_Pro',sans-serif]">
                  {msg.text}
                </div>

                {/* Sources Citation Tags */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#f0e4cf] flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-[#7d5329] flex items-center gap-1">
                      <Info className="w-3 h-3 text-amber-700" />
                      Nguồn đối chiếu:
                    </span>
                    {msg.sources.map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => onOpenSourceModal(src)}
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100/80 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
                        title={`Xem chi tiết tài liệu [${src}]`}
                      >
                        [{src}]
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp & Tool Actions */}
                <div className="mt-1.5 flex items-center justify-between gap-4 text-[10px] opacity-75">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'bot' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSpeakText(msg.text)}
                        className="p-1 rounded hover:bg-amber-100/60 text-[#704d27] hover:text-[#992015] transition-colors"
                        title="Nghe câu trả lời bằng giọng nói"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="p-1 rounded hover:bg-amber-100/60 text-[#704d27] hover:text-[#992015] transition-colors"
                        title="Sao chép nội dung"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isThinking && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-[#992015] p-0.5 shrink-0 shadow-sm mt-0.5">
              <div className="w-full h-full rounded-full bg-[#2a170b] flex items-center justify-center text-amber-300 font-bold text-xs">
                AI
              </div>
            </div>

            <div className="rounded-2xl rounded-tl-none bg-white border border-[#e8dcc4] px-4 py-3 shadow-sm flex items-center gap-2 text-stone-500 text-xs">
              <span>Nhân viên số đang đối chiếu dữ liệu</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Extra thematic pills */}
      <div className="px-4 py-1.5 bg-[#faf5e8] border-t border-[#ebdcb9] flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] text-[#8a6339] font-medium">Chủ đề mở rộng:</span>
        {EXTRA_TAGS.map((tag, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectSuggestion(tag)}
            className="text-[11px] px-2 py-0.5 rounded-md bg-[#f3e7cb]/70 hover:bg-[#ebd8b0] text-[#5c3c1f] hover:text-[#992015] transition-colors cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Input Form Box */}
      <div className="p-3 md:p-4 bg-[#fbf7ed] border-t border-[#e2d5bd]">
        <div className="flex items-end gap-2 bg-white rounded-xl border border-[#d9c8a7] p-2 focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 shadow-xs transition-all">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi về nghề giấy sắc, họ Lại, bác Lại Phú Thạch hoặc quy trình... (Enter để gửi)"
            className="flex-1 resize-none bg-transparent border-none outline-none text-sm text-[#2a1c10] placeholder-[#9c8469] leading-relaxed max-h-24"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              input.trim() && !isThinking
                ? 'bg-gradient-to-br from-[#b92b27] to-[#8d1d1a] hover:from-[#cb332f] hover:to-[#9f211d] text-white shadow-md shadow-red-950/20 cursor-pointer active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
            title="Gửi câu hỏi (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-[#8e6e4f] mt-1.5">
          Nhấn <kbd className="px-1 py-0.5 bg-stone-200 rounded text-[9px] text-stone-700">Enter</kbd> để gửi, <kbd className="px-1 py-0.5 bg-stone-200 rounded text-[9px] text-stone-700">Shift + Enter</kbd> để xuống dòng.
        </p>
      </div>
    </div>
  );
};
