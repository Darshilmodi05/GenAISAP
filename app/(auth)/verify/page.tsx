'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Shield, ArrowLeft, RefreshCw, Key, Monitor, CheckCircle2 } from 'lucide-react';

import { Suspense } from 'react';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'EXECUTIVE@SYSTEM.CORP';

  const [otp, setOtp] = React.useState<string[]>(new Array(6).fill(''));
  const [timer, setTimer] = React.useState(59);
  const [isResending, setIsResending] = React.useState(false);
  const [trustDevice, setTrustDevice] = React.useState(false);
  const [backupMode, setBackupMode] = React.useState(false);
  const [backupCode, setBackupCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer effect
  React.useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit input change
  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all digits populated
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      triggerVerification(newOtp.join(''));
    }
  };

  // Handle keyboard backspaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      // If current field is filled, clear it
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // If current field empty, clear previous field and jump focus back
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle pasting full 6-digit codes
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const pastedDigits = pastedData.split('');
      setOtp(pastedDigits);
      triggerVerification(pastedData);
    }
  };

  const triggerVerification = async (code: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // Simulate TOTP cryptographic telemetry check
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (code === '000000') {
        setErrorMsg('AUTHENTICATOR CHALLENGE REJECTED');
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push('/dashboard/home'), 1000);
      }
    } catch (err) {
      setErrorMsg('CRYPTOGRAPHIC FAILURE');
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setErrorMsg(null);
    setTimeout(() => {
      setIsResending(false);
      setTimer(59);
    }, 1200);
  };

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (backupCode.length < 8) {
      setErrorMsg('BACKUP CODES REQUIRE 8 CHARACTERS');
      return;
    }
    triggerVerification('999999'); // Fallback mock success code
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030305] relative overflow-hidden p-8 selection:bg-primary/30">
      
      {/* Hyper-Space Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-[3.5rem] p-12 md:p-16 border-white/10 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-black/40 backdrop-blur-2xl"
        >
          {/* Header Back Button */}
          <button 
            onClick={() => router.push('/login')} 
            className="absolute top-8 left-8 p-3 text-text-muted hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-all outline-none"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="space-y-12 text-center mt-6">
            
            {/* Avatar & User Details */}
            <div className="flex flex-col items-center gap-5">
              <Avatar initials="DM" size="xl" status="active" className="rounded-3xl border-2 border-primary/40 shadow-glow-primary" />
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-white tracking-tighter uppercase">MFA Governed</h2>
                 <p className="text-sm text-text-secondary font-bold tracking-widest">{email.toUpperCase()}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!backupMode ? (
                <motion.div 
                  key="totp-challenge"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  <p className="text-xs text-text-muted font-black uppercase tracking-[0.3em]">Enter 6-Digit Authenticator Code</p>
                  
                  {/* OTP Inputs */}
                  <div className="flex justify-between gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-14 h-18 bg-white/[0.02] border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:border-primary focus:bg-white/[0.04] focus:shadow-glow-primary transition-all outline-none"
                      />
                    ))}
                  </div>

                  {/* Timer & Resend */}
                  <div className="flex justify-center items-center gap-3">
                    {timer > 0 ? (
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                         Resend key in <span className="text-white font-bold">{timer}s</span>
                      </span>
                    ) : (
                      <button 
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-[10px] font-black text-primary hover:text-white uppercase tracking-[0.2em] flex items-center gap-2 transition-colors outline-none"
                      >
                        {isResending ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                        Resend Code
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.form 
                  key="backup-challenge"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleBackupSubmit}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                     <p className="text-xs text-text-muted font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                       <Key size={12} className="text-primary" />
                       Emergency Recovery Code
                     </p>
                     <Input 
                       type="text"
                       placeholder="XXXX-XXXX-XXXX"
                       maxLength={14}
                       value={backupCode}
                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackupCode(e.target.value.toUpperCase())}
                       className="h-18 bg-white/[0.02] border-white/5 rounded-2xl px-6 text-center text-lg font-black tracking-widest placeholder:text-text-muted focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none"
                     />
                  </div>
                  <Button type="submit" className="w-full h-18 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:shadow-glow-white text-[10px]">
                     Deploy Emergency Recovery
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Trust Workstation Option */}
            <div className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-[2rem]">
               <div className="flex items-center gap-3">
                  <Monitor size={14} className="text-primary" />
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Trust this workstation</span>
               </div>
               <button
                 onClick={() => setTrustDevice(!trustDevice)}
                 className={cn(
                   "w-10 h-5 rounded-full p-0.5 transition-colors duration-300 outline-none",
                   trustDevice ? "bg-primary" : "bg-white/10"
                 )}
               >
                 <div className={cn("w-4 h-4 bg-white rounded-full transition-transform duration-300", trustDevice ? "translate-x-5" : "translate-x-0")} />
               </button>
            </div>

            {/* Error / Loading / Success Banners */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">
                   {errorMsg}
                </motion.div>
              )}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
                   <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                   Verifying Security Matrix
                </motion.div>
              )}
              {isSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center gap-3 text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">
                   <CheckCircle2 size={16} className="text-emerald-400 shadow-glow-accent rounded-full bg-black" />
                   Security Clear. Linking...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Recovery Mode Button */}
            <div className="pt-6 border-t border-white/5">
              <button 
                onClick={() => setBackupMode(!backupMode)} 
                className="text-[9px] font-black text-text-muted hover:text-white uppercase tracking-[0.3em] transition-colors outline-none"
              >
                {!backupMode ? 'Use Backup Recovery Code' : 'Back to Authenticator Challenge'}
              </button>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full flex items-center justify-center bg-[#030305] text-white">Loading Security Matrix...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
