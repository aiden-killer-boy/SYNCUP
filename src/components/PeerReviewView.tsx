import React, { useState } from 'react';
import {
  Code,
  Calendar,
  MessageSquare,
  Users,
  Smile,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  Lock,
  TrendingUp,
  Save,
  ArrowRight,
  Zap,
  Ear,
  Handshake,
  CheckSquare,
  FileEdit,
  Sparkles,
  Check,
  PlusCircle,
  PenTool,
  MessageSquarePlus,
  X,
  Plus,
} from 'lucide-react';
import { Teammate, DimensionConfig } from '../types';
import { DIMENSIONS } from '../data/mockData';

interface PeerReviewViewProps {
  teammates: Teammate[];
  activeTeammateIndex: number;
  onSelectTeammate: (index: number) => void;
  onSaveTeammateReview: (
    teammateId: string,
    ratings: Record<string, number>,
    comment: string,
    tags: string[],
    isCompleted: boolean
  ) => void;
}

export const PeerReviewView: React.FC<PeerReviewViewProps> = ({
  teammates,
  activeTeammateIndex,
  onSelectTeammate,
  onSaveTeammateReview,
}) => {
  const teammate = teammates[activeTeammateIndex] || teammates[0];

  // Local state for interactive editing
  const [ratings, setRatings] = useState<Record<string, number>>(
    teammate.initialRatings || {
      tech_skills: 8,
      engagement: 7,
      interaction: 9,
      empathy: 9,
      state_of_mind: 8,
    }
  );
  const [comment, setComment] = useState<string>(teammate.initialComment || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(teammate.initialTags || []);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Additional "Other" dimension state for manual peer evaluation
  const [includeOtherDimension, setIncludeOtherDimension] = useState<boolean>(
    Boolean(teammate.initialRatings?.['other'])
  );
  const [otherDimensionTitle, setOtherDimensionTitle] = useState<string>('Other: Custom Competency');

  // Additional "Other" qualitative manual feedback mode & custom tags
  const [activeFeedbackMode, setActiveFeedbackMode] = useState<'standard' | 'other'>('standard');
  const [otherFeedbackTopic, setOtherFeedbackTopic] = useState<string>('');
  const [otherFeedbackNote, setOtherFeedbackNote] = useState<string>('');
  const [showCustomTagInput, setShowCustomTagInput] = useState<boolean>(false);
  const [customTagInput, setCustomTagInput] = useState<string>('');

  // Sync state if active teammate changes
  React.useEffect(() => {
    setRatings(
      teammate.initialRatings || {
        tech_skills: 8,
        engagement: 7,
        interaction: 9,
        empathy: 9,
        state_of_mind: 8,
      }
    );
    setIncludeOtherDimension(Boolean(teammate.initialRatings?.['other']));
    setComment(teammate.initialComment || '');
    setSelectedTags(teammate.initialTags || []);
    setOtherFeedbackTopic('');
    setOtherFeedbackNote('');
    setShowCustomTagInput(false);
    setCustomTagInput('');
  }, [teammate.id]);

  const handleSliderChange = (dimensionKey: string, val: number) => {
    setRatings((prev) => ({
      ...prev,
      [dimensionKey]: val,
    }));
  };

  const getDimensionTier = (dim: DimensionConfig, val: number) => {
    if (val <= 4) return dim.tiers.low;
    if (val <= 6) return dim.tiers.mid;
    if (val <= 8) return dim.tiers.high;
    return dim.tiers.top;
  };

  const quickKudos = [
    { label: 'Quick Problem Solver', icon: Zap },
    { label: 'Great Listener', icon: Ear },
    { label: 'Dependable Teammate', icon: Handshake },
    { label: 'Thorough Reviewer', icon: CheckSquare },
    { label: 'Other', icon: MessageSquarePlus },
  ];

  const handleToggleTag = (tagText: string) => {
    if (tagText === 'Other') {
      setShowCustomTagInput((prev) => !prev);
      setActiveFeedbackMode('other');
      return;
    }

    if (selectedTags.includes(tagText)) {
      setSelectedTags((prev) => prev.filter((t) => t !== tagText));
    } else {
      setSelectedTags((prev) => [...prev, tagText]);
      // Also append to comment if empty or append nicely
      setComment((prev) => {
        if (!prev.trim()) return tagText;
        if (prev.includes(tagText)) return prev;
        return `${prev} • ${tagText}`;
      });
    }
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanTag = customTagInput.trim();
    if (!cleanTag) return;
    if (!selectedTags.includes(cleanTag)) {
      setSelectedTags((prev) => [...prev, cleanTag]);
      setComment((prev) => {
        if (!prev.trim()) return cleanTag;
        if (prev.includes(cleanTag)) return prev;
        return `${prev} • ${cleanTag}`;
      });
    }
    setCustomTagInput('');
    setShowCustomTagInput(false);
    setToastMessage(`Added "${cleanTag}" tag for ${teammate.name.split(' ')[0]}`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAppendOtherManualFeedback = () => {
    const cleanNote = otherFeedbackNote.trim();
    if (!cleanNote) return;
    const topicHeader = otherFeedbackTopic.trim()
      ? `[Other: ${otherFeedbackTopic.trim()}]`
      : '[Other Manual Feedback]';
    const formattedEntry = `${topicHeader} ${cleanNote}`;

    setComment((prev) => {
      if (!prev.trim()) return formattedEntry;
      return `${prev}\n\n${formattedEntry}`;
    });

    setOtherFeedbackNote('');
    setOtherFeedbackTopic('');
    setActiveFeedbackMode('standard');
    setToastMessage(`Manual feedback appended to ${teammate.name.split(' ')[0]}'s note!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Calculate live composite boost
  const avgRating =
    Object.values(ratings).reduce((acc, curr) => acc + curr, 0) /
    (Object.values(ratings).length || 1);
  const boostValue = (avgRating * 0.075).toFixed(1);

  // Save Draft
  const handleSaveDraft = () => {
    onSaveTeammateReview(teammate.id, ratings, comment, selectedTags, false);
    setToastMessage(`Draft saved for ${teammate.name}`);
    setTimeout(() => setToastMessage(null), 2500);

    // If there is another teammate, advance
    if (activeTeammateIndex < teammates.length - 1) {
      onSelectTeammate(activeTeammateIndex + 1);
    }
  };

  // Submit and Proceed
  const handleSubmitReview = () => {
    onSaveTeammateReview(teammate.id, ratings, comment, selectedTags, true);
    setShowSubmittedModal(true);
  };

  const handleModalProceed = () => {
    setShowSubmittedModal(false);
    if (activeTeammateIndex < teammates.length - 1) {
      onSelectTeammate(activeTeammateIndex + 1);
    } else {
      setToastMessage('All peer evaluations submitted successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'message-square':
        return <MessageSquare className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'smile':
        return <Smile className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-6 pb-28 pt-2">
      {/* Toast feedback banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#171f33] border border-[#4edea3]/40 text-[#dae2fd] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Step Navigation & Overall Flow */}
      <div className="flex flex-col gap-2.5 mt-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-xs font-bold uppercase tracking-wider border border-[#8083ff]/30">
              Peer Review
            </span>
            <span className="text-[#c7c4d7] text-xs font-semibold">• Fall 2025</span>
          </div>

          <span className="text-[#4edea3] text-xs font-bold tracking-tight bg-[#00a572]/20 px-3 py-0.5 rounded-full border border-[#4edea3]/30">
            Evaluation {teammate.evaluationStep} of {teammate.totalEvaluations}
          </span>
        </div>

        {/* Teammate quick switch tabs */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {teammates.map((tm, idx) => {
            const isCurrent = idx === activeTeammateIndex;
            return (
              <button
                key={tm.id}
                id={`peer-select-tab-${idx}`}
                onClick={() => onSelectTeammate(idx)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#8083ff]/25 text-[#c0c1ff] border border-[#8083ff]/40 shadow-sm'
                    : 'bg-[#171f33] text-[#c7c4d7] hover:bg-[#222a3d] border border-white/[0.04]'
                }`}
                type="button"
              >
                <span className="truncate">{tm.name.split(' ')[0]}</span>
                {tm.status === 'completed' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#222a3d] rounded-full h-1.5 overflow-hidden flex mt-1">
          <div
            className="h-full bg-[#4edea3] transition-all duration-500 rounded-full shadow-[0_0_8px_#4edea3]"
            style={{
              width: `${(teammate.evaluationStep / teammate.totalEvaluations) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Evaluated Teammate Header Bento Card */}
      <div className="bg-[#171f33] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-white/[0.06]">
        {/* Ambient glowing chromatic bleed */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#8083ff]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#4edea3]/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col gap-4">
          {/* Profile Context Header */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                alt={teammate.name}
                className="w-16 h-16 rounded-full object-cover shadow-lg ring-2 ring-white/10"
                src={teammate.avatarUrl}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#4edea3] flex items-center justify-center shadow-md">
                <Check className="w-3 h-3 text-[#002113] stroke-[3.5px]" />
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight truncate">
                  {teammate.name}
                </h2>
                <span className="text-[#c7c4d7] text-xs font-bold bg-[#2d3449] px-2.5 py-0.5 rounded-full border border-white/[0.05]">
                  {teammate.studentId}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#4edea3] mt-0.5">
                {teammate.group}
              </span>
              <p className="text-xs text-[#c7c4d7] mt-1 leading-relaxed">
                {teammate.project} • {teammate.duration}
              </p>
            </div>
          </div>

          {/* Confidentiality Assurance Banner */}
          <div className="bg-[#131b2e]/90 rounded-2xl p-3.5 flex items-start gap-3 shadow-inner border border-white/[0.04]">
            <div className="w-8 h-8 rounded-full bg-[#8083ff]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#c0c1ff]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-[#c0c1ff] tracking-wide uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#4edea3]" />
                Strictly Private Ballot Protocol
              </span>
              <p className="text-xs text-[#c7c4d7] leading-relaxed mt-0.5">
                What you give to {teammate.name.split(' ')[0]} is visible <strong>only to you</strong>. {teammate.name.split(' ')[0]} cannot view your individual scores, only their cohort average meter. Similarly, what others vote for you is strictly hidden from you and visible only to them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attribute Rating Section Title */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#c0c1ff]" />
          <h3 className="text-base sm:text-lg font-bold text-[#dae2fd]">
            Core Competency Dimensions
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#c7c4d7] uppercase tracking-wider">
          Scale 1 – 10
        </span>
      </div>

      {/* SLIDER CARDS LIST */}
      <div className="flex flex-col space-y-4" id="rating-sliders-container">
        {DIMENSIONS.map((dim) => {
          const score = ratings[dim.key] ?? 8;
          const tierLabel = getDimensionTier(dim, score);

          // Accent colors
          let badgeBg = 'bg-[#8083ff]/15 text-[#c0c1ff] border-[#8083ff]/30';
          let dotBg = 'bg-[#c0c1ff]';
          let scoreColor = 'text-[#c0c1ff]';
          let sliderThumbClass = 'accent-primary-thumb';

          if (dim.accentColor === 'secondary') {
            badgeBg = 'bg-[#00a572]/15 text-[#4edea3] border-[#4edea3]/30';
            dotBg = 'bg-[#4edea3]';
            scoreColor = 'text-[#4edea3]';
            sliderThumbClass = 'accent-secondary-thumb';
          } else if (dim.accentColor === 'tertiary') {
            badgeBg = 'bg-[#ca8100]/20 text-[#ffb95f] border-[#ffb95f]/30';
            dotBg = 'bg-[#ffb95f]';
            scoreColor = 'text-[#ffb95f]';
            sliderThumbClass = 'accent-tertiary-thumb';
          }

          return (
            <div
              key={dim.key}
              id={`rating-card-${dim.key}`}
              className="bg-[#171f33] rounded-3xl p-5 shadow-md hover:shadow-lg transition-all border border-white/[0.04]"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      dim.accentColor === 'secondary'
                        ? 'bg-[#00a572]/20 text-[#4edea3]'
                        : dim.accentColor === 'tertiary'
                        ? 'bg-[#ca8100]/20 text-[#ffb95f]'
                        : 'bg-[#8083ff]/20 text-[#c0c1ff]'
                    }`}
                  >
                    {renderIcon(dim.iconName)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-[#dae2fd]">
                      {dim.title}
                    </h4>
                    <p className="text-xs text-[#c7c4d7] mt-0.5 leading-relaxed">
                      {dim.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 pl-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-2xl sm:text-3xl font-extrabold ${scoreColor}`}>
                      {score}
                    </span>
                    <span className="text-[11px] font-bold text-[#c7c4d7]">/10</span>
                  </div>
                </div>
              </div>

              {/* Tier Pill & Distinction Badge Notice */}
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
                  {tierLabel}
                </span>

                {score >= 9 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8083ff]/15 text-[#c0c1ff] text-[10px] font-bold border border-[#8083ff]/30">
                    <Sparkles className="w-3 h-3 text-[#ffb95f]" />
                    <span>
                      Qualifies for{' '}
                      {dim.key === 'empathy'
                        ? 'Empathy Luminary'
                        : dim.key === 'interaction'
                        ? 'Interaction Catalyst'
                        : `${dim.title} Excellence`}{' '}
                      Badge
                    </span>
                  </span>
                )}
              </div>

              {/* Range Slider */}
              <div className="relative flex flex-col gap-2">
                <input
                  aria-label={`${dim.title} rating`}
                  className={`w-full h-2 rounded-full cursor-pointer bg-[#222a3d] focus:outline-none ${sliderThumbClass}`}
                  max={10}
                  min={1}
                  step={1}
                  type="range"
                  value={score}
                  onChange={(e) => handleSliderChange(dim.key, parseInt(e.target.value, 10))}
                />

                {/* Tick numbers 1 to 10 */}
                <div className="flex justify-between px-1 text-[#c7c4d7] text-[11px] font-semibold opacity-70">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
                    <span
                      key={tick}
                      className={
                        tick === score
                          ? `${scoreColor} font-extrabold scale-110 opacity-100`
                          : ''
                      }
                    >
                      {tick}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rubric Anchors */}
              <div className="flex justify-between items-center mt-3 pt-3 bg-[#131b2e]/60 rounded-xl px-3 py-2 text-[#c7c4d7] text-xs border border-white/[0.03]">
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#908fa0]" />
                  {dim.lowAnchor}
                </span>
                <span className="flex items-center gap-1.5 text-right">
                  {dim.highAnchor}
                  <span className={`w-1 h-1 rounded-full ${dotBg}`} />
                </span>
              </div>
            </div>
          );
        })}

        {/* Additional "Other" Dimension for Manual Peer Evaluation */}
        {!includeOtherDimension ? (
          <button
            type="button"
            id="add-other-dimension-btn"
            onClick={() => {
              setIncludeOtherDimension(true);
              setRatings((prev) => ({ ...prev, other: prev.other ?? 8 }));
            }}
            className="w-full py-3.5 px-4 rounded-3xl border border-dashed border-[#8083ff]/40 bg-[#8083ff]/5 hover:bg-[#8083ff]/15 text-[#c0c1ff] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-sm"
          >
            <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform text-[#4edea3]" />
            <span>Add Additional "Other" Dimension for Manual Peer Evaluation</span>
          </button>
        ) : (
          <div
            id="rating-card-other"
            className="bg-[#171f33] rounded-3xl p-5 shadow-md border border-[#8083ff]/40 space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={otherDimensionTitle}
                      onChange={(e) => setOtherDimensionTitle(e.target.value)}
                      className="bg-[#131b2e] border border-white/[0.08] rounded-xl px-2.5 py-1 text-sm font-bold text-[#dae2fd] focus:outline-none focus:ring-1 focus:ring-[#8083ff] w-48 sm:w-64"
                      placeholder="Other: Custom Quality..."
                    />
                    <span className="px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-[10px] font-bold uppercase tracking-wider border border-[#8083ff]/30">
                      Manual Dimension
                    </span>
                  </div>
                  <p className="text-xs text-[#c7c4d7] mt-1">
                    Manual scoring for specific peer strengths: leadership, creative problem-solving, or UI craft.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#c0c1ff]">
                    {ratings.other ?? 8}
                  </span>
                  <span className="text-xs font-bold text-[#c7c4d7]">/10</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIncludeOtherDimension(false);
                    setRatings((prev) => {
                      const copy = { ...prev };
                      delete copy.other;
                      return copy;
                    });
                  }}
                  className="text-[10px] text-[#ffb4ab] hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="pt-2">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={ratings.other ?? 8}
                onChange={(e) => handleSliderChange('other', parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#222a3d] rounded-lg appearance-none cursor-pointer accent-[#8083ff]"
              />
              <div className="flex justify-between text-[11px] text-[#908fa0] px-1 mt-1.5 font-mono">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span
                    key={num}
                    className={
                      num === (ratings.other ?? 8)
                        ? 'text-[#c0c1ff] font-extrabold scale-110'
                        : ''
                    }
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            {/* Rubric Anchors */}
            <div className="flex justify-between items-center pt-2 text-xs text-[#c7c4d7] border-t border-white/[0.04]">
              <span>Needs development</span>
              <span>Exceptional standard</span>
            </div>
          </div>
        )}
      </div>

      {/* Anonymous Feedback & Endorsement Chips Section */}
      <div className="bg-[#171f33] rounded-3xl p-5 sm:p-6 shadow-md space-y-4 border border-white/[0.04]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-[#c0c1ff]" />
            <div>
              <h4 className="text-base font-bold text-[#dae2fd]">Constructive Peer Note</h4>
              <p className="text-xs text-[#c7c4d7]">
                Provide anonymous qualitative feedback to elevate your teammate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#131b2e] rounded-2xl border border-white/[0.05] self-start sm:self-auto">
            <button
              type="button"
              id="standard-feedback-mode-btn"
              onClick={() => setActiveFeedbackMode('standard')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeFeedbackMode === 'standard'
                  ? 'bg-[#8083ff] text-[#0d0096] shadow-sm'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd]'
              }`}
            >
              Standard Note
            </button>
            <button
              type="button"
              id="other-manual-feedback-mode-btn"
              onClick={() => setActiveFeedbackMode('other')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFeedbackMode === 'other'
                  ? 'bg-[#8083ff] text-[#0d0096] shadow-sm'
                  : 'text-[#c7c4d7] hover:text-[#dae2fd]'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Other (Manual Feedback)</span>
            </button>
          </div>
        </div>

        {/* Quick Endorsement Chips with "Other" */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#c7c4d7]">
              Tap to append quick kudos or add custom "Other" tag:
            </span>
          </div>
          <div className="flex flex-wrap gap-2" id="endorsement-chips">
            {quickKudos.map((chip) => {
              const Icon = chip.icon;
              const isSelected = chip.label === 'Other' ? showCustomTagInput : selectedTags.includes(chip.label);

              return (
                <button
                  key={chip.label}
                  id={`kudos-chip-${chip.label.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleToggleTag(chip.label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#8083ff] text-[#0d0096] border-[#8083ff] shadow-[0_0_12px_rgba(128,131,255,0.4)]'
                      : 'bg-[#222a3d] text-[#c7c4d7] hover:bg-[#2d3449] hover:text-[#dae2fd] border-white/[0.05]'
                  }`}
                  type="button"
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{chip.label}</span>
                </button>
              );
            })}

            {/* Render any additional custom tags */}
            {selectedTags
              .filter((t) => !['Quick Problem Solver', 'Great Listener', 'Dependable Teammate', 'Thorough Reviewer'].includes(t))
              .map((customTag) => (
                <span
                  key={customTag}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30 flex items-center gap-1.5"
                >
                  <span>{customTag}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== customTag))}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
          </div>

          {/* Inline input for custom "Other" tag */}
          {showCustomTagInput && (
            <form onSubmit={handleAddCustomTag} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="Enter custom 'Other' trait (e.g., Code Review Mentor, UI Polish, Calm Facilitator)..."
                className="flex-1 bg-[#131b2e] border border-[#8083ff]/40 rounded-xl px-3 py-1.5 text-xs text-[#dae2fd] placeholder:text-[#908fa0] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#8083ff] text-[#0d0096] text-xs font-bold hover:bg-[#c0c1ff] transition-all cursor-pointer shrink-0"
              >
                Add Tag
              </button>
              <button
                type="button"
                onClick={() => setShowCustomTagInput(false)}
                className="p-1.5 text-[#908fa0] hover:text-[#dae2fd] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Feedback Mode: Dedicated "Other" Manual Feedback Box */}
        {activeFeedbackMode === 'other' ? (
          <div className="bg-[#131b2e] rounded-2xl p-4 border border-[#8083ff]/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#c0c1ff] flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-[#4edea3]" />
                Dedicated Manual Feedback for {teammate.name.split(' ')[0]}
              </span>
              <span className="text-[11px] text-[#4edea3] font-semibold">
                Anonymous & Confidential
              </span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#c7c4d7] block mb-1">
                Feedback Focus or Area (Optional):
              </label>
              <input
                type="text"
                value={otherFeedbackTopic}
                onChange={(e) => setOtherFeedbackTopic(e.target.value)}
                placeholder="e.g., Code Architecture, Pair Programming, Standup Communication..."
                className="w-full bg-[#171f33] rounded-xl px-3 py-2 text-xs text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-[#c7c4d7]">
                  Manual Peer Feedback Note:
                </label>
                <span className="text-[10px] text-[#908fa0]">
                  {otherFeedbackNote.length} characters
                </span>
              </div>
              <textarea
                rows={3}
                value={otherFeedbackNote}
                onChange={(e) => setOtherFeedbackNote(e.target.value)}
                placeholder={`Write your candid, manual feedback for ${teammate.name.split(' ')[0]}... What worked well? Where could they expand their impact?`}
                className="w-full bg-[#171f33] rounded-xl p-3 text-xs text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff] resize-none"
              />
            </div>

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#908fa0]">Suggested prompts:</span>
              {[
                'Pair Programming Agility',
                'Clear Blocker Flagging',
                'Thoughtful PR Reviews',
                'Morale Booster in Crunch',
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    setOtherFeedbackTopic(prompt);
                    if (!otherFeedbackNote) {
                      setOtherFeedbackNote(
                        `Consistently demonstrated strong ${prompt.toLowerCase()} throughout our sprint milestones.`
                      );
                    }
                  }}
                  className="px-2 py-0.5 rounded-md bg-[#222a3d] hover:bg-[#2d3449] text-[10px] text-[#c7c4d7] hover:text-[#dae2fd] transition-colors cursor-pointer"
                >
                  +{prompt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
              <span className="text-[11px] text-[#c7c4d7]">
                Appends cleanly to overall encrypted peer review.
              </span>
              <button
                type="button"
                onClick={handleAppendOtherManualFeedback}
                disabled={!otherFeedbackNote.trim()}
                className="px-4 py-2 rounded-xl bg-[#8083ff] text-[#0d0096] text-xs font-bold hover:bg-[#c0c1ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Append to Review Note</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Note textarea input */
          <div className="relative">
            <textarea
              id="peer-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#131b2e] rounded-2xl p-3.5 text-[#dae2fd] placeholder:text-[#908fa0] text-sm focus:outline-none focus:ring-1 focus:ring-[#8083ff] transition-all shadow-inner resize-none border border-white/[0.05]"
              placeholder={`e.g. ${teammate.name.split(' ')[0]} was fantastic at untangling the Docker networking bug. Would love to see them speak up even more in faculty demos...`}
            />
            <div className="flex justify-between items-center mt-1 px-1">
              <span className="text-xs font-semibold text-[#4edea3] flex items-center gap-1">
                <Lock className="w-3 h-3" /> Identity encrypted in cohort database
              </span>
              <span
                className={`text-xs font-semibold ${
                  comment.length > 280 ? 'text-[#ffb4ab]' : 'text-[#c7c4d7]'
                }`}
              >
                {comment.length} / 280
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Impact Metric Preview Pill */}
      <div className="bg-gradient-to-r from-[#00a572]/20 to-[#8083ff]/20 rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-md border border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4edea3] flex items-center justify-center text-[#002113] shrink-0 shadow-md">
            <TrendingUp className="w-5 h-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#4edea3] uppercase tracking-wider">
              Estimated Peer Impact
            </span>
            <p className="text-base sm:text-lg font-extrabold text-[#dae2fd]">
              +{boostValue} Composite Score boost
            </p>
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-xs text-[#c7c4d7]">Target percentile</span>
          <span className="text-xs font-bold text-[#4edea3]">Top 15% in Cohort</span>
        </div>
      </div>

      {/* Sticky Action Submission Footer */}
      <div className="sticky bottom-20 inset-x-0 z-40 bg-[#0b1326]/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/[0.06] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <button
          id="save-draft-btn"
          onClick={handleSaveDraft}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#222a3d] text-[#dae2fd] hover:bg-[#2d3449] transition-all text-xs sm:text-sm font-semibold active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-white/[0.05]"
          type="button"
        >
          <Save className="w-4 h-4" />
          <span>Save Draft & Next Peer</span>
        </button>

        <button
          id="submit-peer-review-btn"
          onClick={handleSubmitReview}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#8083ff] to-[#494bd6] text-[#0d0096] text-xs sm:text-sm font-extrabold shadow-[0_4px_24px_rgba(128,131,255,0.45)] hover:shadow-[0_6px_28px_rgba(128,131,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span>
            Submit Rating & Proceed ({teammate.evaluationStep}/{teammate.totalEvaluations})
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
        </button>
      </div>

      {/* Submission Success Dialog */}
      {showSubmittedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-[#00a572]/20 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3] mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-[#dae2fd]">
                Rating Submitted & Encrypted
              </h3>
              <p className="text-xs text-[#c7c4d7]">
                Your evaluation for {teammate.name} has been cryptographically sealed. {teammate.name.split(' ')[0]} cannot view your scores, only their updated aggregate score.
              </p>
            </div>

            <div className="bg-[#131b2e] rounded-2xl p-4 space-y-2 text-xs border border-white/[0.04]">
              <div className="flex justify-between">
                <span className="text-[#c7c4d7]">Recipient:</span>
                <span className="font-semibold text-[#dae2fd]">{teammate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c7c4d7]">Average Rating:</span>
                <span className="font-bold text-[#4edea3]">{avgRating.toFixed(1)} / 10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c7c4d7]">Calculated Impact:</span>
                <span className="font-bold text-[#c0c1ff]">+{boostValue} Composite Boost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#c7c4d7]">Privacy Protocol:</span>
                <span className="font-mono text-[10px] text-[#4edea3] flex items-center gap-1">
                  <Lock className="w-3 h-3" /> BLIND-RSA-2048-AGG
                </span>
              </div>
            </div>

            <button
              id="proceed-next-peer-modal-btn"
              onClick={handleModalProceed}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#8083ff] to-[#494bd6] text-[#0d0096] font-bold text-sm shadow-[0_4px_20px_rgba(128,131,255,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              type="button"
            >
              <span>
                {activeTeammateIndex < teammates.length - 1
                  ? 'Continue to Next Teammate'
                  : 'Return to Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
