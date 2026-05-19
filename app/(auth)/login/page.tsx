'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Shield, Zap, Lock, Database, ArrowRight, Activity, Fingerprint } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('INVALID CORPORATE IDENTITY'),
  password: z.string().min(6, 'KEYSTRENGTH INSUFFICIENT'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [rememberDevice, setRememberDevice] = React.useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Animated Particle Network in left panel
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ['rgba(139, 92, 246, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(16, 185, 129, 0.3)'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co')) {
        setIsSuccess(true);
        // Direct to MFA Page as specified in specs!
        setTimeout(() => router.push(`/verify?email=${encodeURIComponent(values.email)}`), 1200);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setAuthError(error.message.toUpperCase() || 'ACCESS DENIED');
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => router.push(`/verify?email=${encodeURIComponent(values.email)}`), 1200);
    } catch (err) {
      setAuthError('NEURAL LINK FAILURE');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#030305] overflow-x-hidden select-none">
      
      {/* LEFT 55%: Animated Canvas abstract data flows & brand */}
      <div className="hidden lg:flex w-[55%] h-screen sticky top-0 relative flex-col justify-between p-20 border-r border-white/5 bg-[#05050a] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#030305] via-transparent to-transparent opacity-90" />
        </div>

        <div className="relative z-10 space-y-6">
           <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Quantum Link Active</span>
           </div>
        </div>

        <div className="relative z-10 space-y-10">
           <div className="space-y-4">
              <h2 className="text-[90px] font-black tracking-[-0.08em] leading-[0.8] text-white">
                 NEURAL<br/>
                 <span className="text-primary italic">ORCHESTRATION</span>
              </h2>
              <p className="text-xl text-text-secondary font-medium tracking-tight max-w-lg leading-relaxed mt-6">
                 Executing real-time semantic RAG vector querying and multi-module ledger validation over S/4HANA instances.
              </p>
           </div>
           
           <div className="flex gap-16 border-t border-white/5 pt-12">
              {[
                { l: 'CORE LATENCY', v: '14MS', i: Activity },
                { l: 'NEURAL SYNC', v: '99.9%', i: Database },
                { l: 'COMPUTE', v: '8.4 TF', i: Zap }
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex items-center gap-3 text-text-muted">
                      <stat.i size={12} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{stat.l}</span>
                   </div>
                   <div className="text-2xl font-black text-white tracking-tighter">{stat.v}</div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* RIGHT 45%: Auth Panel */}
      <div className="flex-1 lg:w-[45%] min-h-screen flex flex-col justify-center px-6 py-12 md:px-24 lg:px-20 xl:px-28 relative bg-[#030305]">
        
        {/* Background glow orb */}
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[460px] mx-auto space-y-10 lg:space-y-16">
          
          {/* Logo & Tagline */}
          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center shadow-glow-primary border border-white/20">
                   <Zap size={28} strokeWidth={3} />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter">
                   GENAI<span className="text-primary">SAP</span>
                </h1>
             </div>
             <p className="text-lg text-text-secondary font-semibold tracking-tight">
                Institutional Intelligence for SAP Ecosystems
             </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
             {/* Google Login (Primary) */}
             <button 
               onClick={() => router.push('/dashboard/home')}
               type="button" 
               className="w-full h-18 bg-white hover:bg-white/95 text-black font-black uppercase tracking-[0.2em] rounded-2xl transition-all text-[10px] flex items-center justify-center gap-4 shadow-glow-white active:scale-[0.98]"
             >
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google Identity Link
             </button>
             
             {/* Microsoft Entra ID (Secondary) */}
             <button 
               onClick={() => router.push('/dashboard/home')}
               type="button" 
               className="w-full h-18 border border-white/10 bg-white/[0.02] hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl transition-all text-[10px] flex items-center justify-center gap-4 active:scale-[0.98]"
             >
                <svg width="16" height="16" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                Microsoft Entra ID
             </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-6 text-[9px] font-black text-text-muted uppercase tracking-[0.4em]">Corporate Link</span>
              <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-10">
             <div className="space-y-4 group/input">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted ml-6 group-focus-within/input:text-primary transition-colors">Operational Identity</label>
                <Input 
                  type="email"
                  {...register('email')}
                  placeholder="EXECUTIVE@SYSTEM.CORP"
                  className="h-18 bg-white/[0.02] border-white/5 rounded-2xl px-6 text-sm font-bold tracking-widest placeholder:text-text-muted focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none"
                />
                {errors.email && (
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-6 mt-1">{errors.email.message}</p>
                )}
             </div>

             <div className="space-y-4 group/input">
                <div className="flex justify-between items-center px-6">
                   <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted group-focus-within/input:text-primary transition-colors">Neural Key</label>
                   <button type="button" className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors">Recover</button>
                </div>
                <Input 
                  type="password"
                  {...register('password')}
                  placeholder="••••••••••••"
                  className="h-18 bg-white/[0.02] border-white/5 rounded-2xl px-6 text-sm font-bold tracking-widest placeholder:text-text-muted focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none"
                />
                {errors.password && (
                  <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-6 mt-1">{errors.password.message}</p>
                )}
             </div>

             {/* Remember Device Switch */}
             <div className="flex items-center justify-between px-6">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Remember this device</span>
                <button
                  type="button"
                  onClick={() => setRememberDevice(!rememberDevice)}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-300 outline-none",
                    rememberDevice ? "bg-primary" : "bg-white/10"
                  )}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full transition-transform duration-300", rememberDevice ? "translate-x-6" : "translate-x-0")} />
                </button>
             </div>

             <AnimatePresence>
                {authError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] text-center">
                     {authError}
                  </motion.div>
                )}
             </AnimatePresence>

             <Button 
               type="submit" 
               className={cn(
                 "w-full h-20 font-black uppercase tracking-[0.4em] rounded-2xl transition-all duration-700 text-[10px] relative overflow-hidden",
                 isSuccess 
                   ? "bg-emerald-500 text-white shadow-glow-accent" 
                   : "bg-white text-black hover:scale-[1.01] shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-glow-white"
               )}
             >
                <span className="relative z-10 flex items-center justify-center gap-3">
                   {isLoading ? (
                     <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                   ) : isSuccess ? (
                     <>SESSION ENGAGING <Shield size={14} /></>
                   ) : (
                     <>INITIALIZE HYPER-SPACE LINK <ArrowRight size={14} /></>
                   )}
                </span>
             </Button>
          </form>

          {/* Footer */}
          <div className="flex justify-center gap-10 border-t border-white/5 pt-8 text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <span>•</span>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>

        </div>
      </div>

    </div>
  );
}
