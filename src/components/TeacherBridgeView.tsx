import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Plus,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  UserCheck,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  X,
  Star,
  Pencil,
} from 'lucide-react';
import { PassivenessRecord, Subject } from '../types';

interface TeacherBridgeViewProps {
  records: PassivenessRecord[];
  subjects: Subject[];
  onAddRecord: (newRecord: Omit<PassivenessRecord, 'id' | 'status'>) => void;
  onSimulateTeacherResponse: (recordId: string) => void;
  onOpenSubjectsModal: () => void;
  onOpenAiAssistant?: () => void;
}

export const TeacherBridgeView: React.FC<TeacherBridgeViewProps> = ({
  records,
  subjects,
  onAddRecord,
  onSimulateTeacherResponse,
  onOpenSubjectsModal,
  onOpenAiAssistant,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'addressed' | 'pending'>('all');

  const defaultSubject = subjects[0];
  const initialCourseName = defaultSubject ? `${defaultSubject.code}: ${defaultSubject.name}` : 'CS-401: Distributed Systems';
  const initialProfName = defaultSubject ? defaultSubject.professorName : 'Prof. Marcus Sterling';

  // Form state
  const [courseName, setCourseName] = useState(initialCourseName);
  const [professorName, setProfessorName] = useState(initialProfName);
  const [topic, setTopic] = useState('');
  const [reasonCategory, setReasonCategory] = useState<PassivenessRecord['reasonCategory']>(
    'Hesitation to Ask in Front of Class'
  );
  const [studentReason, setStudentReason] = useState('');
  const [understandingRating, setUnderstandingRating] = useState<number>(2);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleCourseSelect = (cName: string) => {
    setCourseName(cName);
    const match = subjects.find((s) => `${s.code}: ${s.name}` === cName || s.name === cName);
    if (match) setProfessorName(match.professorName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !studentReason.trim()) return;

    const matchedSubject = subjects.find(
      (s) => `${s.code}: ${s.name}` === courseName || s.name === courseName
    );

    onAddRecord({
      courseName,
      professorName,
      professorAvatar:
        matchedSubject?.professorAvatar ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      date: 'Today, Lecture',
      topic,
      reasonCategory,
      studentReason,
      understandingRating,
      isAnonymous,
    });

    // Reset and close
    setTopic('');
    setStudentReason('');
    setUnderstandingRating(2);
    setIsModalOpen(false);
  };

  const filteredRecords = records.filter((r) => {
    if (selectedFilter === 'addressed') return r.status === 'addressed-by-teacher';
    if (selectedFilter === 'pending') return r.status === 'pending-review';
    return true;
  });

  const totalRecords = records.length;
  const addressedCount = records.filter((r) => r.status === 'addressed-by-teacher').length;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-6 pb-28 pt-2">
      {/* Header Context */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-xs font-bold uppercase tracking-wider border border-[#8083ff]/30">
              Student-Teacher Bridge
            </span>
            <span className="text-[#4edea3] text-xs font-semibold">• Active Feedback Loop</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight mt-1">
            Student Passiveness & Interaction Store
          </h2>
          <p className="text-xs text-[#c7c4d7] mt-0.5">
            State why you held back in class so professors can understand your blockers and upscale teaching.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-[#8083ff] text-[#0d0096] font-bold text-xs hover:bg-[#c0c1ff] active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            type="button"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">State Reason</span>
            <span className="sm:hidden">Share</span>
          </button>
        </div>
      </div>

      {/* Student-Initialized Coursework Shelf */}
      <div className="bg-[#171f33] rounded-3xl p-4 sm:p-5 border border-white/[0.06] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8083ff]" />
            <span className="text-xs font-bold text-[#dae2fd] uppercase tracking-wider">
              Student Initialized Subjects ({subjects.length})
            </span>
            <span className="text-[10px] text-[#4edea3] font-semibold bg-[#4edea3]/10 px-2 py-0.2 rounded-full">
              Self-Configured
            </span>
          </div>
          <p className="text-xs text-[#c7c4d7]">
            Active coursework initialized by you for peer scoring and anonymous lecture feedback.
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={onOpenSubjectsModal}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{
                  backgroundColor: `${s.color}15`,
                  color: s.color,
                  borderColor: `${s.color}35`,
                }}
                title="Click to edit subject"
                type="button"
              >
                <span>{s.code}: {s.name}</span>
                <Pencil className="w-3 h-3 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenSubjectsModal}
          className="px-3.5 py-2 rounded-full bg-[#222a3d] hover:bg-[#2d3449] text-[#c0c1ff] hover:text-[#dae2fd] text-xs font-semibold border border-white/[0.06] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          type="button"
        >
          <Pencil className="w-3.5 h-3.5 text-[#8083ff]" />
          <span>Edit / Manage Subjects</span>
        </button>
      </div>

      {/* Communication Gap Reduction Telemetry Bento */}
      <div className="bg-[#171f33] rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-white/[0.06]">
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#00a572]/10 blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-[#4edea3] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" /> Communication Gap Metrics
            </span>
            <span className="text-xs text-[#c7c4d7]">
              {addressedCount} of {totalRecords} Reasons Addressed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#131b2e] rounded-2xl p-3.5 border border-white/[0.04] text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#4edea3] font-mono">
                -42%
              </span>
              <p className="text-[10px] sm:text-xs text-[#c7c4d7] mt-0.5">
                Classroom Silence Gap
              </p>
            </div>

            <div className="bg-[#131b2e] rounded-2xl p-3.5 border border-white/[0.04] text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#8083ff] font-mono">
                +1.8★
              </span>
              <p className="text-[10px] sm:text-xs text-[#c7c4d7] mt-0.5">
                Post-Upscale Comprehension
              </p>
            </div>

            <div className="bg-[#131b2e] rounded-2xl p-3.5 border border-white/[0.04] text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#ffb95f] font-mono">
                100%
              </span>
              <p className="text-[10px] sm:text-xs text-[#c7c4d7] mt-0.5">
                Psychological Safety
              </p>
            </div>
          </div>

          <p className="text-xs text-[#c7c4d7] leading-relaxed">
            When students share hesitation reasons anonymously, teachers adapt lecture pacing,
            introduce visual flowcharts, and clarify confusing points before exams.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['all', 'addressed', 'pending'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-[#8083ff] text-[#0d0096] border-[#8083ff] shadow-sm'
                  : 'bg-[#171f33] text-[#c7c4d7] hover:bg-[#222a3d] border-white/[0.04]'
              }`}
              type="button"
            >
              {filter === 'all'
                ? 'All Reasons'
                : filter === 'addressed'
                ? 'Teacher Addressed'
                : 'Pending Follow-up'}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#c7c4d7] hidden sm:block">
          {filteredRecords.length} records
        </span>
      </div>

      {/* Passiveness & Teacher Upscaling Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-[#171f33] rounded-3xl p-8 text-center border border-white/[0.04]">
            <p className="text-sm text-[#c7c4d7]">No feedback records in this filter.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              id={`passiveness-record-${record.id}`}
              className="bg-[#171f33] rounded-3xl p-5 sm:p-6 border border-white/[0.05] shadow-md space-y-4 transition-all hover:border-white/10"
            >
              {/* Record Header: Course, Prof, Date, Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    alt={record.professorName}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-white/10"
                    src={record.professorAvatar}
                  />
                  <div>
                    <span className="text-[11px] font-bold text-[#4edea3]">
                      {record.courseName}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#dae2fd]">
                      {record.topic}
                    </h3>
                    <p className="text-xs text-[#c7c4d7]">
                      {record.professorName} • {record.date}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {record.status === 'addressed-by-teacher' ? (
                    <span className="px-3 py-1 rounded-full bg-[#00a572]/20 text-[#4edea3] text-[11px] font-bold border border-[#4edea3]/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Teacher Upscaled
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-[#ca8100]/20 text-[#ffb95f] text-[11px] font-bold border border-[#ffb95f]/30 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending Follow-up
                      </span>
                      <button
                        onClick={() => onSimulateTeacherResponse(record.id)}
                        className="text-[10px] text-[#c0c1ff] hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                        type="button"
                      >
                        <Sparkles className="w-3 h-3 text-[#8083ff]" /> Simulate Upscale
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reason Category & Student Candid Statement */}
              <div className="bg-[#131b2e] rounded-2xl p-4 border border-white/[0.04] space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ca8100]/15 text-[#ffb95f] text-[11px] font-semibold border border-[#ffb95f]/20 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Reason: {record.reasonCategory}
                  </span>

                  <div className="flex items-center gap-2 text-xs text-[#c7c4d7]">
                    <span>Understanding:</span>
                    <div className="flex text-[#ffb95f]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= record.understandingRating ? 'fill-current' : 'opacity-30'
                          }`}
                        />
                      ))}
                    </div>
                    {record.isAnonymous && (
                      <span className="text-[10px] text-[#4edea3] font-bold bg-[#00a572]/15 px-2 py-0.5 rounded-full">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#c7c4d7] uppercase tracking-wider block mb-1">
                    Why I Held Back in Class:
                  </span>
                  <p className="text-xs sm:text-sm text-[#dae2fd] leading-relaxed italic bg-[#0b1326]/50 p-3 rounded-xl border border-white/[0.02]">
                    "{record.studentReason}"
                  </p>
                </div>
              </div>

              {/* Teacher Response Card (if addressed) */}
              {record.teacherFeedback && (
                <div className="bg-gradient-to-r from-[#00a572]/15 to-[#8083ff]/15 rounded-2xl p-4 border border-[#4edea3]/30 space-y-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#4edea3] text-[#002113] flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-[#4edea3]">
                        {record.teacherFeedback.teacherName} responded ({record.teacherFeedback.responseDate}):
                      </span>
                    </div>
                  </div>

                  {/* Action Taken */}
                  <div className="bg-[#131b2e]/90 p-3 rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] font-bold text-[#c0c1ff] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-[#ffb95f]" /> Instructional Action Taken to Bridge Gap:
                    </span>
                    <p className="text-xs font-semibold text-[#dae2fd]">
                      {record.teacherFeedback.actionTaken}
                    </p>
                  </div>

                  {/* Teacher Personal Note */}
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    "{record.teacherFeedback.message}"
                  </p>

                  {record.teacherFeedback.supplementaryResource && (
                    <div className="pt-1 flex items-center gap-1.5 text-xs text-[#4edea3] font-semibold">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Attached: {record.teacherFeedback.supplementaryResource}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: State Passiveness Reason Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-[#8083ff]" />
                <h3 className="text-lg font-bold text-[#dae2fd]">
                  Share Passiveness / Hesitation Reason
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Course selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#c7c4d7]">
                    Course & Professor (Student-Initialized)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onOpenSubjectsModal();
                    }}
                    className="text-[11px] text-[#c0c1ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Initialize New Course
                  </button>
                </div>
                <select
                  value={courseName}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={`${s.code}: ${s.name}`}>
                      {s.code}: {s.name} ({s.professorName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lecture topic */}
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Specific Concept / Lecture Segment
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Snapshot algorithm, Raft leader election, etc."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>

              {/* Reason category */}
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Why Did You Stay Passive? (Primary Friction)
                </label>
                <select
                  value={reasonCategory}
                  onChange={(e) =>
                    setReasonCategory(e.target.value as PassivenessRecord['reasonCategory'])
                  }
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                >
                  <option value="Hesitation to Ask in Front of Class">
                    Hesitation to Ask in Front of Class (Fear of holding up peers)
                  </option>
                  <option value="Fast Pacing">
                    Fast Pacing (Could not keep up with notes or demo)
                  </option>
                  <option value="Lack of Visual Analogy">
                    Lack of Visual Analogy (Too abstract/purely symbolic)
                  </option>
                  <option value="Prerequisite Gap">
                    Prerequisite Gap (Felt missing background fundamentals)
                  </option>
                  <option value="Fear of Looking Incompetent">
                    Fear of Looking Incompetent (Perceived everyone else understood)
                  </option>
                  <option value="Overwhelmed by Information">
                    Overwhelmed by Information Density
                  </option>
                </select>
              </div>

              {/* Detailed reason */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#c7c4d7]">
                    Candid Explanation & What Would Help
                  </label>
                  {onOpenAiAssistant && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        onOpenAiAssistant();
                      }}
                      className="text-[11px] text-[#c0c1ff] hover:text-white font-medium flex items-center gap-1 bg-[#8083ff]/20 px-2 py-0.5 rounded-full border border-[#8083ff]/30 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#8083ff]" />
                      <span>Draft with AI Assistant</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell your professor what specific moment made you freeze or stay silent, and what explanation style or visual would help you bridge the gap..."
                  value={studentReason}
                  onChange={(e) => setStudentReason(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff] resize-none"
                />
              </div>

              {/* Understanding rating 1-5 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#c7c4d7]">
                    Current Understanding Rating
                  </label>
                  <span className="text-xs font-bold text-[#ffb95f]">
                    {understandingRating} / 5 Stars
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={understandingRating}
                  onChange={(e) => setUnderstandingRating(parseInt(e.target.value, 10))}
                  className="w-full accent-tertiary-thumb"
                />
              </div>

              {/* Anonymous toggle */}
              <div className="flex items-center justify-between p-3 bg-[#131b2e] rounded-xl border border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#4edea3]" />
                  <div>
                    <span className="text-xs font-bold text-[#dae2fd] block">
                      Strictly Anonymous Mode
                    </span>
                    <span className="text-[11px] text-[#c7c4d7]">
                      Professor only sees the learning feedback, not your identity
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-[#4edea3] rounded cursor-pointer"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#222a3d] text-[#dae2fd] text-xs font-semibold hover:bg-[#2d3449] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#8083ff] text-[#0d0096] text-xs font-bold shadow-[0_4px_16px_rgba(128,131,255,0.4)] hover:bg-[#c0c1ff] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Professor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
