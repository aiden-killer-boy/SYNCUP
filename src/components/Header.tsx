import React from 'react';
import { Bell, BookOpen, Bot, Sparkles, Activity, Award } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  unreadCount: number;
  subjectsCount?: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSubjects?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  unreadCount,
  subjectsCount = 0,
  onOpenNotifications,
  onOpenProfile,
  onOpenSubjects,
  onOpenAiAssistant,
}) => {
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'credit-score':
        return 'Social Behavioural Credit Score (Out of 10)';
      case 'peer-review':
        return 'Peer Review Evaluation (Rate 1–10)';
      case 'teacher-bridge':
        return 'Student-Teacher Interaction Bridge';
      case 'todo-diary':
        return 'To-Do Planner & Certificate Diary';
      default:
        return 'SynqUp';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0b1326]/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.35)] pt-safe border-b border-white/[0.04]">
      <div className="h-20 px-4 sm:px-6 max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* SynqUp Custom Logo and App Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8083ff] via-[#6366f1] to-[#4edea3] flex items-center justify-center shadow-lg shadow-[#8083ff]/25 border border-white/20 shrink-0 relative group">
            <Activity className="w-5 h-5 text-[#0b1326] stroke-[2.5]" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-2 ring-[#0b1326] animate-pulse" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-lg sm:text-xl text-[#dae2fd] tracking-tight truncate">
                SynqUp
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#222a3d] text-[#4edea3] text-[10px] font-bold uppercase tracking-wider shrink-0 border border-[#4edea3]/20">
                Fall 2025 • Semester 5
              </span>
            </div>
            <span className="text-xs font-semibold text-[#8083ff] tracking-wide truncate">
              {getTabLabel(activeTab)}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Student Initialized Subjects Button */}
          {onOpenSubjects && (
            <button
              id="student-subjects-toggle-btn"
              aria-label="Student Initialized Subjects"
              onClick={onOpenSubjects}
              className="h-10 px-3 rounded-full bg-[#222a3d]/70 hover:bg-[#222a3d] text-[#c7c4d7] hover:text-[#dae2fd] border border-white/[0.06] flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              type="button"
              title="Student Initialized Subjects"
            >
              <BookOpen className="w-4 h-4 text-[#8083ff]" />
              <span className="hidden md:inline">Subjects</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-[10px] font-bold">
                {subjectsCount}
              </span>
            </button>
          )}

          {/* AI Assistant Button */}
          {onOpenAiAssistant && (
            <button
              id="ai-assistant-toggle-btn"
              aria-label="SynqUp AI Assistant"
              onClick={onOpenAiAssistant}
              className="h-10 px-3.5 rounded-full bg-gradient-to-r from-[#8083ff] to-[#4edea3] text-[#0d0096] font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#8083ff]/20 cursor-pointer"
              type="button"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>
          )}

          <button
            id="notifications-toggle-btn"
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d]/60 active:scale-95 transition-all relative cursor-pointer"
            type="button"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#ffb95f] ring-2 ring-[#0b1326] animate-pulse" />
            )}
          </button>

          <button
            id="user-profile-toggle-btn"
            aria-label="User Profile"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full bg-[#171f33] hover:bg-[#222a3d] border border-white/[0.08] hover:border-[#8083ff]/50 transition-all cursor-pointer focus:outline-none"
            type="button"
          >
            <div className="relative">
              <img
                alt="Profile"
                className="w-7 h-7 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-white/15"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChjQXfQf2sTEy8DHAUDgvzC4xhp8rbe4Nyd5sW8iMMzWCvEqt44gtNrA5ezldbKSsLTPxKpbHS9BjuXCAu605DhM3t_IlYTB5gOP88g7nt3nDbcRcFrkW4mFq6zAUhiLpH38Dx15l2Agm47U2REL7_PGN0dt0T2vfknO3qsCh3a5y5vXz2MVi8wT2b7aKbwNmUAijgkoa2vY2FdhD4sVcixpHWCo7c5pafZNqWQI6PsznjtxP_hFtn"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#4edea3] ring-1 ring-[#0b1326]" />
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#c0c1ff]">
              <Award className="w-3 h-3 text-[#ffb95f]" />
              <span>3 Badges</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
