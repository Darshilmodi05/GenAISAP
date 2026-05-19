import { useChat as useVercelChat } from 'ai/react';

/**
 * Enterprise Chat Hook
 * Powered by Vercel AI SDK and the Neural RAG Pipeline.
 */
export const useChat = () => {
  return useVercelChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Neural transmission complete:', message);
    },
    onError: (error) => {
      console.error('Neural uplink failure:', error);
    }
  });
};
