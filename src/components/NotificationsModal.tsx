import React from 'react';
import { Bell, Check, X, Shield, Award, Calendar, AlertCircle } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#8083ff]" />
            <h3 className="text-base font-bold text-[#dae2fd]">Cohort Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-[#4edea3] hover:underline cursor-pointer"
              type="button"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                notif.read
                  ? 'bg-[#131b2e]/60 border-white/[0.03] text-[#c7c4d7]'
                  : 'bg-[#131b2e] border-[#8083ff]/30 text-[#dae2fd]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold">{notif.title}</h4>
                <span className="text-[10px] text-[#908fa0] shrink-0">{notif.timestamp}</span>
              </div>
              <p className="text-xs mt-1 text-[#c7c4d7] leading-relaxed">{notif.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
