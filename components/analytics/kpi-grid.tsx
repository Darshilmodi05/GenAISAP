'use client';

import * as React from 'react';
import { KPICard } from './kpi-card';

export const KPIGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Revenue (MTD)"
        value="$4,281,092"
        trend={{ value: '12.4%', isPositive: true }}
        module="FICO"
      />
      <KPICard
        title="Open Purchase Orders"
        value="142"
        trend={{ value: '8', isPositive: false }}
        module="MM"
      />
      <KPICard
        title="Days Sales Outstanding"
        value="38.5 Days"
        trend={{ value: '1.2', isPositive: true }}
        module="SD"
      />
      <KPICard
        title="System Health"
        value="99.98%"
        trend={{ value: '0.01%', isPositive: true }}
      />
    </div>
  );
};
