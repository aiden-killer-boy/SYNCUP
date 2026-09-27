import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  X,
  RotateCcw,
  Copy,
  Check,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Award,
  Shield,
  Loader2,
} from 'lucide-react';
import { ChatMessage, Subject } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  compositeScore: number;
  activeTab: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `Hello! I am your SynqUp AI Assistant. I am here to help you navigate academic teamwork, formulate constructive passiveness feedback for your professors, elevate your peer credit scores across the 5 core qualities, and polish your achievement diary.

How can I support your coursework today?`,
    timestamp: 'Just now',
  },
];

const SUGGESTED_PROMPTS = [
  {
    label: 'Draft Teacher Note',
    icon: MessageSquare,
    prompt: 'Help me draft an anonymous passiveness note for my professor explaining why Raft log truncation felt confusing in class.',
  },
  {
    label: 'Boost Peer Score',
    icon: TrendingUp,
    prompt: 'What concrete actions can I take this week to improve my Empathy and Interaction scores on the peer meter?',
  },
  {
    label: 'LinkedIn Post',
    icon: Award,
    prompt: 'Write a professional, LinkedIn-style achievement post for my AWS Solutions Architect certification.',
  },
  {
    label: 'Sprint Planning',
    icon: BookOpen,
    prompt: 'Suggest a high-impact sprint to-do checklist for our Capstone Distributed Systems project.',
  },
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  subjects,
  compositeScore,
  activeTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          context: {
            studentName: 'Anumitra Saha',
            compositeScore: compositeScore.toFixed(1),
            subjects: subjects.map((s) => ({
              code: s.code,
              name: s.name,
              professorName: s.professorName,
              semester: s.semester,
            })),
            activeTab,
          },
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || data.error || 'I am ready to help you continue.',
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content:
          "I'm currently assisting your study session offline. To elevate your peer score or draft feedback, remember to highlight specific blockers with actionable solutions!",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages(DEFAULT_MESSAGES);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#171f33] border border-white/[0.08] rounded-3xl max-w-2xl w-full h-[88vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-[#131b2e] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8083ff] to-[#4edea3] flex items-center justify-center text-[#0d0096] shadow-lg shadow-[#8083ff]/20">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4edea3] ring-2 ring-[#131b2e] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[#dae2fd] flex items-center gap-1.5">
                  SynqUp AI Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#8083ff]/20 text-[#c0c1ff] text-[10px] font-extrabold uppercase tracking-wider border border-[#8083ff]/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-[#c7c4d7]">
                Academic coach for peer credits, teacher bridges & portfolio writing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="p-2 rounded-xl text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer transition-colors"
              title="Reset conversation"
              type="button"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#c7c4d7] hover:text-[#dae2fd] hover:bg-[#222a3d] cursor-pointer transition-colors"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Context Banner */}
        <div className="px-4 py-2 bg-[#0b1326]/60 border-b border-white/[0.03] flex items-center justify-between text-[11px] text-[#c7c4d7] shrink-0 overflow-x-auto">
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#4edea3]" />
              Peer Credit: <strong className="text-[#dae2fd]">{compositeScore.toFixed(1)}/10</strong>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#8083ff]" />
              Subjects: <strong className="text-[#dae2fd]">{subjects.length} Initialized</strong>
            </span>
          </div>
          <span className="text-[10px] text-[#4edea3] font-semibold bg-[#4edea3]/10 px-2 py-0.5 rounded-full hidden sm:inline-block">
            Auto-Grounded in Student Data
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-[#8083ff]/20 text-[#8083ff] flex items-center justify-center shrink-0 border border-[#8083ff]/30 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-[#131b2e] border border-white/[0.06] text-[#dae2fd]'
                      : 'bg-[#8083ff] text-[#0d0096] font-medium shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {isAi && (
                    <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#908fa0]">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="opacity-60 group-hover:opacity-100 hover:text-[#dae2fd] flex items-center gap-1 transition-opacity cursor-pointer"
                        type="button"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#4edea3]" />
                            <span className="text-[#4edea3]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#8083ff]/20 text-[#8083ff] flex items-center justify-center shrink-0 border border-[#8083ff]/30">
                <Loader2 className="w-4 h-4 animate-spin text-[#8083ff]" />
              </div>
              <div className="bg-[#131b2e] border border-white/[0.06] rounded-2xl p-3.5 text-xs text-[#c7c4d7] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8083ff] animate-ping" />
                SynqUp AI is thinking & formulating response...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="p-3 bg-[#131b2e]/80 border-t border-white/[0.04] shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {SUGGESTED_PROMPTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  className="px-3 py-1.5 rounded-full bg-[#222a3d]/80 hover:bg-[#8083ff]/20 hover:border-[#8083ff]/40 text-[#c0c1ff] border border-white/[0.04] flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium transition-all active:scale-95 cursor-pointer shrink-0"
                  type="button"
                >
                  <Icon className="w-3 h-3 text-[#8083ff]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-3 sm:p-4 bg-[#131b2e] border-t border-white/[0.06] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Help draft feedback for Prof. Sterling', 'Improve my empathy score')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#0b1326] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#dae2fd] placeholder:text-[#908fa0] border border-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[#8083ff] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="w-11 h-11 rounded-2xl bg-[#8083ff] text-[#0d0096] flex items-center justify-center hover:bg-[#c0c1ff] active:scale-95 transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
