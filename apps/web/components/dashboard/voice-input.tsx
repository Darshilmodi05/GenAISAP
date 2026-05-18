'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { transcribeAudio } from '@/lib/ai/assembly';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, disabled }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder | null>(null);
  const audioChunks = React.useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        audioChunks.current = [];
        
        setIsProcessing(true);
        try {
          const text = await transcribeAudio(audioBlob);
          onTranscription(text);
        } catch (err) {
          console.error('Transcription failed:', err);
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.05)' }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
        className={cn(
          "p-4 rounded-2xl transition-all relative z-10",
          isRecording ? "text-accent-danger bg-accent-danger/10" : "text-text-muted hover:text-white",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isRecording ? (
          <Square size={20} fill="currentColor" />
        ) : (
          <Mic size={20} />
        )}

        {isRecording && (
          <motion.div
            layoutId="recording-pulse"
            className="absolute inset-0 rounded-2xl bg-accent-danger/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-accent-danger text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-glow-danger whitespace-nowrap z-50"
          >
            Recording Neural Audio...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
