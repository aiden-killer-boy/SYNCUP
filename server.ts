import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      app: 'SynqUp',
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Server-side AI Chatbot endpoint using @google/genai
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // Construct system instruction with student and SynqUp domain context
      const systemInstruction = `You are the SynqUp AI Assistant, an empathetic, highly knowledgeable academic and peer-collaboration coach inside the SynqUp application.
SynqUp is a comprehensive student platform featuring:
1. Peer Social Behavioural Credit Score (0-10 meter) evaluating peers across 5 core qualities: Tech Skills, Engagement, Interaction, Empathy, and State of Mind.
2. Student-Teacher Interaction Bridge: Students initialize their own subjects, state candid hesitation or passiveness reasons anonymously to remove classroom communication gaps, allowing teachers to adapt pacing and upscale materials.
3. Academic To-Do Planner & LinkedIn-Style Certificate Diary with verified credential attachments.

Current Student Context:
- Student Name: ${context?.studentName || 'Anumitra Saha'}
- Composite Credit Score: ${context?.compositeScore || '8.6'} / 10
- Initialized Subjects: ${
        context?.subjects && Array.isArray(context?.subjects)
          ? context.subjects.map((s: any) => `${s.code}: ${s.name} (${s.professorName})`).join(', ')
          : 'CS-401 (Distributed Systems), CS-415 (Cloud Microservices), CS-380 (Advanced Algorithms), CS-490 (Capstone Project)'
      }

Your core responsibilities:
- Help students formulate constructive, candid, and articulate passiveness feedback to teachers without fear or ambiguity.
- Offer actionable tactics to elevate peer credit ratings across the 5 behavioral qualities (e.g. active code reviews, standup punctuality, lifting teammates, staying calm under pressure).
- Generate polished, professional LinkedIn-style accomplishment posts for newly earned certificates.
- Break down complex coursework into actionable to-do sprint items for their initialized subjects.
- Maintain a warm, encouraging, concise, and academically sharp tone. Keep answers clear, structured with bullet points where appropriate, and avoid generic clichés.`;

      if (!apiKey) {
        // Graceful fallback when API key is pending configuration
        const lowerMsg = message.toLowerCase();
        let fallbackReply = `Hello! I am your SynqUp AI Assistant. `;

        if (lowerMsg.includes('passiveness') || lowerMsg.includes('professor') || lowerMsg.includes('teacher') || lowerMsg.includes('hesitat')) {
          fallbackReply += `When communicating classroom passiveness to your professor, focus on the exact moment understanding broke down (e.g., 'At minute 25 when transitioning from basic consensus to log truncation, the lack of visual state diagram made it difficult to follow'). State whether an analogy, step-by-step flowchart, or recap would bridge the gap. Would you like me to tailor a draft for your professor?`;
        } else if (lowerMsg.includes('credit') || lowerMsg.includes('score') || lowerMsg.includes('empathy') || lowerMsg.includes('peer')) {
          fallbackReply += `To improve your peer credit score across the 5 qualities:
• Tech Skills: Provide thoughtful, detailed pull request feedback rather than quick approvals.
• Engagement: Consistently post daily async blockers before standups.
• Interaction: Ask clarifying questions that help other quiet peers feel safe speaking up.
• Empathy: Celebrate peers' breakthroughs and offer pair-debugging support.
• State of Mind: Keep a solution-focused attitude when test suites break during sprint crunches.`;
        } else if (lowerMsg.includes('linkedin') || lowerMsg.includes('certif') || lowerMsg.includes('diary')) {
          fallbackReply += `Here is a sample framework for your LinkedIn credential diary post:
1. Hook: 'Delighted to have completed [Credential Name] after [Duration] of hands-on practice!'
2. Key takeaways: Highlight 3 concrete architectural competencies learned.
3. Academic application: Explain how you are applying it to your SynqUp capstone group.
4. Gratitude: Tag teammates or mentors who collaborated with you.`;
        } else {
          fallbackReply += `I can help you articulate feedback for your professors in your initialized subjects, boost your peer ratings across the 5 social qualities, structure sprint to-dos, or polish LinkedIn certificate diary entries. What would you like to work on?`;
        }

        res.json({
          reply: fallbackReply,
          source: 'local_fallback',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const generateGeminiReply = async () => {
        const ai = new GoogleGenAI();

        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
        if (history && Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(item.content) }],
            });
          }
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const callPromise = ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 12000)
        );

        return Promise.race([callPromise, timeoutPromise]);
      };

      try {
        const response: any = await generateGeminiReply();
        const replyText =
          response.text ||
          "I'm here to support your SynqUp academic journey. How can I assist you further with your subjects or peer feedback?";

        res.json({
          reply: replyText,
          source: 'gemini',
          timestamp: new Date().toISOString(),
        });
      } catch (geminiErr: any) {
        console.warn('Gemini API notice, activating intelligent fallback:', geminiErr.message);

        const lowerMsg = message.toLowerCase();
        let fallbackReply = `[SynqUp Assistant] `;

        if (
          lowerMsg.includes('passiveness') ||
          lowerMsg.includes('professor') ||
          lowerMsg.includes('teacher') ||
          lowerMsg.includes('hesitat')
        ) {
          fallbackReply += `Here is a constructive draft for your professor:
"Dear Professor, during the recent lecture on ${context?.subjects?.[0]?.name || 'the coursework'}, I hesitated to speak up because the transition into advanced implementation felt very fast. A short visual analogy or step-by-step state transition flowchart would greatly clarify this concept for our study group."`;
        } else if (
          lowerMsg.includes('credit') ||
          lowerMsg.includes('score') ||
          lowerMsg.includes('empathy') ||
          lowerMsg.includes('peer')
        ) {
          fallbackReply += `To raise your peer credit score out of 10 across the 5 qualities:
1. Tech Skills: Provide thoughtful code review comments with test cases.
2. Engagement: Post daily async updates and arrive prepared for standups.
3. Interaction: Encourage quiet peers during discussions.
4. Empathy: Acknowledge teammate blockers and offer pair-debugging.
5. State of Mind: Maintain composure when sprint deliverables change.`;
        } else if (
          lowerMsg.includes('linkedin') ||
          lowerMsg.includes('certif') ||
          lowerMsg.includes('diary')
        ) {
          fallbackReply += `Here is an achievement draft ready for your certificate diary:
"Proud to have earned my new technical credential! Throughout this process, I gained deep hands-on expertise in production-grade system architectures, which I am actively putting to work in my ${context?.subjects?.[0]?.name || 'academic team'} coursework."`;
        } else {
          fallbackReply += `I am ready to help you formulate anonymous feedback for your professors across your ${context?.subjects?.length || 4} initialized subjects, advise on boosting your peer ratings (current score: ${context?.compositeScore || '8.6'}/10), or structure your sprint to-dos. What would you like to focus on?`;
        }

        res.json({
          reply: fallbackReply,
          source: 'fallback',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({
        error: error.message || 'Failed to process assistant request.',
        reply: "I encountered a momentary issue processing that thought. Let's try rephrasing or focusing on a specific subject!",
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SynqUp server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
