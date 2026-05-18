'use client';

import * as React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/use-ui-store';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex h-screen bg-[#030305] overflow-hidden relative">
      {/* Background Neural Particles / Mesh */}
      <div className="fixed inset-0 z-0 bg-neural-mesh pointer-events-none" />
      <div className="noise-overlay" />
      
      {/* Dynamic Animated Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            x: [0, -50, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full"
        />
      </div>

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <Topbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden pt-[60px] custom-scrollbar"
        >
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
