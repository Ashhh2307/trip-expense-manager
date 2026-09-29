import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  X,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useItinerary } from '../context/ItineraryContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ isMobileOpen, closeMobileSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { savedItineraries, openSavedModal } = useItinerary();

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  const navItems = [
    {
      name: 'AI Chat',
      path: '/ai-chat',
      icon: Sparkles,
      badge: 'AI',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Floating Rounded Sidebar Card */}
      <aside
        className={`fixed top-4 bottom-4 left-4 z-40 w-64 bg-white/90 dark:bg-[#111317]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800/90 rounded-[28px] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 overflow-hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
        }`}
      >
        {/* Top Branding */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <Logo
              size="md"
              showText={true}
              showTagline={true}
              taglineText="AI Travel & Itinerary Planner"
              asLink={true}
              to="/ai-chat"
            />

            {/* Mobile Close Button */}
            <button
              onClick={closeMobileSidebar}
              className="lg:hidden p-2 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subtle gradient divider */}
          <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700/50 to-transparent my-1" />

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1.5">
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
              Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path || location.pathname === '/';

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-[#202227] text-slate-900 dark:text-white shadow-xs font-semibold border border-slate-200/90 dark:border-slate-700/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Saved Itineraries Option */}
            <button
              type="button"
              onClick={() => {
                openSavedModal();
                closeMobileSidebar();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                <span>Saved Itineraries</span>
              </div>
              {savedItineraries.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  {savedItineraries.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Rounded Floating Profile Card */}
        <div className="p-2.5 m-3 bg-slate-100/90 dark:bg-[#18191e] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl flex items-center justify-between gap-2 shadow-xs dark:shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs ring-2 ring-emerald-500/30">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate">
                {user?.name || 'User'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            {/* Light / Dark Mode Toggle */}
            <ThemeToggle
              variant="button"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors"
            />

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
