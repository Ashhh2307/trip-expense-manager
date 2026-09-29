import React, { useState } from 'react';
import {
  Sparkles,
  User,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  PlusCircle,
  Check,
  Compass,
  MapPin,
  Clock,
  Wallet,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Bookmark,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Share2,
  MoreHorizontal,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';
import CategoryBadge from './CategoryBadge';
import { useItinerary } from '../context/ItineraryContext';

/**
 * Formats Markdown text into clean typography (ChatGPT / Gemini style)
 */
const FormattedMarkdown = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className="space-y-3 text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Level 2 Heading (Bold & Prominent)
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-4 mb-1">
              {trimmed.replace('## ', '')}
            </h2>
          );
        }

        // Level 3 Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">
              {trimmed.replace('### ', '')}
            </h3>
          );
        }

        // Level 4 Heading
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-200 mt-2 mb-0.5">
              {trimmed.replace('#### ', '')}
            </h4>
          );
        }

        // Bullet Point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 my-1">
              <span className="text-slate-400 dark:text-slate-500 font-bold leading-none mt-1.5">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
            </div>
          );
        }

        // Skip raw markdown table rows if structured cards handle it
        if (trimmed.startsWith('|')) {
          return null;
        }

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p
            key={idx}
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
          />
        );
      })}
    </div>
  );
};

const formatInlineMarkdown = (str) => {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-800 dark:text-slate-200 font-mono">$1</code>');
};

