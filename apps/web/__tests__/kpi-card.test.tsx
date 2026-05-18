import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPICard } from '../components/analytics/kpi-card';

describe('KPICard Component', () => {
  
  it('should render the title and value correctly', () => {
    render(<KPICard title="MTD REVENUE" value="$12.45M" />);

    expect(screen.getByText('MTD REVENUE')).toBeInTheDocument();
    expect(screen.getByText('$12.45M')).toBeInTheDocument();
  });

  it('should render positive growth trend with emerald badges', () => {
    render(
      <KPICard 
        title="SALES VOLUME" 
        value="4,529" 
        trend={{ value: '12.4%', isPositive: true }} 
      />
    );

    const trendBadge = screen.getByText('12.4%');
    expect(trendBadge).toBeInTheDocument();
    expect(trendBadge).toHaveClass('text-emerald-400');
  });

  it('should render negative growth trend with rose badges', () => {
    render(
      <KPICard 
        title="INVENTORY RUN" 
        value="1.8x" 
        trend={{ value: '5.2%', isPositive: false }} 
      />
    );

    const trendBadge = screen.getByText('5.2%');
    expect(trendBadge).toBeInTheDocument();
    expect(trendBadge).toHaveClass('text-rose-400');
  });

  it('should render module badge when supplied', () => {
    render(<KPICard title="LEDGER BALANCES" value="$4.2M" module="FICO" />);

    expect(screen.getByText('FICO NODE')).toBeInTheDocument();
  });
});
