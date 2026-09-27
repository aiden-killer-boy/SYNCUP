import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Calendar,
  Layers,
  Palette,
  Pencil,
  Check,
} from 'lucide-react';
import { Subject } from '../types';

interface StudentSubjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddSubject: (newSubject: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (updatedSubject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

const COLOR_OPTIONS = [
  { label: 'Indigo', value: '#8083ff' },
  { label: 'Emerald', value: '#4edea3' },
  { label: 'Amber', value: '#ffb95f' },
  { label: 'Sky', value: '#38bdf8' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Purple', value: '#a855f7' },
];

export const StudentSubjectsModal: React.FC<StudentSubjectsModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);

  // Form state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [professorName, setProfessorName] = useState('');
  const [semester, setSemester] = useState('Fall 2025');
  const [creditHours, setCreditHours] = useState<number>(4);
  const [color, setColor] = useState('#8083ff');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'dropped'>('active');

  if (!isOpen) return null;

  const handleStartEdit = (subj: Subject) => {
    setEditingSubjectId(subj.id);
    setCode(subj.code);
    setName(subj.name);
    setProfessorName(subj.professorName);
    setSemester(subj.semester);
    setCreditHours(subj.creditHours || 3);
    setColor(subj.color || '#8083ff');
    setDescription(subj.description || '');
    setStatus(subj.status || 'active');
    setIsInitializing(true);
  };

  const handleCancel = () => {
    setEditingSubjectId(null);
    setCode('');
    setName('');
    setProfessorName('');
    setDescription('');
    setStatus('active');
    setIsInitializing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !professorName.trim()) return;

    if (editingSubjectId) {
      onUpdateSubject({
        id: editingSubjectId,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        professorName: professorName.trim(),
        semester: semester.trim(),
        color,
        creditHours,
        description: description.trim(),
        status,
      });
    } else {
      onAddSubject({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        professorName: professorName.trim(),
        semester: semester.trim(),
        color,
        creditHours,
        description: description.trim(),
        status: 'active',
      });
    }

    handleCancel();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8083ff]/20 text-[#c0c1ff] flex items-center justify-center border border-[#8083ff]/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#dae2fd]">
                Student Initialized Subjects
              </h3>
              <p className="text-xs text-[#c7c4d7]">
                Initialize, edit, and manage your enrolled coursework for peer credits and teacher bridges.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer transition-colors"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Count bar */}
        <div className="flex items-center justify-between shrink-0 bg-[#131b2e] p-3 rounded-2xl border border-white/[0.04]">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#4edea3]">{subjects.length} Subjects Initialized</span>
            <span className="text-[#908fa0]">• Fully Student Editable</span>
          </div>

          {!isInitializing ? (
            <button
              onClick={() => {
                setEditingSubjectId(null);
                setCode('');
                setName('');
                setProfessorName('');
                setDescription('');
                setStatus('active');
                setIsInitializing(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#8083ff] text-[#0d0096] text-xs font-bold hover:bg-[#c0c1ff] active:scale-95 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              type="button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Initialize New Subject</span>
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="px-3 py-1 rounded-full bg-[#222a3d] text-[#c7c4d7] hover:text-[#dae2fd] text-xs font-semibold cursor-pointer"
              type="button"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* Form to Initialize or Edit Subject */}
          {isInitializing && (
            <form
              onSubmit={handleSubmit}
              className="bg-[#131b2e] rounded-2xl p-4 sm:p-5 border border-[#8083ff]/40 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#c0c1ff] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8083ff]" />
                  {editingSubjectId ? `Edit Subject: ${code || 'Coursework'}` : 'Subject Initialization Setup'}
                </span>
                <span className="text-[10px] text-[#4edea3] font-semibold bg-[#4edea3]/10 px-2 py-0.5 rounded-full">
                  {editingSubjectId ? 'Editing Mode' : 'Student Authoritative'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Subject / Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-401, MATH-310"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Subject Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Systems"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Professor / Instructor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Marcus Sterling"
                    value={professorName}
                    onChange={(e) => setProfessorName(e.target.value)}
                    className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Credits
                  </label>
                  <select
                    value={creditHours}
                    onChange={(e) => setCreditHours(Number(e.target.value))}
                    className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  >
                    <option value={1}>1 Credit</option>
                    <option value={2}>2 Credits</option>
                    <option value={3}>3 Credits</option>
                    <option value={4}>4 Credits</option>
                    <option value={5}>5 Credits</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Course Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'active' | 'completed' | 'dropped')}
                    className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff]"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                    Badge Color
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`w-6 h-6 rounded-full border transition-transform ${
                          color === c.value ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: c.value, borderColor: 'rgba(255,255,255,0.2)' }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#c7c4d7] block mb-1">
                  Learning Objectives / Syllabus Focus
                </label>
                <textarea
                  rows={2}
                  placeholder="Key topics, lab modules, or peer collaboration focus for this course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0b1326] rounded-xl p-2.5 text-xs text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-full bg-[#222a3d] text-[#c7c4d7] text-xs font-semibold hover:text-[#dae2fd] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#8083ff] text-[#0d0096] text-xs font-bold hover:bg-[#c0c1ff] active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  {editingSubjectId ? 'Update Subject' : 'Save Subject'}
                </button>
              </div>
            </form>
          )}

          {/* List of Student's Initialized Subjects */}
          <div className="space-y-3">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                id={`subject-card-${subj.id}`}
                className="bg-[#131b2e] rounded-2xl p-4 border border-white/[0.05] hover:border-white/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm"
                    style={{
                      backgroundColor: `${subj.color}20`,
                      color: subj.color,
                      border: `1px solid ${subj.color}40`,
                    }}
                  >
                    {subj.code.split('-')[1] || subj.code.slice(0, 4)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${subj.color}25`,
                          color: subj.color,
                        }}
                      >
                        {subj.code}
                      </span>
                      <h4 className="text-sm font-bold text-[#dae2fd]">{subj.name}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                        subj.status === 'completed' ? 'bg-[#ffb95f]/15 text-[#ffb95f]' : 'bg-[#4edea3]/10 text-[#4edea3]'
                      }`}>
                        {subj.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#c7c4d7]">
                      Instructor: <span className="text-[#dae2fd] font-medium">{subj.professorName}</span> • {subj.semester} • {subj.creditHours || 3} Credits
                    </p>

                    {subj.description && (
                      <p className="text-xs text-[#908fa0] leading-relaxed pt-0.5 line-clamp-2">
                        {subj.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                  <button
                    onClick={() => handleStartEdit(subj)}
                    className="px-3 py-1.5 rounded-xl bg-[#222a3d] text-[#c0c1ff] hover:text-[#dae2fd] hover:bg-[#2d3449] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Edit Course Details"
                    type="button"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#8083ff]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteSubject(subj.id)}
                    className="p-2 rounded-xl text-[#908fa0] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-colors cursor-pointer"
                    title="Remove Initialized Subject"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/[0.05] flex justify-between items-center shrink-0 text-[11px] text-[#c7c4d7]">
          <span>Initialized subjects automatically synchronize with the Teacher Bridge and AI Assistant.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#222a3d] text-[#dae2fd] font-semibold hover:bg-[#2d3449] cursor-pointer"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
