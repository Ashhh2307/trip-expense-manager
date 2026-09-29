import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Bell,
  HelpCircle,
  Menu,
  LogOut,
  User,
  Compass,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useItinerary } from '../context/ItineraryContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ toggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { openSavedModal } = useItinerary();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchVal, setSearchVal] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (location.pathname !== '/ai-chat') {
      navigate('/ai-chat');
    }
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'TW';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Left: Mobile Hamburger & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearchChange}
                placeholder="Search travel plans, itineraries or destinations..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => setSearchVal('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* AI Chat Quick Button */}
            <button
              onClick={() => navigate('/ai-chat')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">AI Travel Chat</span>
            </button>

            {/* Saved Itineraries Button */}
            <button
              onClick={() => openSavedModal()}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent dark:border-slate-700"
              title="View saved itineraries"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Itineraries</span>
            </button>

            {/* Theme Switcher */}
            <ThemeToggle variant="dropdown" />

            {/* Notifications Icon */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {/* Notification Popover */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-float p-4 animate-fade-in z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Notifications
                    </h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      1 New
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          AI Trip Assistant Ready
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Generate itineraries with day-by-day plans & budget allocations.
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          Just now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Help Icon */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Help and documentation"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* User Profile / Avatar Dropdown */}
            <div className="relative pl-1 sm:pl-2" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                aria-label="User menu"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 dark:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-sm ring-2 ring-transparent hover:ring-slate-300 dark:hover:ring-emerald-500/50 transition-all">
                  {userInitials}
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-float py-2 animate-fade-in z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || ''}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/ai-chat');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      AI Travel Assistant
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        openSavedModal();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      Saved Itineraries
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsHelpOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      Help &amp; Guide
                    </button>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-float border border-slate-200 dark:border-slate-800 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                TravelWise Quick Guide
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong className="text-slate-900 dark:text-slate-100">1. Generate Trip Itineraries:</strong> Ask for detailed trip plans with custom day-by-day schedules &amp; budget breakdowns (e.g. <em>"Rajasthan 5-day itinerary under ₹25,000"</em>).
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-100">2. Saved Itineraries:</strong> Save any generated itinerary with one click and access them anytime from <strong>Saved Itineraries</strong> in the sidebar.
              </p>
              <p>
                <strong className="text-slate-900 dark:text-slate-100">3. Quick Prompt Chips:</strong> Click the suggested prompt chips at the bottom of the chat to quickly explore popular travel destinations.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
