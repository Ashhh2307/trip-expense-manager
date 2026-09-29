import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  Lightbulb,
  Compass,
  Loader2,
  Plus,
  Mic,
  MicOff,
  ChevronDown,
  MapPin,
  Wallet,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { parseExpenseMessage } from '../services/aiService';
import { useExpenses } from '../context/ExpenseContext';
import ChatMessage from '../components/ChatMessage';

const SUGGESTIONS = [
  'Rajasthan 5-day itinerary under ₹25,000',
  'Goa 4-day beach trip budget ₹18,000',
  'Kerala 5-day backwaters plan',
  'Manali 3-day mountain trip ₹15,000',
  'Tokyo 7-day cultural itinerary',
  'Ladakh 6-day road trip plan',
];

const DEFAULT_WELCOME_MSG = {
  id: 'welcome-msg',
  sender: 'ai',
  text: 'Hello! 👋 I am your **AI Travel & Itinerary Assistant**.\n\nI can:\n- 🗺️ **Generate comprehensive trip itineraries** with custom day-by-day plans, transport, stays, and budget allocations (e.g. *"Give me a proper Rajasthan itinerary under ₹25,000"*).\n- 💾 **Save your favorite itineraries** for easy offline reference anytime.',
  timestamp: new Date().toISOString(),
};

