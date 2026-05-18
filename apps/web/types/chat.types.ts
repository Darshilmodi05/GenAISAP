export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error' | 'thinking';
  metadata?: {
    model?: string;
    tokens?: number;
    latency?: number;
    sapData?: any;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  settings: ChatSettings;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  sapIntegration: boolean;
  contextWindow: number;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
}

export interface ChatAction {
  type: 'send_message' | 'new_session' | 'delete_session' | 'update_settings' | 'clear_history';
  payload?: any;
}
