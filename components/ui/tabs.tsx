'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-6 py-3 text-body-sm font-medium transition-all relative',
            activeTab === tab.id
              ? 'text-primary'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary animate-fade-in" />
          )}
        </button>
      ))}
    </div>
  );
};