const AIChat = () => {
  const { addExpense, fetchExpenses, fetchStats } = useExpenses();

  // Fresh session state - resets whenever user leaves and returns
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MSG]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const plusMenuRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Track chat scroll to show "Scroll to bottom" button
  const handleChatScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isFarFromBottom);
  };

  // Close plus menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setIsPlusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Voice speech-to-text dictation
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your query directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setInputVal(transcript);
      };

      recognition.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessageId = `user-${Date.now()}`;
    const newMessages = [
      ...messages,
      {
        id: userMessageId,
        sender: 'user',
        text,
        timestamp: new Date().toISOString(),
      },
    ];

    setMessages(newMessages);
    setInputVal('');
    setLoading(true);
    setIsPlusMenuOpen(false);

    try {
      const res = await parseExpenseMessage({ message: text, autoCreate: false });

      if (res.success && res.data) {
        const parsed = res.data;
        const aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text:
            parsed.replyMessage ||
            (parsed.type === 'itinerary'
              ? `Here is your curated travel plan for ${parsed.destination}:`
              : `I've extracted the details for your ${parsed.category || 'expense'}.`),
          parsedData: parsed,
          isSaved: false,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiReply]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text:
              "Sorry, I had trouble generating that plan. Please try asking again or specify destination, duration, and budget.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  const handleConfirmExpense = async (messageId, parsedData) => {
    try {
      const payload = new FormData();
      payload.append('title', parsedData.title);
      payload.append('amount', parsedData.amount);
      payload.append('category', parsedData.category);
      payload.append('merchant', parsedData.merchant);
      payload.append(
        'date',
        parsedData.date
          ? new Date(parsedData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      payload.append('trip', parsedData.trip || 'General');
      payload.append('status', 'Pending');
      payload.append('notes', parsedData.notes || 'Logged via AI Chat');

      const res = await addExpense(payload);
      if (res.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isSaved: true } : msg
          )
        );
        fetchExpenses();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to confirm expense from chat:', error);
    }
  };

  const handleResetChat = () => {
    setMessages([DEFAULT_WELCOME_MSG]);
    setInputVal('');
    setIsPlusMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto animate-fade-in relative pt-3 sm:pt-4">
      {/* Messages Scrollable Stream (Seamless & Unboxed - ChatGPT / Image 2 style) */}
      <div
        ref={chatContainerRef}
        onScroll={handleChatScroll}
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-2 space-y-4 max-w-3xl w-full mx-auto min-h-0 no-scrollbar"
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onConfirmExpense={handleConfirmExpense}
          />
        ))}

        {loading && (
          <div className="flex items-center gap-3 animate-fade-in py-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-[#1e1f20] border border-slate-700/60 dark:border-[#333538] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-slate-700 dark:text-slate-300" />
              <span>Thinking and planning your trip...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Bottom Sticky Area */}
      <div className="sticky bottom-0 z-20 pb-4 pt-2 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 dark:via-slate-950/90 to-transparent max-w-3xl w-full mx-auto px-2">
        {/* Centered Scroll to Bottom Button (Exact replica of Image 2) */}
        {showScrollBottom && (
          <div className="flex justify-center mb-2">
            <button
              type="button"
              onClick={() => scrollToBottom()}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#212121] border border-slate-300 dark:border-[#383838] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-md active:scale-95 transition-all animate-fade-in"
              title="Scroll to bottom"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Suggestion Chips */}
        {messages.length <= 3 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 mb-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Try:
            </span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSendMessage(suggestion)}
                disabled={loading}
                className="text-xs text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-[#212121] hover:bg-slate-300/80 dark:hover:bg-[#2c2d30] hover:text-slate-900 dark:hover:text-white px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium shrink-0 disabled:opacity-50 border border-slate-300/60 dark:border-[#383a3c]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Gemini/ChatGPT Pill Input Bar (Image 2 Reference) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          {/* Plus Action Popup Menu */}
          {isPlusMenuOpen && (
            <div
              ref={plusMenuRef}
              className="absolute bottom-16 left-0 w-64 bg-white dark:bg-[#1e1f20] border border-slate-200 dark:border-[#383a3c] rounded-2xl shadow-float p-2 space-y-1 animate-fade-in z-40"
            >
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Quick Prompts
              </div>
              <button
                type="button"
                onClick={() => {
                  setInputVal('5-day customized travel itinerary for ');
                  setIsPlusMenuOpen(false);
                  inputRef.current?.focus();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>Custom Trip Itinerary</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputVal('Estimate the total travel budget for a trip to ');
                  setIsPlusMenuOpen(false);
                  inputRef.current?.focus();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left"
              >
                <Wallet className="w-3.5 h-3.5 text-blue-500" />
                <span>Budget Breakdown Estimator</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputVal('Weekend 2-day quick getaway itinerary from Mumbai');
                  setIsPlusMenuOpen(false);
                  inputRef.current?.focus();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>Weekend Getaway</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-rose-500" />
                  <span>Reset Conversation</span>
                </button>
              </div>
            </div>
          )}

          {/* Pill Container */}
          <div
            className={`w-full flex items-center gap-2 bg-slate-200/90 dark:bg-[#1e1f20] border ${
              isListening
                ? 'border-rose-500 ring-2 ring-rose-500/20'
                : 'border-slate-300 dark:border-[#383a3c] focus-within:border-slate-400 dark:focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-blue-500/20'
            } rounded-full px-2.5 py-1.5 sm:py-2 transition-all shadow-md`}
          >
            {/* Plus Button */}
            <button
              type="button"
              onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/80 dark:hover:bg-white/10 transition-all shrink-0"
              title="Explore prompt options"
              aria-label="Add prompt options"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening... speak your travel request...'
                  : 'Ask anything'
              }
              disabled={loading}
              className="flex-1 bg-transparent border-0 outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm sm:text-base px-1 min-w-0"
            />

            {/* Right Inside Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* Voice Microphone Dictation Button */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/50'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/80 dark:hover:bg-white/10'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input (Dictate prompt)'}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Blue Audio/Send Button (Signature Gemini/ChatGPT Blue Circle from Image 2) */}
              <button
                type="submit"
                disabled={loading || (!inputVal.trim() && !isListening)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  inputVal.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 active:scale-95 text-white shadow-md cursor-pointer'
                    : 'bg-blue-600/90 text-white cursor-pointer hover:bg-blue-500 active:scale-95'
                }`}
                aria-label="Send or live voice"
                title={inputVal.trim() ? 'Send prompt' : 'Live Travel Assistant'}
              >
                {inputVal.trim() ? (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  /* 4-Bar Audio Waveform Icon as shown in Image 2 */
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <rect x="3.5" y="9" width="2" height="6" rx="1" />
                    <rect x="8.5" y="5" width="2" height="14" rx="1" />
                    <rect x="13.5" y="8" width="2" height="8" rx="1" />
                    <rect x="18.5" y="10.5" width="2" height="3" rx="1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
