import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { HeritageBackground } from './components/HeritageBackground';
import { Robot3D } from './components/Robot3D';
import { ChatBox, ChatMessage } from './components/ChatBox';
import { KnowledgeModal } from './components/KnowledgeModal';
import { WelcomeBanner } from './components/WelcomeBanner';
import { RobotEmotion, searchKnowledgeBase } from './utils/ragEngine';
import { speakVietnamese } from './utils/speech';
import { KnowledgeArticle } from './data/knowledgeBase';

const INITIAL_BOT_GREETING =
  'Xin chào! Tôi là Nhân viên Di sản số Nghĩa Đô. Tôi có thể cùng bạn khám phá nghề làm giấy sắc, Nhà thờ họ Lại và câu chuyện về người giữ nghề Lại Phú Thạch. Bạn muốn bắt đầu từ đâu?';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [robotEmotion, setRobotEmotion] = useState<RobotEmotion>('greeting');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState<boolean>(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [customArticles, setCustomArticles] = useState<KnowledgeArticle[]>([]);

  const emotionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize App on First Turn
  useEffect(() => {
    // Load custom knowledge from localStorage if available
    try {
      const saved = localStorage.getItem('nghia_do_custom_articles');
      if (saved) {
        setCustomArticles(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load custom knowledge:', e);
    }

    // Set initial greeting
    const initialMsg: ChatMessage = {
      id: 'init_msg',
      sender: 'bot',
      text: INITIAL_BOT_GREETING,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'greeting'
    };
    setMessages([initialMsg]);

    // Robot greeting gesture for 4 seconds then return to idle
    setRobotEmotion('greeting');
    emotionTimerRef.current = setTimeout(() => {
      setRobotEmotion('idle');
    }, 4500);

    return () => {
      if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
    };
  }, []);

  const handleSetEmotionWithTimeout = (emotion: RobotEmotion, durationMs = 6000) => {
    if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
    setRobotEmotion(emotion);

    if (emotion !== 'idle') {
      emotionTimerRef.current = setTimeout(() => {
        setRobotEmotion('idle');
      }, durationMs);
    }
  };

  const handleSendMessage = async (queryText: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setIsListening(false);
    setRobotEmotion('thinking');

    try {
      // Call server backend
      let botAnswer = '';
      let botEmotion: RobotEmotion = 'explaining';
      let sources: string[] | undefined = undefined;
      let isFallback = false;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: queryText,
            customKnowledge: customArticles
          })
        });

        if (response.ok) {
          const data = await response.json();
          botAnswer = data.answer;
          botEmotion = data.emotion || 'explaining';
          sources = data.sources;
          isFallback = !!data.isFallback;
        } else {
          throw new Error('API server returned error');
        }
      } catch (err) {
        // Safe fallback to client deterministic RAG
        const local = searchKnowledgeBase(queryText, customArticles);
        botAnswer = local.answer;
        botEmotion = local.emotion;
        sources = local.sources;
        isFallback = !!local.isFallback;
      }

      // Append bot answer
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotion: botEmotion,
        sources,
        isFallback
      };

      setMessages((prev) => [...prev, botMsg]);
      handleSetEmotionWithTimeout(botEmotion, 7000);

      // Trigger Confetti if Happy
      if (botEmotion === 'happy' || botEmotion === 'laughing') {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#d4982a', '#e5b84c', '#b92b27', '#ffffff']
        });
      }

      // Voice read-out if enabled
      if (isVoiceEnabled) {
        speakVietnamese(botAnswer);
      }
    } catch (e) {
      console.error('Failed to process message:', e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    const initialMsg: ChatMessage = {
      id: `init_${Date.now()}`,
      sender: 'bot',
      text: INITIAL_BOT_GREETING,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotion: 'greeting'
    };
    setMessages([initialMsg]);
    handleSetEmotionWithTimeout('greeting', 4000);
  };

  const handleAddCustomArticle = (article: KnowledgeArticle) => {
    const updated = [article, ...customArticles];
    setCustomArticles(updated);
    try {
      localStorage.setItem('nghia_do_custom_articles', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist custom articles:', e);
    }
  };

  const handleSpeakText = (text: string) => {
    speakVietnamese(text);
  };

  const handleOpenSourceModal = (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setIsKnowledgeModalOpen(true);
  };

  const handleRobotClick = () => {
    // Cycles friendly responses when user taps the robot
    const friendlyTaps: RobotEmotion[] = ['greeting', 'happy', 'explaining', 'thinking'];
    const nextEmotion = friendlyTaps[Math.floor(Math.random() * friendlyTaps.length)];
    handleSetEmotionWithTimeout(nextEmotion, 4000);
  };

  return (
    <div className="relative min-h-screen flex flex-col font-['Be_Vietnam_Pro',sans-serif] text-[#2d1e12]">
      {/* Visual Heritage Backdrop */}
      <HeritageBackground />

      {/* Main Top Header */}
      <Header
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        onResetChat={handleResetChat}
        onOpenKnowledge={() => {
          setSelectedSourceId(null);
          setIsKnowledgeModalOpen(true);
        }}
        onOpenIntroBanner={() => setShowWelcome(true)}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col gap-4">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* Left Pane: 3D Robot Character (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-b from-[#fbf7ed]/80 via-[#f8f0dc]/70 to-[#eddcb8]/80 backdrop-blur-md rounded-3xl border border-[#dfcfad] p-4 shadow-lg shadow-black/5 relative overflow-hidden">
            {/* Corner traditional stamp emblem */}
            <div className="absolute top-3 left-3 text-[11px] font-semibold text-[#8b4513] uppercase tracking-wider bg-amber-200/50 border border-amber-300/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8b2318]" />
              Hướng dẫn viên 3D • Họ Lại Nghĩa Đô
            </div>

            {/* 3D Robot Canvas */}
            <div className="flex-1 flex items-center justify-center relative min-h-[420px] sm:min-h-[460px] lg:min-h-[540px]">
              <Robot3D
                emotion={robotEmotion}
                isThinking={isThinking}
                isListening={isListening}
                onRobotClick={handleRobotClick}
              />
            </div>
          </div>

          {/* Right Pane: Chat Interface (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col h-[580px] lg:h-auto min-h-[520px]">
            <ChatBox
              messages={messages}
              isThinking={isThinking}
              onSendMessage={handleSendMessage}
              onTypingStateChange={(typing) => {
                setIsListening(typing);
                if (typing && robotEmotion === 'idle') {
                  setRobotEmotion('listening');
                } else if (!typing && robotEmotion === 'listening') {
                  setRobotEmotion('idle');
                }
              }}
              onSpeakText={handleSpeakText}
              onSelectSuggestion={(sug) => handleSendMessage(sug)}
              onOpenSourceModal={handleOpenSourceModal}
            />
          </div>
        </div>
      </main>

      {/* Footer Info Strip */}
      <footer className="w-full bg-[#f6edd7]/80 backdrop-blur-xs border-t border-[#dfcfad] py-2.5 px-4 text-center text-[11px] text-[#785938]">
        <span>Không gian Di sản số Nghĩa Đô • Nhà thờ tổ nghề làm giấy sắc - Họ Lại (Di tích Quốc gia năm 2006)</span>
      </footer>

      {/* Welcome Banner Modal (Matching user uploaded cover image layout) */}
      {showWelcome && (
        <WelcomeBanner
          onStartChat={() => {
            setShowWelcome(false);
            handleSetEmotionWithTimeout('greeting', 3500);
          }}
          onOpenKnowledge={() => {
            setShowWelcome(false);
            setSelectedSourceId(null);
            setIsKnowledgeModalOpen(true);
          }}
        />
      )}

      {/* Knowledge Base Modal */}
      <KnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => {
          setIsKnowledgeModalOpen(false);
          setSelectedSourceId(null);
        }}
        selectedSourceId={selectedSourceId}
        customArticles={customArticles}
        onAddCustomArticle={handleAddCustomArticle}
      />
    </div>
  );
}
