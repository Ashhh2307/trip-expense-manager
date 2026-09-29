import React, { useState } from 'react';
import {
  X,
  Plane,
  Building2,
  Utensils,
  Car,
  Tag,
  Search,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Wifi,
  Coffee,
  Ticket,
  Train,
  FileSpreadsheet,
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../utils/formatters';

const TEMPLATES = [
  // ✈️ Flights & Air Travel
  {
    id: 'flight-intl',
    title: 'International Flight Ticket',
    category: 'Flight',
    amount: 42500,
    merchant: 'Air India / Emirates',
    trip: 'Europe Business Summit',
    notes: 'Round-trip economy ticket with 25kg checked baggage and seat selection.',
    icon: Plane,
    badge: 'Popular',
    color: 'emerald',
  },
  {
    id: 'flight-domestic',
    title: 'Domestic Corporate Flight',
    category: 'Flight',
    amount: 7800,
    merchant: 'IndiGo Airlines',
    trip: 'Bengaluru Client Meet',
    notes: 'Same-day return corporate flight with flexi-fare.',
    icon: Plane,
    badge: 'Frequent',
    color: 'emerald',
  },
  {
    id: 'flight-lounge',
    title: 'Airport Lounge & Priority Pass',
    category: 'Flight',
    amount: 1950,
    merchant: 'Encalm Lounge T3',
    trip: 'Delhi Transit',
    notes: 'Pre-flight lounge buffet and high-speed Wi-Fi access.',
    icon: Coffee,
    color: 'emerald',
  },

  // 🏨 Lodging & Stays
  {
    id: 'hotel-luxury',
    title: 'Luxury Hotel Stay (3 Nights)',
    category: 'Lodging',
    amount: 24000,
    merchant: 'Taj Hotels / Marriott',
    trip: 'Annual Leadership Offsite',
    notes: 'Deluxe room including buffet breakfast, city tax, and high-speed internet.',
    icon: Building2,
    badge: 'Recommended',
    color: 'indigo',
  },
  {
    id: 'hotel-business',
    title: 'Business Hotel (2 Nights)',
    category: 'Lodging',
    amount: 9600,
    merchant: 'Lemon Tree Premier',
    trip: 'Hyderabad Tech Visit',
    notes: 'Executive single occupancy room for client on-site engagement.',
    icon: Building2,
    color: 'indigo',
  },
  {
    id: 'hotel-airbnb',
    title: 'Team Homestay / Airbnb Villa',
    category: 'Lodging',
    amount: 16500,
    merchant: 'Airbnb Stays',
    trip: 'Goa Strategy Sprint',
    notes: 'Full private villa for 4 teammates with workstation setup.',
    icon: Building2,
    color: 'indigo',
  },

  // 🍽️ Meals & Dining
  {
    id: 'meals-client-dinner',
    title: 'Executive Client Dinner',
    category: 'Meals',
    amount: 4500,
    merchant: 'Mainland China / Smoke House Deli',
    trip: 'Mumbai Client Pitch',
    notes: 'Hosted 3 stakeholders for project closure celebration and dinner.',
    icon: Utensils,
    badge: 'Client',
    color: 'amber',
  },
  {
    id: 'meals-team-lunch',
    title: 'Team Strategy Lunch',
    category: 'Meals',
    amount: 2800,
    merchant: 'Social / Barbeque Nation',
    trip: 'Quarterly Kickoff',
    notes: 'Project kickoff meal with 4 team members.',
    icon: Utensils,
    color: 'amber',
  },
  {
    id: 'meals-daily-perdiem',
    title: 'Daily Travel Meal & Per Diem',
    category: 'Meals',
    amount: 1200,
    merchant: 'Starbucks & Local Dining',
    trip: 'General Travel',
    notes: 'Daily breakfast, coffee meetings, and lunch allowance.',
    icon: Coffee,
    badge: 'Daily',
    color: 'amber',
  },

  // 🚗 Transit & Commute
  {
    id: 'transit-airport-cab',
    title: 'Airport Cab Transfer (Uber/Ola)',
    category: 'Transit',
    amount: 1150,
    merchant: 'Uber Premier',
    trip: 'Airport Transit',
    notes: 'Direct one-way airport transfer during peak business hours.',
    icon: Car,
    badge: 'Popular',
    color: 'blue',
  },
  {
    id: 'transit-car-rental',
    title: 'Car Rental & Fuel Allowance',
    category: 'Transit',
    amount: 6200,
    merchant: 'Zoomcar / Avis',
    trip: 'Pune Industrial Visit',
    notes: '2-day self-drive sedan rental with fuel fill-up and highway toll pass.',
    icon: Car,
    color: 'blue',
  },
  {
    id: 'transit-express-train',
    title: 'Vande Bharat Express Train Pass',
    category: 'Transit',
    amount: 1850,
    merchant: 'IRCTC Rail',
    trip: 'Ahmedabad Conference',
    notes: 'Executive AC Chair Car train ticket with onboard catering.',
    icon: Train,
    color: 'blue',
  },

  // 🎟️ Conferences, Tech & Miscellaneous
  {
    id: 'other-conference-pass',
    title: 'Tech Summit & Conference Pass',
    category: 'Other',
    amount: 18500,
    merchant: 'React India / AWS Summit',
    trip: 'Developer Conference',
    notes: 'All-access 2-day delegate ticket with workshop workshops and materials.',
    icon: Ticket,
    badge: 'Conference',
    color: 'purple',
  },
  {
    id: 'other-esim-data',
    title: 'International Data eSIM / Wi-Fi',
    category: 'Other',
    amount: 2200,
    merchant: 'Airalo / Matrix eSIM',
    trip: 'Overseas Trip',
    notes: '10GB 30-day global roaming data pack for uninterrupted travel connectivity.',
    icon: Wifi,
    color: 'purple',
  },
  {
    id: 'other-travel-insurance',
    title: 'Comprehensive Travel Insurance',
    category: 'Other',
    amount: 1950,
    merchant: 'HDFC ERGO / Tata AIG',
    trip: 'International Travel',
    notes: 'Medical emergency, baggage loss, and trip delay insurance coverage.',
    icon: ShieldCheck,
    color: 'purple',
  },
];

const CATEGORY_TABS = ['All', 'Flight', 'Lodging', 'Meals', 'Transit', 'Other'];

const TemplatesModal = () => {
  const {
    isTemplatesModalOpen,
    closeTemplatesModal,
    openAddModal,
    addExpense,
    showToast,
  } = useExpenses();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickLoggingId, setQuickLoggingId] = useState(null);

  if (!isTemplatesModalOpen) return null;

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesCategory = activeTab === 'All' || tpl.category === activeTab;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.trip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (tpl) => {
    closeTemplatesModal();
    openAddModal({
      title: tpl.title,
      amount: tpl.amount,
      category: tpl.category,
      merchant: tpl.merchant,
      trip: tpl.trip,
      notes: tpl.notes,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    });
  };

  const handleQuickAdd = async (e, tpl) => {
    e.stopPropagation();
    setQuickLoggingId(tpl.id);

    const payload = new FormData();
    payload.append('title', tpl.title);
    payload.append('amount', tpl.amount);
    payload.append('category', tpl.category);
    payload.append('merchant', tpl.merchant);
    payload.append('trip', tpl.trip);
    payload.append('notes', tpl.notes);
    payload.append('date', new Date().toISOString().split('T')[0]);
    payload.append('status', 'Pending');

    const res = await addExpense(payload);
    setQuickLoggingId(null);

    if (res.success) {
      showToast(`Logged "${tpl.title}" via template!`, 'success');
      closeTemplatesModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-float max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Expense & Travel Templates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Choose from pre-configured travel templates to log expenses in seconds
              </p>
            </div>
          </div>

          <button
            onClick={closeTemplatesModal}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close templates modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title, merchant, trip, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab === 'All' ? '✨ All Templates' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                No templates matched "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for flight, hotel, dinner, uber, or switch categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((tpl) => {
                const IconComponent = tpl.icon;
                const isLogging = quickLoggingId === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    className="group flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-card cursor-pointer"
                    onClick={() => handleUseTemplate(tpl)}
                  >
                    <div>
                      {/* Card Header: Icon & Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {tpl.badge && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                              {tpl.badge}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tpl.category}
                          </span>
                        </div>
                      </div>

                      {/* Title & Estimated Cost */}
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-1">
                        {tpl.title}
                      </h3>

                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(tpl.amount)}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          est. typical
                        </span>
                      </div>

                      {/* Merchant & Notes */}
                      <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {tpl.notes}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                        <span className="truncate max-w-[120px]">🏢 {tpl.merchant}</span>
                        <span className="truncate max-w-[120px]">📍 {tpl.trip}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(tpl)}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, tpl)}
                        disabled={isLogging}
                        className="inline-flex items-center justify-center p-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                        title="Instant Quick Log"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Tip */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              <strong>Tip:</strong> Click <strong>"Use Template"</strong> to modify amounts or attach receipts, or click ⚡ to log instantly.
            </span>
          </div>
          <button
            onClick={closeTemplatesModal}
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
