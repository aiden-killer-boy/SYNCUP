import React from 'react';
import { Gauge, Edit3, MessageSquareHeart, Award } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    {
      id: 'credit-score' as TabType,
      label: 'Credit Score',
      icon: Gauge,
    },
    {
      id: 'peer-review' as TabType,
      label: 'Peer Review',
      icon: Edit3,
    },
    {
      id: 'teacher-bridge' as TabType,
      label: 'Teacher Bridge',
      icon: MessageSquareHeart,
    },
    {
      id: 'todo-diary' as TabType,
      label: 'To-Do & Diary',
      icon: Award,
    },
  ];

  return (
    <nav
      id="main-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#060e20]/92 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] border-t border-white/[0.05]"
    >
      <div className="h-16 max-w-2xl mx-auto px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center min-w-[68px] min-h-[44px] py-1 transition-all duration-200 cursor-pointer ${
                isActive ? 'text-[#c0c1ff]' : 'text-[#c7c4d7] hover:text-[#dae2fd]'
              } active:scale-95`}
              type="button"
            >
              {/* Active glow indicator */}
              <span
                className={`active-glow absolute -top-1 w-8 h-1 rounded-full bg-[#8083ff] shadow-[0_0_12px_#8083ff] transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 stroke-[2.4px]' : 'scale-100 stroke-[1.8px]'
                }`}
              />

              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight font-semibold transition-colors ${
                  isActive ? 'text-[#c0c1ff]' : 'text-[#c7c4d7]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
