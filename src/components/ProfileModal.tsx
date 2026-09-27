import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Award,
  X,
  Key,
  Check,
  Heart,
  MessageSquare,
  Code,
  Calendar,
  Smile,
  Sparkles,
  Lock,
  Star,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { QualityBadge } from '../types';
import { INITIAL_QUALITY_BADGES } from '../data/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userScore: number;
  badges?: QualityBadge[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userScore,
  badges = INITIAL_QUALITY_BADGES,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<QualityBadge | null>(null);

  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return Heart;
      case 'message-square':
        return MessageSquare;
      case 'code':
        return Code;
      case 'calendar':
        return Calendar;
      case 'smile':
        return Smile;
      default:
        return Award;
    }
  };

  const getTierColor = (tier: 'Diamond' | 'Gold' | 'Silver') => {
    switch (tier) {
      case 'Diamond':
        return {
          badgeBg: 'bg-[#8083ff]/15',
          text: 'text-[#c0c1ff]',
          border: 'border-[#8083ff]/30',
        };
      case 'Gold':
        return {
          badgeBg: 'bg-[#ffb95f]/15',
          text: 'text-[#ffb95f]',
          border: 'border-[#ffb95f]/30',
        };
      case 'Silver':
        return {
          badgeBg: 'bg-[#dae2fd]/10',
          text: 'text-[#dae2fd]',
          border: 'border-white/10',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8083ff]/20 text-[#8083ff] flex items-center justify-center border border-[#8083ff]/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#dae2fd]">Student Profile & Distinction Badges</h3>
              <p className="text-xs text-[#c7c4d7]">Verified behavioral credentials and cryptographic identity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* Profile Card */}
          <div className="flex items-center gap-4 bg-[#131b2e] p-4 rounded-2xl border border-white/[0.04] relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-[#8083ff]/10 blur-2xl pointer-events-none" />
            
            <div className="relative shrink-0">
              <img
                alt="User avatar"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#8083ff]/40 shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChjQXfQf2sTEy8DHAUDgvzC4xhp8rbe4Nyd5sW8iMMzWCvEqt44gtNrA5ezldbKSsLTPxKpbHS9BjuXCAu605DhM3t_IlYTB5gOP88g7nt3nDbcRcFrkW4mFq6zAUhiLpH38Dx15l2Agm47U2REL7_PGN0dt0T2vfknO3qsCh3a5y5vXz2MVi8wT2b7aKbwNmUAijgkoa2vY2FdhD4sVcixpHWCo7c5pafZNqWQI6PsznjtxP_hFtn"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4edea3] flex items-center justify-center ring-2 ring-[#131b2e] text-[#002113]">
                <Check className="w-3 h-3 stroke-[3px]" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base font-bold text-[#dae2fd] truncate">Anumitra Saha</h4>
                <span className="px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-[10px] font-bold border border-[#8083ff]/30">
                  {unlockedCount} Badges Earned
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7]">Student ID: #CS-2023-07 • Class Rank #4/68</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] font-semibold text-[#4edea3]">
                  Group 4 Lead • Distributed Systems
                </span>
              </div>
            </div>
          </div>

          {/* Quality Badges Showcase */}
          <div className="bg-[#131b2e] rounded-2xl p-4 border border-white/[0.06] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8083ff]" />
                  <h4 className="text-sm font-bold text-[#dae2fd]">Quality Excellence Badges</h4>
                </div>
                <p className="text-[11px] text-[#c7c4d7] mt-0.5">
                  Awarded for consistent high scores (≥ 8.5/10) in specific qualities like Empathy and Interaction.
                </p>
              </div>

              {/* Badges Filter Tabs */}
              <div className="flex items-center bg-[#0b1326] p-1 rounded-xl border border-white/[0.04] self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'all'
                      ? 'bg-[#8083ff] text-[#0d0096] font-bold shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dae2fd]'
                  }`}
                >
                  All ({badges.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unlocked')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'unlocked'
                      ? 'bg-[#4edea3] text-[#002113] font-bold shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dae2fd]'
                  }`}
                >
                  Earned ({unlockedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('locked')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === 'locked'
                      ? 'bg-[#222a3d] text-[#dae2fd] font-bold shadow-sm'
                      : 'text-[#c7c4d7] hover:text-[#dae2fd]'
                  }`}
                >
                  In Progress ({badges.length - unlockedCount})
                </button>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="space-y-2.5">
              {filteredBadges.map((badge) => {
                const IconComponent = getBadgeIcon(badge.iconName);
                const tierStyle = getTierColor(badge.tier);
                const isSelected = selectedBadge?.id === badge.id;

                return (
                  <div
                    key={badge.id}
                    id={`profile-badge-${badge.id}`}
                    onClick={() => setSelectedBadge(isSelected ? null : badge)}
                    className={`rounded-xl p-3 border transition-all cursor-pointer ${
                      badge.isUnlocked
                        ? 'bg-[#171f33] border-white/[0.08] hover:border-[#8083ff]/40 shadow-sm'
                        : 'bg-[#0e1626]/80 border-white/[0.03] opacity-85 hover:opacity-100'
                    } ${isSelected ? 'ring-1 ring-[#8083ff]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Badge Icon Token */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner relative"
                          style={{
                            backgroundColor: badge.isUnlocked ? `${badge.accentColor}25` : '#222a3d',
                            color: badge.isUnlocked ? badge.accentColor : '#908fa0',
                            border: `1px solid ${badge.isUnlocked ? `${badge.accentColor}40` : '#343d52'}`,
                          }}
                        >
                          <IconComponent className="w-5 h-5" />
                          {badge.isUnlocked && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#4edea3] flex items-center justify-center ring-1 ring-[#171f33]">
                              <Star className="w-2.5 h-2.5 text-[#002113] fill-current" />
                            </span>
                          )}
                          {!badge.isUnlocked && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#222a3d] flex items-center justify-center ring-1 ring-[#0e1626] text-[#c7c4d7]">
                              <Lock className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>

                        {/* Title and Detail */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs sm:text-sm font-bold text-[#dae2fd] truncate">
                              {badge.name}
                            </h5>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${tierStyle.badgeBg} ${tierStyle.text} ${tierStyle.border}`}
                            >
                              {badge.tier}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs mt-0.5 flex-wrap">
                            <span
                              className="font-bold text-[11px]"
                              style={{ color: badge.accentColor }}
                            >
                              {badge.qualityTitle}: {badge.currentScore.toFixed(1)}/10
                            </span>
                            <span className="text-[#908fa0] text-[10px]">•</span>
                            <span className="text-[10px] text-[#c7c4d7]">
                              Target: ≥ {badge.thresholdScore}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className="shrink-0 text-right">
                        {badge.isUnlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#4edea3]/15 text-[#4edea3] text-[10px] font-bold border border-[#4edea3]/30">
                            <Check className="w-3 h-3 stroke-[2.5]" /> Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#222a3d] text-[#ffb95f] text-[10px] font-semibold border border-white/[0.05]">
                            <TrendingUp className="w-3 h-3" /> In Progress
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badge Description & Criteria */}
                    <p className="text-xs text-[#c7c4d7] mt-2 leading-relaxed">
                      {badge.description}
                    </p>

                    {/* Progress Bar for Locked/In-Progress Badges */}
                    {!badge.isUnlocked && (
                      <div className="mt-2.5 pt-2 border-t border-white/[0.04] space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-[#c7c4d7] font-medium">{badge.criteria}</span>
                          <span className="text-[#ffb95f] font-bold">{badge.earnedDate}</span>
                        </div>
                        <div className="w-full bg-[#0b1326] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (badge.currentScore / badge.thresholdScore) * 100)}%`,
                              backgroundColor: badge.accentColor,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {badge.isUnlocked && (
                      <div className="mt-2 pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#908fa0]">
                        <span>{badge.criteria}</span>
                        <span className="text-[#4edea3] font-semibold">{badge.earnedDate}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Credentials and Security State */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-3 bg-[#131b2e] rounded-xl border border-white/[0.04]">
              <span className="text-[#c7c4d7]">Current Composite Score</span>
              <span className="font-extrabold text-[#4edea3]">{userScore} EduScore (8.6/10)</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#131b2e] rounded-xl border border-white/[0.04]">
              <span className="text-[#c7c4d7]">Cohort Standing</span>
              <span className="font-semibold text-[#c0c1ff]">Top 6% (Rank 4/68)</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#131b2e] rounded-xl border border-white/[0.04]">
              <div>
                <span className="text-[#dae2fd] block font-semibold">Peer Ballot Privacy</span>
                <span className="text-[10px] text-[#908fa0]">Others' individual votes for you are hidden from you</span>
              </div>
              <span className="font-semibold text-[#4edea3] text-[11px] bg-[#4edea3]/10 px-2 py-0.5 rounded-full border border-[#4edea3]/20">
                Zero-Knowledge Sealed
              </span>
            </div>

            <div className="p-3 bg-[#131b2e] rounded-xl space-y-1 border border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-[#c7c4d7] flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-[#ffb95f]" /> Aggregator Public Key
                </span>
                <span className="text-[10px] text-[#4edea3] flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Active
                </span>
              </div>
              <p className="font-mono text-[10px] text-[#908fa0] truncate">
                0x4f92...a81c7e9b042d8f99e31a
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="shrink-0 pt-2 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-xs font-semibold text-[#dae2fd] transition-all cursor-pointer"
            type="button"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