const ChatMessage = ({ message, onConfirmExpense }) => {
  const {
    saveItinerary,
    isItinerarySaved,
    convertItineraryToExpenses,
    openSavedModal,
  } = useItinerary();

  const isAI = message.sender === 'ai';
  const parsedData = message.parsedData;
  const isSaved = message.isSaved;

  const isItinerary = parsedData && (parsedData.type === 'itinerary' || parsedData.destination);
  const isExpense = parsedData && (parsedData.type === 'expense' || (!isItinerary && parsedData.amount > 0));
  const isItinSaved = isItinerary ? isItinerarySaved(parsedData.destination || parsedData.id) : false;

  const [expandedDays, setExpandedDays] = useState({ 1: true, 2: true });
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'

  const toggleDay = (dayNum) => {
    setExpandedDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleCopy = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAI) {
    // User Message: Clean pill bubble aligned to the right
    return (
      <div className="flex justify-end animate-fade-in my-2">
        <div className="max-w-[85%] sm:max-w-[75%] bg-slate-200/90 dark:bg-[#2f2f2f] text-slate-900 dark:text-slate-100 rounded-3xl px-5 py-3 text-sm sm:text-base leading-relaxed whitespace-pre-wrap shadow-2xs font-normal">
          {message.text}
        </div>
      </div>
    );
  }

  // AI Message: Pure unboxed flowing text (ChatGPT / Gemini style)
  return (
    <div className="w-full animate-fade-in my-4 space-y-3">
      {/* AI Text Body (No card box / no border) */}
      <div className="text-slate-800 dark:text-slate-100 leading-relaxed font-normal">
        <FormattedMarkdown text={message.text} />
      </div>

      {/* Structured Itinerary Card (Clean & Modern) */}
      {isItinerary && (
        <div className="mt-4 pt-2 space-y-4">
          {/* Header Highlights Banner */}
          <div className="p-4 bg-slate-900 dark:bg-[#1a1b1d] text-white rounded-2xl border border-slate-700/60 dark:border-[#2e3034] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Curated Travel Itinerary</span>
              </div>
              <h4 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                {parsedData.destination || 'Custom Tour'}
              </h4>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {parsedData.duration || '5 Days'}
                </span>
              </p>
            </div>

            <div className="sm:text-right bg-white/10 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-white/10 sm:border-0">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                Est. Total Budget
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                {formatCurrency(parsedData.totalBudget || 25000)}
              </span>
            </div>
          </div>

          {/* Budget Breakdown Grid */}
          {parsedData.budgetBreakdown && parsedData.budgetBreakdown.length > 0 && (
            <div className="bg-slate-100/70 dark:bg-[#1e1f20] border border-slate-200 dark:border-[#333538] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Wallet className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Estimated Budget Allocation (INR - ₹)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {parsedData.budgetBreakdown.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 bg-white dark:bg-[#151617] border border-slate-200/80 dark:border-[#2b2d30] rounded-xl shadow-2xs"
                  >
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block truncate">
                      {item.category}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                      {formatCurrency(item.amount)}
                    </span>
                    {item.percentage && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {item.percentage} of budget
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-by-Day Interactive Schedule */}
          {parsedData.days && parsedData.days.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Day-by-Day Schedule</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                  Click day to expand
                </span>
              </div>

              <div className="space-y-2">
                {parsedData.days.map((d) => {
                  const isExpanded = !!expandedDays[d.day];
                  return (
                    <div
                      key={d.day}
                      className="bg-slate-50 dark:bg-[#1e1f20] border border-slate-200 dark:border-[#333538] rounded-xl overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDay(d.day)}
                        className="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 text-left bg-slate-100/50 dark:bg-[#242628] hover:bg-slate-100 dark:hover:bg-[#2a2c2f] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {d.day}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {d.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {d.estimatedCost && (
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                              ~{formatCurrency(d.estimatedCost)}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-3 text-xs text-slate-600 dark:text-slate-300 space-y-2 border-t border-slate-200/60 dark:border-[#2e3033]">
                          {d.morning && (
                            <p>
                              <strong className="text-slate-800 dark:text-slate-200">🌅 Morning:</strong> {d.morning}
                            </p>
                          )}
                          {d.afternoon && (
                            <p>
                              <strong className="text-slate-800 dark:text-slate-200">☀️ Afternoon:</strong> {d.afternoon}
                            </p>
                          )}
                          {d.evening && (
                            <p>
                              <strong className="text-slate-800 dark:text-slate-200">🌙 Evening:</strong> {d.evening}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Travel Tips */}
          {parsedData.tips && parsedData.tips.length > 0 && (
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 rounded-xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Helpful Travel Tips</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-amber-900/90 dark:text-amber-200/90">
                {parsedData.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Save Itinerary & Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              {isItinSaved ? (
                <button
                  type="button"
                  onClick={() => openSavedModal()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl text-xs border border-emerald-300 dark:border-emerald-700/80 transition-all hover:shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Saved in My Trips</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => saveItinerary(parsedData)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Itinerary</span>
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  await convertItineraryToExpenses(parsedData);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#1e1f20] hover:bg-slate-200 dark:hover:bg-[#282a2d] text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#383a3c] transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Add Budget to Expenses</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => openSavedModal()}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors underline underline-offset-2"
            >
              View Saved Itineraries →
            </button>
          </div>
        </div>
      )}

      {/* Structured Expense Card (If user logs expense) */}
      {isExpense && parsedData.isComplete && (
        <div className="mt-3 p-3.5 bg-slate-50 dark:bg-[#1e1f20] border border-slate-200 dark:border-[#383a3c] rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/70 dark:border-[#2f3135]">
            <div className="flex items-center gap-1.5">
              <CategoryBadge category={parsedData.category} size="sm" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {parsedData.title}
              </span>
            </div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(parsedData.amount)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                Merchant: <strong className="text-slate-800 dark:text-slate-200">{parsedData.merchant}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Date: <strong className="text-slate-800 dark:text-slate-200">{formatDate(parsedData.date)}</strong>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/70 dark:border-[#2f3135] flex items-center justify-between">
            {isSaved ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expense Added Successfully</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onConfirmExpense && onConfirmExpense(message.id, parsedData)}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Confirm &amp; Add Expense</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Minimal Action Row below AI Response (Image 2 style) */}
      <div className="flex items-center gap-2 pt-1 text-slate-400 dark:text-slate-500">
        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          title="Copy response"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* Thumbs Up */}
        <button
          type="button"
          onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
          className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
            feedback === 'like' ? 'text-emerald-500' : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          title="Good response"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>

        {/* Thumbs Down */}
        <button
          type="button"
          onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
          className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${
            feedback === 'dislike' ? 'text-rose-500' : 'hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          title="Bad response"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>

        {/* Share / Save */}
        {isItinerary && (
          <button
            type="button"
            onClick={() => saveItinerary(parsedData)}
            className="p-1.5 rounded-lg hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Save to itineraries"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        )}

        <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
