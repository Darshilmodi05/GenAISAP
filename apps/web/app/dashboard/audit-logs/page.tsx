'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Terminal, 
  Globe, 
  User, 
  Calendar, 
  Activity, 
  FileSpreadsheet, 
  FileText, 
  ArrowUpDown,
  X
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  user_name: string;
  role: string;
  ip_address: string;
  user_agent: string;
  metadata: Record<string, any>;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'log_01J8Y2W8Z9021X',
    action: 'AUTH_LOGIN_SUCCESS',
    resource_type: 'AUTHENTICATION',
    resource_id: 'usr_darshil_modi',
    user_name: 'Darshil Modi',
    role: 'Admin',
    ip_address: '192.168.1.147',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
    metadata: { method: 'Google OAuth', session_duration_limit: '24h', mfa_status: 'verified' },
    created_at: '2026-05-17T21:30:12Z',
    severity: 'low',
  },
  {
    id: 'log_01J8Y2W8Z9022A',
    action: 'DATA_EXPORT_EXCEL',
    resource_type: 'SAP_REPORTS',
    resource_id: 'rep_fico_q1_variance',
    user_name: 'Sarah Connor',
    role: 'Analyst',
    ip_address: '10.0.4.52',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.4',
    metadata: { records_exported: 4529, filter_applied: 'ledger=FICO, Q=2026-Q1', download_size: '4.2MB' },
    created_at: '2026-05-17T20:45:00Z',
    severity: 'medium',
  },
  {
    id: 'log_01J8Y2W8Z9023B',
    action: 'RLS_SECURITY_VIOLATION',
    resource_type: 'TENANT_DATABASE',
    resource_id: 'org_external_sap_node',
    user_name: 'Unknown Agent',
    role: 'Viewer',
    ip_address: '185.220.101.4',
    user_agent: 'python-requests/2.31.0',
    metadata: { violated_policy: 'tenant_isolation_policy', attempted_org_id: 'e8a3479a-e8d1-4ad9-bf9d-2101dbde04d5', block_action: 'TERMINATED_REQUEST' },
    created_at: '2026-05-17T19:12:44Z',
    severity: 'critical',
  },
  {
    id: 'log_01J8Y2W8Z9024C',
    action: 'GATEWAY_NODE_UPDATED',
    resource_type: 'DATA_CONNECTORS',
    resource_id: 'sap-prd',
    user_name: 'Darshil Modi',
    role: 'Admin',
    ip_address: '192.168.1.147',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0',
    metadata: { changed_fields: ['sapUrl', 'username'], original_status: 'connected', latency_shift: '-12ms' },
    created_at: '2026-05-17T18:02:10Z',
    severity: 'high',
  },
  {
    id: 'log_01J8Y2W8Z9025D',
    action: 'API_METRICS_FETCH',
    resource_type: 'TELEMETRY',
    resource_id: 'performance_analytics',
    user_name: 'System Cron Job',
    role: 'Analyst',
    ip_address: '127.0.0.1',
    user_agent: 'GenAISAP-TelemetryCollector/1.0',
    metadata: { active_sockets: 247, api_calls_logged: 1429, memory_heap_percent: 42 },
    created_at: '2026-05-17T17:00:00Z',
    severity: 'low',
  },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>(mockAuditLogs);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>('ALL');
  const [selectedLog, setSelectedLog] = React.useState<AuditLog | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);

  // Sorting
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address.includes(searchQuery);

    const matchesSeverity = 
      selectedSeverity === 'ALL' || 
      log.severity.toUpperCase() === selectedSeverity;

    return matchesSearch && matchesSeverity;
  }).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'medium': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'high': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  };

  const handleExport = (format: 'CSV' | 'PDF') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Audit Logs successfully compiled and exported in ${format} format!`);
    }, 1200);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-24 pb-40 relative animate-fade-in px-4">
      
      {/* Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
             <ShieldCheck size={14} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Immutable Security Sentinel</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             AUDIT <br/> <span className="text-gradient">LOGS</span>
          </h1>
        </div>
        
        {/* Export Utilities */}
        <div className="flex flex-wrap gap-4 z-10">
           <button 
             onClick={() => handleExport('CSV')}
             disabled={isExporting}
             className="h-16 px-8 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[10px] transition-all border border-white/5 flex items-center gap-3"
           >
              <FileSpreadsheet size={14} />
              Export CSV
           </button>
           <button 
             onClick={() => handleExport('PDF')}
             disabled={isExporting}
             className="h-16 px-8 bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[10px] transition-all shadow-glow-primary border border-primary/30 flex items-center gap-3"
           >
              <FileText size={14} />
              Generate PDF
           </button>
        </div>
      </div>

      {/* Filter Toolbar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Search */}
        <div className="lg:col-span-2 relative">
          <input 
            type="text"
            placeholder="Search by action, operator, target, or IP address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 pl-14 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
          />
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Severity Filter */}
        <div className="relative">
          <select 
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all appearance-none"
          >
            <option value="ALL">Severity: All Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Incident</option>
          </select>
          <Filter size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-[1.8rem] p-6 text-base font-bold text-white outline-none focus:border-primary/50 transition-all flex items-center justify-between"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sort Timestamp</span>
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            <ArrowUpDown size={14} />
          </div>
        </button>
      </div>

      {/* Main Logs Table / Registry */}
      <div className="relative z-10 overflow-x-auto glass-card rounded-[3.5rem] border border-white/5 bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">
              <th className="p-8">Log Reference</th>
              <th className="p-8">Action Metric</th>
              <th className="p-8">Target Node</th>
              <th className="p-8">operator</th>
              <th className="p-8">Gateway IP</th>
              <th className="p-8">Risk Rating</th>
              <th className="p-8 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-20 text-center text-text-muted font-bold uppercase tracking-widest text-xs">
                  No security incidents or audits matching filters.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr 
                  key={log.id}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="p-8 font-mono text-[11px] text-text-secondary">
                    {log.id}
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-white uppercase text-xs tracking-tight group-hover:text-primary transition-colors">
                        {log.action}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-text-muted mt-1">
                        {log.resource_type}
                      </span>
                    </div>
                  </td>
                  <td className="p-8 text-xs font-bold text-white">
                    {log.resource_id}
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-secondary text-[10px] font-black">
                        {log.user_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{log.user_name}</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-primary mt-0.5">{log.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 font-mono text-xs text-text-secondary">
                    {log.ip_address}
                  </td>
                  <td className="p-8">
                    <Badge className={cn("text-[9px] font-black px-3 py-1 border rounded-lg uppercase tracking-wider", getSeverityBadgeColor(log.severity))}>
                      {log.severity}
                    </Badge>
                  </td>
                  <td className="p-8 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center text-text-secondary transition-all"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* JSON Metadata Inspector Drawer Overlay */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Sidebar drawer box */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-[650px] h-full bg-[#07070b] border-l border-white/10 p-12 lg:p-16 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-12">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                      <Terminal size={12} className="text-text-muted" />
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted">
                        PAYLOAD INSPECTION
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-white uppercase tracking-tight">Audit Metadata</h3>
                  </div>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="w-14 h-14 bg-white/5 hover:bg-white hover:text-black rounded-full flex items-center justify-center text-text-secondary transition-all border border-white/5"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Log Overview */}
                <div className="grid grid-cols-2 gap-8 text-left">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Log Hash ID</span>
                    <p className="font-mono text-xs text-white">{selectedLog.id}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Timestamp</span>
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <Calendar size={12} className="text-primary" />
                      {new Date(selectedLog.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Action Metric</span>
                    <p className="text-xs font-black uppercase tracking-wider text-primary">{selectedLog.action}</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Risk Status</span>
                    <div>
                      <Badge className={cn("text-[8px] font-black px-2 py-0.5 border rounded-md uppercase tracking-wider", getSeverityBadgeColor(selectedLog.severity))}>
                        {selectedLog.severity}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Operator Profile */}
                <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Operator Telemetry</span>
                  <div className="flex items-center gap-5 pt-2">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-black">
                      {selectedLog.user_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{selectedLog.user_name}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-muted mt-0.5">Role: {selectedLog.role}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-text-muted">IP Address</span>
                      <p className="font-mono text-xs text-white">{selectedLog.ip_address}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-text-muted">Domain</span>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Globe size={12} className="text-text-muted" />
                        gateway.sap.corp
                      </p>
                    </div>
                  </div>
                </div>

                {/* JSON Metadata Payload */}
                <div className="space-y-4 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">JSON Structure (RLS Footprint)</span>
                  <div className="bg-[#050508] border border-white/5 rounded-3xl p-8 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner leading-relaxed">
                    <pre>{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                  </div>
                </div>

                {/* Client Browser User Agent */}
                <div className="space-y-3 text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-text-muted">Operator User Agent</span>
                  <p className="text-xs font-bold text-text-muted leading-relaxed font-mono bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                    {selectedLog.user_agent}
                  </p>
                </div>

              </div>

              {/* Action Close */}
              <div className="pt-8 border-t border-white/5 flex gap-4">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-full h-16 bg-white/5 hover:bg-white hover:text-black text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[10px] transition-all border border-white/5"
                >
                  Close Sentinel Drawer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
