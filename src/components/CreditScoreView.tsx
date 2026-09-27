import React from 'react';
import {
  TrendingUp,
  Award,
  Users,
  Code,
  Calendar,
  MessageSquare,
  Smile,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Lock,
  EyeOff,
  Shield,
  Sparkles,
  Heart,
  Star,
  ChevronRight,
} from 'lucide-react';
import { TabType, Teammate, QualityBadge } from '../types';
import { INITIAL_QUALITY_BADGES } from '../data/mockData';

interface CreditScoreViewProps {
  onNavigateToTab: (tab: TabType) => void;
  teammates: Teammate[];
  compositeScoreOutOf10: number;
  onOpenProfile?: () => void;
  badges?: QualityBadge[];
}

export const CreditScoreView: React.FC<CreditScoreViewProps> = ({
  onNavigateToTab,
  teammates,
  compositeScoreOutOf10 = 8.6,
  onOpenProfile,
  badges = INITIAL_QUALITY_BADGES,
}) => {
  // Meter arc calculation (270 degrees sweep)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const maxScore = 10;
  const percentage = Math.min(1, Math.max(0, compositeScoreOutOf10 / maxScore));
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength * (1 - percentage);

  // 5 core qualities out of 10
  const qualitiesBreakdown = [
    {
      key: 'tech_skills',
      title: 'Tech Skills',
      score: 8.8,
      delta: '+0.4',
      icon: Code,
      accentColor: '#8083ff',
      description: 'Algorithm rigor, code clarity & pull request review discipline',
      tier: 'Architecture-Level Mentor',
      badgeName: 'Code Architecture Pillar',
      isUnlocked: true,
    },
    {
      key: 'engagement',
      title: 'Engagement',
      score: 8.4,
      delta: '+0.6',
      icon: Calendar,
      accentColor: '#4edea3',
      description: 'Punctuality in standups, active sprint presence & delivery reliability',
      tier: 'Reliable Attendance & Follow-up',
      badgeName: 'Sprint Driver',
      isUnlocked: false,
    },
    {
      key: 'interaction',
      title: 'Interaction',
      score: 8.7,
      delta: '+0.5',
      icon: MessageSquare,
      accentColor: '#ffb95f',
      description: 'Clarity in demos, surfacing blockers & bridging technical debates',
      tier: 'Proactive Communicator',
      badgeName: 'Interaction Catalyst',
      isUnlocked: true,
    },
    {
      key: 'empathy',
      title: 'Empathy',
      score: 9.2,
      delta: '+0.8',
      icon: Users,
      accentColor: '#8083ff',
      description: 'Receptive to feedback, lifting struggling peers & psychological safety',
      tier: 'High Emotional Intelligence',
      badgeName: 'Empathy Luminary',
      isUnlocked: true,
    },
    {
      key: 'state_of_mind',
      title: 'State of Mind',
      score: 8.1,
      delta: '+0.3',
      icon: Smile,
      accentColor: '#4edea3',
      description: 'Equanimity during sprint crunch times, resiliency on broken builds',
      tier: 'Calm Under Deadlines',
      badgeName: 'Equanimity Anchor',
      isUnlocked: false,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-6 pb-28 pt-2">
      {/* Top Banner Context */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight">
            Social Behavioural Credit Score
          </h2>
          <p className="text-xs text-[#c7c4d7] mt-0.5">
            Aggregated from peer ratings across 5 core social & technical qualities
          </p>
        </div>
      </div>

      {/* Hero Circular Credit Meter (Out of 10) */}
      <div className="bg-[#171f33] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/[0.06]">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#8083ff]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#4edea3]/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center justify-center text-center">
          {/* Circular SVG Gauge (Scale 0 to 10) */}
          <div className="relative w-60 h-60 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-225" viewBox="0 0 200 200">
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#222a3d"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${arcLength} ${circumference}`}
              />
              {/* Active Progress Gradient Arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="url(#creditScoreGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="creditScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4edea3" />
                  <stop offset="50%" stopColor="#8083ff" />
                  <stop offset="100%" stopColor="#c0c1ff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c7c4d7]">
                Peer Credit Rating
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-5xl sm:text-6xl font-extrabold text-[#dae2fd] tracking-tight font-mono">
                  {compositeScoreOutOf10.toFixed(1)}
                </span>
                <span className="text-xl font-bold text-[#c7c4d7]">/10</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#4edea3]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+0.6 boost this sprint</span>
              </div>
            </div>
          </div>

          {/* Tier Badging & Aggregation Status */}
          <div className="mt-2 flex items-center gap-2 flex-wrap justify-center">
            <span className="px-3.5 py-1 rounded-full bg-[#00a572]/20 text-[#4edea3] text-xs font-bold border border-[#4edea3]/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Exemplary Peer Standing
            </span>
            <span className="px-3 py-1 rounded-full bg-[#222a3d] text-[#c0c1ff] text-xs font-bold border border-white/[0.06]">
              Cohort Top 8%
            </span>
          </div>

          <div className="mt-4 bg-[#131b2e]/80 rounded-2xl p-3 max-w-md w-full text-xs text-[#c7c4d7] flex items-center justify-between border border-white/[0.04]">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8083ff]" />
              Calculated from 3 peer evaluations
            </span>
            <span className="text-[#4edea3] font-semibold">100% Cryptographically Blind</span>
          </div>
        </div>
      </div>

      {/* Quality Distinction Badges Banner */}
      <div className="bg-[#171f33] rounded-3xl p-5 border border-white/[0.06] shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#8083ff]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8083ff]/30 to-[#ffb95f]/20 text-[#c0c1ff] flex items-center justify-center border border-[#8083ff]/30 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[#dae2fd]">
                  Quality Distinction Badges
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-bold border border-[#4edea3]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> 3 Badges Unlocked
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7] mt-0.5">
                Earned by maintaining consistent high scores (≥ 8.5/10) in qualities like Empathy and Interaction.
              </p>
            </div>
          </div>

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8083ff]/20 hover:bg-[#8083ff]/30 text-[#c0c1ff] text-xs font-semibold border border-[#8083ff]/40 transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>View on Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Badge Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <div
            onClick={onOpenProfile}
            className="bg-[#131b2e] hover:bg-[#1c2640] p-2.5 rounded-xl border border-white/[0.04] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#8083ff]/20 text-[#8083ff] flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#dae2fd] truncate">Empathy Luminary</span>
                <span className="text-[10px] text-[#4edea3] font-mono font-bold">9.2</span>
              </div>
              <span className="text-[10px] text-[#8083ff] block truncate">Empathy Excellence</span>
            </div>
          </div>

          <div
            onClick={onOpenProfile}
            className="bg-[#131b2e] hover:bg-[#1c2640] p-2.5 rounded-xl border border-white/[0.04] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#ffb95f]/20 text-[#ffb95f] flex items-center justify-center shrink-0">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#dae2fd] truncate">Interaction Catalyst</span>
                <span className="text-[10px] text-[#4edea3] font-mono font-bold">8.7</span>
              </div>
              <span className="text-[10px] text-[#ffb95f] block truncate">Interaction Leader</span>
            </div>
          </div>

          <div
            onClick={onOpenProfile}
            className="bg-[#131b2e] hover:bg-[#1c2640] p-2.5 rounded-xl border border-white/[0.04] flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#8083ff]/20 text-[#8083ff] flex items-center justify-center shrink-0">
              <Code className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#dae2fd] truncate">Code Architecture</span>
                <span className="text-[10px] text-[#4edea3] font-mono font-bold">8.8</span>
              </div>
              <span className="text-[10px] text-[#8083ff] block truncate">Tech Skills Pillar</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Qualities Breakdown (Out of 10) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#dae2fd]">
              The 5 Evaluated Qualities (Scale 1–10)
            </h3>
            <p className="text-xs text-[#c7c4d7]">
              Peer aggregated ratings across your behavioral dimensions
            </p>
          </div>
          <span className="text-xs text-[#4edea3] font-semibold">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {qualitiesBreakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                id={`quality-card-${item.key}`}
                className="bg-[#171f33] rounded-2xl p-4 border border-white/[0.04] flex flex-col justify-between gap-3 hover:border-white/10 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.accentColor}25`, color: item.accentColor }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-[#dae2fd]">{item.title}</h4>
                    </div>

                    <div className="flex items-baseline gap-0.5">
                      <span
                        className="text-lg font-extrabold font-mono"
                        style={{ color: item.accentColor }}
                      >
                        {item.score}
                      </span>
                      <span className="text-[10px] text-[#c7c4d7]">/10</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#c7c4d7] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {/* Badge association tag */}
                  <div className="mt-2">
                    {item.isUnlocked ? (
                      <span
                        onClick={onOpenProfile}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer"
                        style={{
                          backgroundColor: `${item.accentColor}18`,
                          color: item.accentColor,
                          borderColor: `${item.accentColor}35`,
                        }}
                      >
                        <Star className="w-3 h-3 fill-current" />
                        <span>{item.badgeName} Unlocked</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#222a3d] text-[#c7c4d7] text-[10px] font-medium border border-white/[0.04]">
                        <Award className="w-3 h-3 text-[#ffb95f]" />
                        <span>Target ≥ 8.5 for {item.badgeName}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#222a3d] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(item.score / 10) * 100}%`,
                        backgroundColor: item.accentColor,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[#c7c4d7] mt-1.5 font-medium">
                    <span>{item.tier}</span>
                    <span className="text-[#4edea3] font-bold">{item.delta} this month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Peer Voting Privacy & Zero-Knowledge Shield */}
      <div className="bg-[#171f33] rounded-3xl p-5 sm:p-6 border border-white/[0.06] shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#8083ff]/10 blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center border border-[#8083ff]/30 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-[#dae2fd]">
                  Peer Voting Privacy Protection
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[10px] font-bold uppercase tracking-wider border border-[#4edea3]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Blind Voting Active
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7] mt-0.5">
                Votes submitted for you by teammates are strictly confidential and sealed.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#131b2e] rounded-2xl p-4 border border-white/[0.04] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#dae2fd]">
            <EyeOff className="w-4 h-4 text-[#ffb95f] shrink-0" />
            <span>Others' votes for you are not visible to you — only to them.</span>
          </div>
          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            Under SynqUp's psychological safety protocol, you cannot inspect individual ballots, specific scores, or comments that your peers submit about you. Only the reviewer who casts a vote can see what they are giving. You only receive the cryptographically aggregated composite score ({compositeScoreOutOf10.toFixed(1)}/10) to foster an open, honest, and retaliation-free collaborative culture.
          </p>
        </div>

        {/* Teammate Ballots Confidentiality Status */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-[#908fa0] uppercase tracking-wider block">
            Cohort Ballots Status for Your Credit Profile:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {teammates.map((tm) => (
              <div
                key={tm.id}
                className="bg-[#0b1326] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#dae2fd] truncate">{tm.name}</p>
                  <span className="text-[10px] text-[#4edea3] font-medium">Ballot Sealed</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#908fa0] bg-[#171f33] px-2 py-1 rounded-md border border-white/[0.05] shrink-0">
                  <Lock className="w-3 h-3 text-[#8083ff]" />
                  <span>Private to {tm.name.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Banner: Rate Peers to Reciprocate */}
      <div className="bg-gradient-to-r from-[#8083ff]/20 to-[#00a572]/20 rounded-3xl p-5 border border-[#8083ff]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#8083ff] flex items-center justify-center text-[#0d0096] shrink-0 font-extrabold text-sm shadow-md">
            {teammates.filter((t) => t.status === 'completed').length}/{teammates.length || 3}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#dae2fd]">
              Complete Your Peer Ratings
            </h4>
            <p className="text-xs text-[#c7c4d7]">
              {teammates.find((t) => t.status !== 'completed')?.name || 'Priya Patra'} is awaiting your anonymous rating across the 5 qualities.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('peer-review')}
          className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#8083ff] text-[#0d0096] font-extrabold text-xs hover:bg-[#c0c1ff] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md"
          type="button"
        >
          <span>Rate Peer Now (1–10)</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
