import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, ChatSession, Message, ChatSettings } from '@/types/chat.types';

interface ChatStore extends ChatState {
  createSession: (title?: string) => string;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string | null) => void;
  sendMessage: (content: string, sessionId?: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => void;
  updateSettings: (sessionId: string, settings: Partial<ChatSettings>) => void;
  clearHistory: () => void;
  setIsTyping: (typing: boolean) => void;
}

const defaultSettings: ChatSettings = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
  sapIntegration: true,
  contextWindow: 8000,
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,
      isLoading: false,
      error: null,
      isTyping: false,

      createSession: (title?: string) => {
        const sessionId = `session_${Date.now()}`;
        const newSession: ChatSession = {
          id: sessionId,
          title: title || `Chat ${new Date().toLocaleDateString()}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          settings: defaultSettings,
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: sessionId,
        }));

        return sessionId;
      },

      deleteSession: (sessionId: string) => {
        set((state) => {
          const newSessions = state.sessions.filter(s => s.id !== sessionId);
          const newCurrentId = state.currentSessionId === sessionId 
            ? (newSessions.length > 0 ? newSessions[0].id : null)
            : state.currentSessionId;
          
          return {
            sessions: newSessions,
            currentSessionId: newCurrentId,
          };
        });
      },

      setCurrentSession: (sessionId: string | null) => {
        set({ currentSessionId: sessionId });
      },

      sendMessage: async (content: string, sessionId?: string) => {
        const targetSessionId = sessionId || get().currentSessionId;
        if (!targetSessionId) return;

        const userMessage: Message = {
          id: `msg_${Date.now()}`,
          content,
          role: 'user',
          timestamp: new Date(),
          status: 'sent',
        };

        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id === targetSessionId) {
              return {
                ...session,
                messages: [...session.messages, userMessage],
                updatedAt: new Date(),
              };
            }
            return session;
          });

          return { sessions, isLoading: true, isTyping: true };
        });

        try {
          const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: content, sessionId: targetSessionId }),
          });

          if (!response.ok) throw new Error('Failed to send message');

          const data = await response.json();
          
          const assistantMessage: Message = {
            id: `msg_${Date.now() + 1}`,
            content: data.response,
            role: 'assistant',
            timestamp: new Date(),
            status: 'sent',
            metadata: {
              model: data.model,
              tokens: data.tokens,
              latency: data.latency,
              sapData: data.sapData,
            },
          };

          set((state) => {
            const sessions = state.sessions.map(session => {
              if (session.id === targetSessionId) {
                return {
                  ...session,
                  messages: [...session.messages, assistantMessage],
                  updatedAt: new Date(),
                };
              }
              return session;
            });

            return { sessions, isLoading: false, isTyping: false };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send message',
            isLoading: false,
            isTyping: false,
          });
        }
      },

      updateSessionTitle: (sessionId: string, title: string) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { ...session, title, updatedAt: new Date() }
              : session
          ),
        }));
      },

      updateSettings: (sessionId: string, settings: Partial<ChatSettings>) => {
        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === sessionId
              ? { 
                  ...session, 
                  settings: { ...session.settings, ...settings },
                  updatedAt: new Date(),
                }
              : session
          ),
        }));
      },

      clearHistory: () => {
        set({ 
          sessions: [], 
          currentSessionId: null,
          error: null,
        });
      },

      setIsTyping: (typing: boolean) => {
        set({ isTyping: typing });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
      }),
    }
  )
);
