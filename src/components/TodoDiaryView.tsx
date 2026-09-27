import React, { useState, useRef } from 'react';
import {
  Award,
  CalendarCheck,
  Plus,
  CheckCircle2,
  Circle,
  ThumbsUp,
  MessageSquare,
  Share2,
  ExternalLink,
  Sparkles,
  Upload,
  Calendar,
  Tag,
  X,
  FileText,
  Clock,
  Check,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import { PlannerTodo, DiaryCertificatePost, QualityBadge } from '../types';
import { CertificatePdfExportModal } from './CertificatePdfExportModal';

interface TodoDiaryViewProps {
  todos: PlannerTodo[];
  certificates: DiaryCertificatePost[];
  onToggleTodo: (id: string) => void;
  onAddTodo: (newTodo: Omit<PlannerTodo, 'id' | 'completed'>) => void;
  onAddCertificate: (newCert: Omit<DiaryCertificatePost, 'id' | 'likesCount' | 'hasLiked' | 'createdAt'>) => void;
  onToggleLikeCert: (id: string) => void;
  badges?: QualityBadge[];
}

export const TodoDiaryView: React.FC<TodoDiaryViewProps> = ({
  todos,
  certificates,
  onToggleTodo,
  onAddTodo,
  onAddCertificate,
  onToggleLikeCert,
  badges = [],
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'diary' | 'planner'>('diary');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isPdfExportModalOpen, setIsPdfExportModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Todo form state
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDueDate, setTodoDueDate] = useState('');
  const [todoPriority, setTodoPriority] = useState<PlannerTodo['priority']>('medium');
  const [todoCategory, setTodoCategory] = useState<PlannerTodo['category']>('capstone');

  // Certificate Post form state
  const [certTitle, setCertTitle] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certIssueDate, setCertIssueDate] = useState('');
  const [certCredentialId, setCertCredentialId] = useState('');
  const [certContent, setCertContent] = useState('');
  const [certSkillsInput, setCertSkillsInput] = useState('');
  const [certImagePreview, setCertImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler (drag & drop and file picker)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;

    onAddTodo({
      title: todoTitle,
      dueDate: todoDueDate || 'This sprint',
      priority: todoPriority,
      category: todoCategory,
    });

    setTodoTitle('');
    setTodoDueDate('');
    setIsTodoModalOpen(false);
  };

  const handleCreateCertificatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certOrg.trim() || !certContent.trim()) return;

    const parsedSkills = certSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    onAddCertificate({
      title: certTitle,
      organization: certOrg,
      issueDate: certIssueDate || 'September 2025',
      credentialId: certCredentialId || `CERT-${Math.floor(10000 + Math.random() * 90000)}`,
      certificateImage: certImagePreview,
      content: certContent,
      skills: parsedSkills.length > 0 ? parsedSkills : ['Distributed Systems', 'Academic Achievement'],
    });

    // Reset
    setCertTitle('');
    setCertOrg('');
    setCertIssueDate('');
    setCertCredentialId('');
    setCertContent('');
    setCertSkillsInput('');
    setIsCertModalOpen(false);
  };

  const handleShareClick = (certTitleStr: string) => {
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2200);
  };

  const completedTodosCount = todos.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 space-y-6 pb-28 pt-2">
      {/* Toast notification */}
      {copiedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#171f33] border border-[#4edea3]/40 text-[#dae2fd] px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>Certificate credential link copied to clipboard!</span>
        </div>
      )}

      {/* Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-xs font-bold uppercase tracking-wider border border-[#8083ff]/30">
              Feature 3 • Portfolio & Planner
            </span>
            <span className="text-[#4edea3] text-xs font-semibold">• LinkedIn-Style</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#dae2fd] tracking-tight mt-1">
            To-Do Planner & Certificate Diary
          </h2>
          <p className="text-xs text-[#c7c4d7] mt-0.5">
            Document verified achievements, attach certificate credentials, and track sprint deadlines.
          </p>
        </div>

        <button
          id="export-pdf-summary-header-btn"
          onClick={() => setIsPdfExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#8083ff]/25 to-[#4edea3]/20 hover:from-[#8083ff]/35 hover:to-[#4edea3]/30 text-[#dae2fd] border border-[#8083ff]/40 text-xs font-bold transition-all shadow-md cursor-pointer self-start sm:self-auto shrink-0 group"
          type="button"
        >
          <Download className="w-4 h-4 text-[#4edea3] group-hover:translate-y-0.5 transition-transform" />
          <span>Export PDF Summary</span>
        </button>
      </div>

      {/* Dual Sub-Tab Switcher */}
      <div className="flex items-center p-1 rounded-2xl bg-[#171f33] border border-white/[0.05]">
        <button
          onClick={() => setActiveSubTab('diary')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'diary'
              ? 'bg-[#8083ff] text-[#0d0096] shadow-md'
              : 'text-[#c7c4d7] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          <Award className="w-4 h-4" />
          <span>Academic Certificate Diary</span>
        </button>

        <button
          onClick={() => setActiveSubTab('planner')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'planner'
              ? 'bg-[#8083ff] text-[#0d0096] shadow-md'
              : 'text-[#c7c4d7] hover:text-[#dae2fd]'
          }`}
          type="button"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Sprint To-Do Planner ({completedTodosCount}/{todos.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: DIARY & CERTIFICATES (LinkedIn Style Feed) */}
      {activeSubTab === 'diary' && (
        <div className="space-y-5">
          {/* Student Profile Quick Share Card (LinkedIn-style prompt) */}
          <div className="bg-[#171f33] rounded-3xl p-5 border border-white/[0.06] shadow-lg space-y-3">
            <div className="flex items-center gap-3">
              <img
                alt="Author avatar"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8083ff]/30"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChjQXfQf2sTEy8DHAUDgvzC4xhp8rbe4Nyd5sW8iMMzWCvEqt44gtNrA5ezldbKSsLTPxKpbHS9BjuXCAu605DhM3t_IlYTB5gOP88g7nt3nDbcRcFrkW4mFq6zAUhiLpH38Dx15l2Agm47U2REL7_PGN0dt0T2vfknO3qsCh3a5y5vXz2MVi8wT2b7aKbwNmUAijgkoa2vY2FdhD4sVcixpHWCo7c5pafZNqWQI6PsznjtxP_hFtn"
              />
              <button
                onClick={() => setIsCertModalOpen(true)}
                className="flex-1 bg-[#131b2e] hover:bg-[#222a3d] border border-white/[0.06] rounded-full py-3 px-4 text-xs sm:text-sm text-[#908fa0] text-left transition-all cursor-pointer flex items-center justify-between"
                type="button"
              >
                <span>Post a new certificate or project milestone...</span>
                <Award className="w-4 h-4 text-[#8083ff]" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04] text-xs font-semibold text-[#c7c4d7]">
              <span className="flex items-center gap-1.5 text-[#4edea3]">
                <CheckCircle2 className="w-4 h-4" /> Verified Credentials Feed
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPdfExportModalOpen(true)}
                  className="text-[#4edea3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  type="button"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="text-[#c0c1ff] hover:underline flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  <Plus className="w-3.5 h-3.5" /> Attach Certificate
                </button>
              </div>
            </div>
          </div>

          {/* Certificate Feed Posts */}
          <div className="space-y-5">
            {certificates.map((cert) => (
              <article
                key={cert.id}
                id={`certificate-post-${cert.id}`}
                className="bg-[#171f33] rounded-3xl p-5 sm:p-6 border border-white/[0.06] shadow-xl space-y-4"
              >
                {/* Post Author Bar */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Student"
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuChjQXfQf2sTEy8DHAUDgvzC4xhp8rbe4Nyd5sW8iMMzWCvEqt44gtNrA5ezldbKSsLTPxKpbHS9BjuXCAu605DhM3t_IlYTB5gOP88g7nt3nDbcRcFrkW4mFq6zAUhiLpH38Dx15l2Agm47U2REL7_PGN0dt0T2vfknO3qsCh3a5y5vXz2MVi8wT2b7aKbwNmUAijgkoa2vY2FdhD4sVcixpHWCo7c5pafZNqWQI6PsznjtxP_hFtn"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#dae2fd]">Anumitra Saha</h3>
                        <span className="text-[10px] text-[#4edea3] font-bold bg-[#00a572]/15 px-2 py-0.2 rounded-full border border-[#4edea3]/20">
                          CS Senior
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c7c4d7]">
                        {cert.organization} • {cert.createdAt}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-[#c0c1ff] bg-[#222a3d] px-2.5 py-1 rounded-full border border-white/[0.05]">
                    {cert.issueDate}
                  </span>
                </div>

                {/* Reflection text */}
                <p className="text-xs sm:text-sm text-[#dae2fd] leading-relaxed">
                  {cert.content}
                </p>

                {/* Certificate Attachment Card (LinkedIn style) */}
                <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#131b2e] shadow-inner">
                  <div className="relative aspect-[16/9] w-full bg-black/40 overflow-hidden">
                    <img
                      alt={cert.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      src={cert.certificateImage}
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#4edea3] text-[10px] font-bold flex items-center gap-1 border border-white/10">
                      <CheckCircle2 className="w-3 h-3" /> Cryptographically Verified
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8083ff] uppercase tracking-wider">
                        {cert.organization}
                      </span>
                      {cert.credentialId && (
                        <span className="text-[10px] font-mono text-[#c7c4d7]">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#dae2fd]">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-[#c7c4d7] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#ffb95f]" /> Issued: {cert.issueDate}
                    </p>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-semibold text-[#c7c4d7] bg-[#222a3d] px-2.5 py-1 rounded-full border border-white/[0.04]"
                    >
                      #{skill}
                    </span>
                  ))}
                </div>

                {/* LinkedIn style interaction reactions bar */}
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs font-semibold text-[#c7c4d7]">
                  <button
                    onClick={() => onToggleLikeCert(cert.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer ${
                      cert.hasLiked
                        ? 'text-[#4edea3] bg-[#00a572]/15'
                        : 'hover:bg-[#222a3d] hover:text-[#dae2fd]'
                    }`}
                    type="button"
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${cert.hasLiked ? 'fill-current' : ''}`}
                    />
                    <span>{cert.likesCount} Kudos</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsPdfExportModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#222a3d] text-[#c0c1ff] hover:text-[#dae2fd] transition-all cursor-pointer"
                      type="button"
                      title="Export as PDF Summary"
                    >
                      <Download className="w-3.5 h-3.5 text-[#4edea3]" />
                      <span className="hidden xs:inline">Export PDF</span>
                    </button>

                    <button
                      onClick={() => handleShareClick(cert.title)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#222a3d] hover:text-[#dae2fd] transition-all cursor-pointer"
                      type="button"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TO-DO EVENT PLANNER */}
      {activeSubTab === 'planner' && (
        <div className="space-y-4">
          {/* Progress Card */}
          <div className="bg-[#171f33] rounded-3xl p-5 border border-white/[0.06] shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">
                Sprint Milestone Tracker
              </span>
              <h3 className="text-lg font-bold text-[#dae2fd]">
                {completedTodosCount} of {todos.length} Tasks Finished
              </h3>
              <p className="text-xs text-[#c7c4d7] mt-0.5">
                Stay on top of code reviews, standup prep, and capstone deadlines
              </p>
            </div>

            <button
              onClick={() => setIsTodoModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#8083ff] text-[#0d0096] font-bold text-xs hover:bg-[#c0c1ff] active:scale-95 transition-all flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Todo Items List */}
          <div className="space-y-2.5">
            {todos.map((todo) => {
              const priorityColor =
                todo.priority === 'high'
                  ? 'text-[#ffb4ab] bg-[#93000a]/20 border-[#ffb4ab]/20'
                  : todo.priority === 'medium'
                  ? 'text-[#ffb95f] bg-[#ca8100]/20 border-[#ffb95f]/20'
                  : 'text-[#4edea3] bg-[#00a572]/20 border-[#4edea3]/20';

              return (
                <div
                  key={todo.id}
                  id={`todo-item-${todo.id}`}
                  onClick={() => onToggleTodo(todo.id)}
                  className={`bg-[#171f33] rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 cursor-pointer hover:border-white/10 ${
                    todo.completed
                      ? 'border-white/[0.02] opacity-60 bg-[#131b2e]'
                      : 'border-white/[0.05] shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        todo.completed
                          ? 'bg-[#4edea3] text-[#002113]'
                          : 'border-2 border-[#908fa0] hover:border-[#8083ff]'
                      }`}
                    >
                      {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>

                    <div className="min-w-0">
                      <h4
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          todo.completed
                            ? 'line-through text-[#c7c4d7]'
                            : 'text-[#dae2fd]'
                        }`}
                      >
                        {todo.title}
                      </h4>
                      <p className="text-[11px] text-[#c7c4d7] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#ffb95f]" /> Due: {todo.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${priorityColor}`}
                    >
                      {todo.priority}
                    </span>
                    <span className="text-[10px] text-[#c7c4d7] bg-[#222a3d] px-2 py-0.5 rounded-full capitalize">
                      {todo.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Publish Certificate Post (LinkedIn Style) */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#8083ff]" />
                <h3 className="text-lg font-bold text-[#dae2fd]">
                  Post Certificate to Academic Diary
                </h3>
              </div>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCertificatePost} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Certificate / Credential Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Cloud Certified Associate Cloud Engineer"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                    Issuing Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google Cloud / IEEE"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. September 2025"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Credential ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GCP-ACE-2025-8841"
                  value={certCredentialId}
                  onChange={(e) => setCertCredentialId(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>

              {/* Certificate Attachment Upload & Drag-and-drop */}
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Certificate Image Attachment
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropFile}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-[#8083ff] bg-[#131b2e] rounded-2xl p-4 text-center cursor-pointer transition-all space-y-2"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  {certImagePreview ? (
                    <div className="relative aspect-[16/9] w-full max-h-40 rounded-xl overflow-hidden mx-auto bg-black/40">
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover"
                        src={certImagePreview}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-white bg-black/70 px-3 py-1.5 rounded-full">
                          Click or drop to replace image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center justify-center text-[#c7c4d7]">
                      <Upload className="w-8 h-8 text-[#8083ff] mb-1" />
                      <span className="text-xs font-semibold text-[#dae2fd]">
                        Click to upload or drag & drop certificate image
                      </span>
                      <span className="text-[10px] text-[#908fa0] mt-0.5">
                        Supports PNG, JPG, WebP
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Reflection */}
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Achievement Reflection (LinkedIn Style)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your learning experience, key challenges overcome, and technical takeaways..."
                  value={certContent}
                  onChange={(e) => setCertContent(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff] resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Key Skills Tagged (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Architecture, Docker, Kubernetes, Raft"
                  value={certSkillsInput}
                  onChange={(e) => setCertSkillsInput(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#222a3d] text-[#dae2fd] text-xs font-semibold hover:bg-[#2d3449] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#8083ff] text-[#0d0096] text-xs font-bold shadow-[0_4px_16px_rgba(128,131,255,0.4)] hover:bg-[#c0c1ff] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Post Credential</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add To-Do Item */}
      {isTodoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h3 className="text-lg font-bold text-[#dae2fd]">Add Sprint Milestone</h3>
              <button
                onClick={() => setIsTodoModalOpen(false)}
                className="p-1 rounded-full text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTodo} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Benchmark gRPC throughput under 10k concurrent streams"
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                  Due Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tomorrow • 5:00 PM or Sep 23"
                  value={todoDueDate}
                  onChange={(e) => setTodoDueDate(e.target.value)}
                  className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                    Priority
                  </label>
                  <select
                    value={todoPriority}
                    onChange={(e) => setTodoPriority(e.target.value as PlannerTodo['priority'])}
                    className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] block mb-1">
                    Category
                  </label>
                  <select
                    value={todoCategory}
                    onChange={(e) => setTodoCategory(e.target.value as PlannerTodo['category'])}
                    className="w-full bg-[#131b2e] rounded-xl p-3 text-sm text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  >
                    <option value="capstone">Capstone</option>
                    <option value="lab">Lab Demo</option>
                    <option value="reading">Reading</option>
                    <option value="review">Peer Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTodoModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#222a3d] text-[#dae2fd] text-xs font-semibold hover:bg-[#2d3449] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#8083ff] text-[#0d0096] text-xs font-bold shadow-[0_4px_16px_rgba(128,131,255,0.4)] hover:bg-[#c0c1ff] transition-all cursor-pointer"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Certificate Diary PDF Export Modal (Powered by html2pdf.js) */}
      <CertificatePdfExportModal
        isOpen={isPdfExportModalOpen}
        onClose={() => setIsPdfExportModalOpen(false)}
        certificates={certificates}
        badges={badges}
      />
    </div>
  );
};
