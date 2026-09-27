/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TabType,
  Teammate,
  PassivenessRecord,
  PlannerTodo,
  DiaryCertificatePost,
  NotificationItem,
  Subject,
  QualityBadge,
} from './types';
import {
  INITIAL_TEAMMATES,
  INITIAL_PASSIVENESS_RECORDS,
  INITIAL_TODOS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDENT_SUBJECTS,
  INITIAL_QUALITY_BADGES,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CreditScoreView } from './components/CreditScoreView';
import { PeerReviewView } from './components/PeerReviewView';
import { TeacherBridgeView } from './components/TeacherBridgeView';
import { TodoDiaryView } from './components/TodoDiaryView';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { StudentSubjectsModal } from './components/StudentSubjectsModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  // Navigation: credit-score (Feature 1 meter) | peer-review (Feature 1 scoring) | teacher-bridge (Feature 2) | todo-diary (Feature 3)
  const [activeTab, setActiveTab] = useState<TabType>('credit-score');

  // Student Initialized Subjects (Student-configured coursework for peer scoring and teacher bridges)
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_STUDENT_SUBJECTS);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);

  // AI Assistant Chatbot Modal state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Feature 1: Peer evaluation & social credit score (5 qualities, rate of 10, aggregated on a meter)
  const [teammates, setTeammates] = useState<Teammate[]>(INITIAL_TEAMMATES);
  const [activeTeammateIndex, setActiveTeammateIndex] = useState<number>(1);

  // Feature 2: Student passiveness & teacher upscaling records
  const [passivenessRecords, setPassivenessRecords] = useState<PassivenessRecord[]>(
    INITIAL_PASSIVENESS_RECORDS
  );

  // Feature 3: To-Do planner & LinkedIn-style certificate diary
  const [todos, setTodos] = useState<PlannerTodo[]>(INITIAL_TODOS);
  const [certificates, setCertificates] = useState<DiaryCertificatePost[]>(
    INITIAL_CERTIFICATES
  );

  // Notifications & Profile modal state
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [badges, setBadges] = useState<QualityBadge[]>(INITIAL_QUALITY_BADGES);

  // Dynamic calculation of aggregated Social Behavioural Credit Score out of 10
  // Average across all completed/active peer evaluations across the 5 qualities
  const calculateAggregatedScoreOutOf10 = (): number => {
    let totalScore = 0;
    let totalCount = 0;

    teammates.forEach((tm) => {
      if (tm.initialRatings) {
        Object.values(tm.initialRatings).forEach((val) => {
          totalScore += val;
          totalCount += 1;
        });
      }
    });

    if (totalCount === 0) return 8.6;
    return Number((totalScore / totalCount).toFixed(1));
  };

  const compositeScoreOutOf10 = calculateAggregatedScoreOutOf10();

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Student Initialized Subjects handlers
  const handleAddSubject = (newSubject: Omit<Subject, 'id'>) => {
    const subjectWithId: Subject = {
      ...newSubject,
      id: `subj-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, subjectWithId]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        title: `Subject Initialized: ${newSubject.code}`,
        message: `You initialized "${newSubject.name}" taught by ${newSubject.professorName}. Course is active in your teacher bridge.`,
        read: false,
        type: 'teacher',
      },
      ...prev,
    ]);
  };

  const handleUpdateSubject = (updatedSubject: Subject) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        title: `Subject Updated: ${updatedSubject.code}`,
        message: `Changes to "${updatedSubject.name}" (${updatedSubject.professorName}) have been saved.`,
        read: false,
        type: 'teacher',
      },
      ...prev,
    ]);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Feature 1: Save or Submit Peer Review
  const handleSaveTeammateReview = (
    teammateId: string,
    ratings: Record<string, number>,
    comment: string,
    tags: string[],
    isCompleted: boolean
  ) => {
    setTeammates((prev) =>
      prev.map((tm) => {
        if (tm.id === teammateId) {
          return {
            ...tm,
            initialRatings: ratings,
            initialComment: comment,
            initialTags: tags,
            status: isCompleted ? 'completed' : 'in-progress',
          };
        }
        return tm;
      })
    );

    if (isCompleted) {
      const targetTeammate = teammates.find((t) => t.id === teammateId);
      const name = targetTeammate ? targetTeammate.name : 'Peer';

      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          timestamp: 'Just now',
          title: `Peer Review Submitted for ${name}`,
          message:
            'Your anonymous ratings across the 5 qualities have been cryptographically aggregated into the cohort credit meter.',
          read: false,
          type: 'credit',
        },
        ...prev,
      ]);
    }
  };

  // Feature 2: Add Student Passiveness Reason
  const handleAddPassivenessRecord = (
    newRecord: Omit<PassivenessRecord, 'id' | 'status'>
  ) => {
    const recordWithId: PassivenessRecord = {
      ...newRecord,
      id: `pass-${Date.now()}`,
      status: 'pending-review',
    };

    setPassivenessRecords((prev) => [recordWithId, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        title: `Passiveness Feedback Sent to ${newRecord.professorName}`,
        message: `Your learning friction regarding "${newRecord.topic}" was privately sent to bridge the communication gap.`,
        read: false,
        type: 'teacher',
      },
      ...prev,
    ]);
  };

  // Feature 2: Simulate Teacher Upscaling Response
  const handleSimulateTeacherResponse = (recordId: string) => {
    setPassivenessRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: 'addressed-by-teacher',
            understandingRating: Math.min(5, rec.understandingRating + 2),
            teacherFeedback: {
              teacherName: rec.professorName,
              responseDate: 'Just now',
              actionTaken:
                'Upscaled upcoming lecture with visual walkthrough diagrams and dedicated 10-minute anonymous Q&A recap.',
              message:
                'I read your explanation and completely understand why this segment felt overwhelming. I have updated the slide deck with clear step-by-step visual analogies and will recap it at the start of next lecture.',
              supplementaryResource: 'Lecture Recap Slide Pack & Visual Cheat Sheet',
            },
          };
        }
        return rec;
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        title: 'Professor Followed Up & Upscaled Lecture',
        message: 'Your teacher reviewed your passiveness feedback and added targeted visual resources.',
        read: false,
        type: 'teacher',
      },
      ...prev,
    ]);
  };

  // Feature 3: To-Do Planner actions
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTodo = (newTodo: Omit<PlannerTodo, 'id' | 'completed'>) => {
    const todoWithId: PlannerTodo = {
      ...newTodo,
      id: `todo-${Date.now()}`,
      completed: false,
    };
    setTodos((prev) => [todoWithId, ...prev]);
  };

  // Feature 3: Certificate Post actions (LinkedIn style)
  const handleAddCertificate = (
    newCert: Omit<DiaryCertificatePost, 'id' | 'likesCount' | 'hasLiked' | 'createdAt'>
  ) => {
    const certWithId: DiaryCertificatePost = {
      ...newCert,
      id: `cert-${Date.now()}`,
      likesCount: 1,
      hasLiked: true,
      createdAt: 'Just now',
    };

    setCertificates((prev) => [certWithId, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        timestamp: 'Just now',
        title: 'Certificate Published to Diary',
        message: `Your verified credential "${newCert.title}" is now showcased in your academic achievement portfolio.`,
        read: false,
        type: 'security',
      },
      ...prev,
    ]);
  };

  const handleToggleLikeCert = (id: string) => {
    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newHasLiked = !c.hasLiked;
          return {
            ...c,
            hasLiked: newHasLiked,
            likesCount: newHasLiked ? c.likesCount + 1 : c.likesCount - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col antialiased selection:bg-[#8083ff] selection:text-[#0d0096] relative">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        unreadCount={unreadNotificationsCount}
        subjectsCount={subjects.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSubjects={() => setIsSubjectsOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 flex flex-col relative w-full pt-20 pb-16 bg-[#0b1326]">
        {/* Feature 1: Social Behavioural Credit Score Meter out of 10 */}
        {activeTab === 'credit-score' && (
          <CreditScoreView
            compositeScoreOutOf10={compositeScoreOutOf10}
            teammates={teammates}
            badges={badges}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {/* Feature 1 (Scoring Flow): Peer Review across the 5 qualities */}
        {activeTab === 'peer-review' && (
          <PeerReviewView
            teammates={teammates}
            activeTeammateIndex={activeTeammateIndex}
            onSelectTeammate={(idx) => setActiveTeammateIndex(idx)}
            onSaveTeammateReview={handleSaveTeammateReview}
          />
        )}

        {/* Feature 2: Student-Teacher Passiveness & Interaction Bridge */}
        {activeTab === 'teacher-bridge' && (
          <TeacherBridgeView
            records={passivenessRecords}
            subjects={subjects}
            onAddRecord={handleAddPassivenessRecord}
            onSimulateTeacherResponse={handleSimulateTeacherResponse}
            onOpenSubjectsModal={() => setIsSubjectsOpen(true)}
            onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
          />
        )}

        {/* Feature 3: To-Do & LinkedIn-Style Certificate Diary */}
        {activeTab === 'todo-diary' && (
          <TodoDiaryView
            todos={todos}
            certificates={certificates}
            badges={badges}
            onToggleTodo={handleToggleTodo}
            onAddTodo={handleAddTodo}
            onAddCertificate={handleAddCertificate}
            onToggleLikeCert={handleToggleLikeCert}
          />
        )}
      </main>

      {/* Floating AI Assistant Quick Trigger (Desktop & Mobile) */}
      <button
        id="floating-ai-assistant-btn"
        onClick={() => setIsAiAssistantOpen(true)}
        aria-label="Ask SynqUp AI Assistant"
        className="fixed bottom-24 right-5 sm:right-8 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-[#8083ff] to-[#4edea3] text-[#0d0096] font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-2xl shadow-[#8083ff]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 group"
        type="button"
      >
        <Sparkles className="w-4 h-4 text-[#0d0096] group-hover:rotate-12 transition-transform" />
        <span className="tracking-tight">AI Assistant</span>
      </button>

      {/* Fixed Bottom Navigation with the 4 tabs */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Drawers & Modals */}
      <StudentSubjectsModal
        isOpen={isSubjectsOpen}
        onClose={() => setIsSubjectsOpen(false)}
        subjects={subjects}
        onAddSubject={handleAddSubject}
        onUpdateSubject={handleUpdateSubject}
        onDeleteSubject={handleDeleteSubject}
      />

      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        subjects={subjects}
        compositeScore={compositeScoreOutOf10}
        activeTab={activeTab}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userScore={Math.round(compositeScoreOutOf10 * 100)}
        badges={badges}
      />
    </div>
  );
}
