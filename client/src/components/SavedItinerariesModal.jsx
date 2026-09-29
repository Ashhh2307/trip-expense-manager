import React, { useState } from 'react';
import {
  X,
  Compass,
  Calendar,
  Clock,
  Wallet,
  Trash2,
  PlusCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Lightbulb,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { useItinerary } from '../context/ItineraryContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const SavedItinerariesModal = () => {
  const {
    savedItineraries,
    isSavedModalOpen,
    closeSavedModal,
    deleteItinerary,
    convertItineraryToExpenses,
  } = useItinerary();

  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [convertingId, setConvertingId] = useState(null);

  if (!isSavedModalOpen) return null;

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCopy = (itinerary) => {
    const text = `🗺️ Travel Itinerary: ${itinerary.destination} (${itinerary.duration || ''})
💰 Estimated Budget: ${formatCurrency(itinerary.totalBudget || 0)}

📅 Daily Schedule:
${(itinerary.days || [])
  .map(
    (d) =>
      `Day ${d.day}: ${d.title}\n- Morning: ${d.morning || 'Explore'}\n- Afternoon: ${d.afternoon || 'Sightseeing'}\n- Evening: ${d.evening || 'Dinner & rest'}`
  )
  .join('\n\n')}

💡 Tips:
${(itinerary.tips || []).map((t) => `- ${t}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedId(itinerary.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConvert = async (itinerary) => {
    setConvertingId(itinerary.id);
    await convertItineraryToExpenses(itinerary);
    setConvertingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-float max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                My Saved Itineraries &amp; Trips ({savedItineraries.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Permanent list of your AI-generated travel plans, budgets, and schedules
              </p>
            </div>
          </div>

          <button
            onClick={closeSavedModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close saved itineraries modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-4">
          {savedItineraries.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-inner">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No saved itineraries yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                When you ask the AI Assistant for travel plans (e.g. <em>"Rajasthan 5-day trip budget ₹25,000"</em>), click <strong>"Save Itinerary"</strong> to keep it permanently saved in your list!
              </p>
              <button
                onClick={closeSavedModal}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go to AI Assistant</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {savedItineraries.map((itinerary) => {
                const isExpanded = expandedId === itinerary.id;
                const isCopied = copiedId === itinerary.id;
                const isConverting = convertingId === itinerary.id;

                return (
                  <div
                    key={itinerary.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-card transition-all"
                  >
                    {/* Header Card Row */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                              {itinerary.destination}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                              {itinerary.duration || 'Curated Trip'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                            <span>Saved on {formatDate(itinerary.savedAt || new Date())}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              Est. Budget: {formatCurrency(itinerary.totalBudget || 0)}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleConvert(itinerary)}
                          disabled={isConverting}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold transition-all border border-emerald-200 dark:border-emerald-800/60"
                          title="Add budget categories to expense tracking list"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>{isConverting ? 'Adding...' : 'Add to Expenses'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(itinerary)}
                          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-xl transition-colors"
                          title="Copy Itinerary"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteItinerary(itinerary.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-colors"
                          title="Delete from saved list"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpand(itinerary.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Plan'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-4 bg-white dark:bg-slate-900 animate-fade-in">
                        {/* Budget Breakdown */}
                        {itinerary.budgetBreakdown && itinerary.budgetBreakdown.length > 0 && (
                          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              <Wallet className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                              <span>Budget Allocation</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {itinerary.budgetBreakdown.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 rounded-xl"
                                >
                                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                                    {item.category}
                                  </span>
                                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block mt-0.5">
                                    {formatCurrency(item.amount)}
                                  </span>
                                  {item.percentage && (
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                      {item.percentage}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Day-by-Day Schedule */}
                        {itinerary.days && itinerary.days.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              <span>Day-by-Day Itinerary</span>
                            </h4>
                            <div className="space-y-2">
                              {itinerary.days.map((d) => (
                                <div
                                  key={d.day}
                                  className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl space-y-1 text-xs"
                                >
                                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-4 h-4 rounded-full bg-slate-900 dark:bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                                        {d.day}
                                      </span>
                                      {d.title}
                                    </span>
                                    {d.estimatedCost && (
                                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                                        ~{formatCurrency(d.estimatedCost)}
                                      </span>
                                    )}
                                  </div>
                                  {d.morning && <p className="text-slate-600 dark:text-slate-300 pl-5"><strong>🌅 Morning:</strong> {d.morning}</p>}
                                  {d.afternoon && <p className="text-slate-600 dark:text-slate-300 pl-5"><strong>☀️ Afternoon:</strong> {d.afternoon}</p>}
                                  {d.evening && <p className="text-slate-600 dark:text-slate-300 pl-5"><strong>🌙 Evening:</strong> {d.evening}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Travel Tips */}
                        {itinerary.tips && itinerary.tips.length > 0 && (
                          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 rounded-xl text-xs space-y-1">
                            <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-300">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                              <span>Travel Tips</span>
                            </div>
                            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-amber-900/90 dark:text-amber-200/90">
                              {itinerary.tips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Saved itineraries are kept safely in your account.</span>
          <button
            onClick={closeSavedModal}
            className="px-4 py-1.5 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedItinerariesModal;
