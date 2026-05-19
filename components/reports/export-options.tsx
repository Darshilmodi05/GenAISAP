'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Table, Download, X } from 'lucide-react';
import { exportUtil } from '@/lib/utils/export';

interface ExportOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ isOpen, onClose, reportTitle }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async (type: 'PDF' | 'EXCEL') => {
    setIsExporting(true);
    if (type === 'PDF') {
      await exportUtil.downloadAsPDF(reportTitle, { title: reportTitle, status: 'VERIFIED' });
    } else {
      await exportUtil.downloadAsExcel(reportTitle, []);
    }
    setIsExporting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8">
               <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                  <X size={20} />
               </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Export Manifest</h3>
              <p className="text-xs text-text-muted uppercase tracking-widest leading-relaxed">
                 Select the delivery structure for <span className="text-white font-bold">{reportTitle}</span>.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleExport('PDF')}
                disabled={isExporting}
                className="flex items-center justify-between p-8 glass-card rounded-3xl border-white/5 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center">
                      <FileText size={20} />
                   </div>
                   <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Institutional PDF</span>
                </div>
                <Download size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              </button>

              <button 
                onClick={() => handleExport('EXCEL')}
                disabled={isExporting}
                className="flex items-center justify-between p-8 glass-card rounded-3xl border-white/5 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                      <Table size={20} />
                   </div>
                   <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Data Matrix (XLSX)</span>
                </div>
                <Download size={16} className="text-text-muted group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>

            {isExporting && (
              <div className="pt-4 flex items-center justify-center gap-4 text-primary animate-pulse">
                 <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Synthesizing Manifest...</span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
