export type TabType = 'credit-score' | 'peer-review' | 'teacher-bridge' | 'todo-diary';

export interface Teammate {
  id: string;
  studentId: string;
  name: string;
  avatarUrl: string;
  group: string;
  project: string;
  duration: string;
  evaluationStep: number;
  totalEvaluations: number;
  initialRatings: Record<string, number>;
  initialComment: string;
  initialTags: string[];
  status: 'draft' | 'completed' | 'in-progress';
}

export interface DimensionConfig {
  key: string;
  title: string;
  description: string;
  iconName: 'code' | 'calendar' | 'message-square' | 'users' | 'smile';
  accentColor: 'primary' | 'secondary' | 'tertiary';
  lowAnchor: string;
  highAnchor: string;
  tiers: {
    low: string;
    mid: string;
    high: string;
    top: string;
  };
}

export interface PassivenessRecord {
  id: string;
  courseName: string;
  professorName: string;
  professorAvatar: string;
  date: string;
  topic: string;
  reasonCategory:
    | 'Fast Pacing'
    | 'Hesitation to Ask in Front of Class'
    | 'Lack of Visual Analogy'
    | 'Prerequisite Gap'
    | 'Fear of Looking Incompetent'
    | 'Overwhelmed by Information';
  studentReason: string;
  understandingRating: number; // 1-5
  isAnonymous: boolean;
  status: 'pending-review' | 'addressed-by-teacher' | 'resolved';
  teacherFeedback?: {
    teacherName: string;
    responseDate: string;
    actionTaken: string;
    message: string;
    supplementaryResource?: string;
  };
}

export interface PlannerTodo {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: 'capstone' | 'lab' | 'reading' | 'review';
}

export interface DiaryCertificatePost {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialId?: string;
  certificateImage: string;
  content: string;
  skills: string[];
  likesCount: number;
  hasLiked: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  read: boolean;
  type: 'evaluation' | 'credit' | 'sprint' | 'security' | 'teacher';
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  professorName: string;
  professorAvatar?: string;
  semester: string;
  color: string;
  creditHours?: number;
  description?: string;
  status: 'active' | 'completed' | 'dropped';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedPrompt?: string;
}

export interface QualityBadge {
  id: string;
  qualityKey: 'tech_skills' | 'engagement' | 'interaction' | 'empathy' | 'state_of_mind';
  qualityTitle: string;
  name: string;
  description: string;
  criteria: string;
  thresholdScore: number;
  currentScore: number;
  isUnlocked: boolean;
  earnedDate?: string;
  iconName: 'heart' | 'message-square' | 'code' | 'calendar' | 'smile' | 'award' | 'sparkles' | 'shield';
  accentColor: string;
  tier: 'Diamond' | 'Gold' | 'Silver';
}

