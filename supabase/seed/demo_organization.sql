-- Seed Organizations
insert into public.organizations (id, name, slug, plan)
values ('e8a3479a-e8d1-4ad9-bf9d-2101dbde04d5', 'GenAISAP Enterprise Demo', 'demo', 'enterprise')
on conflict (id) do nothing;

-- Seed Close Phases for Financial Close Agent
insert into public.close_phases (id, period, title, status, progress, blockers_count)
values 
  (1, '2026-05', 'Reconciliation', 'complete', 100, 0),
  (2, '2026-05', 'Intercompany Matching', 'in-progress', 65, 0),
  (3, '2026-05', 'Variance Validation', 'blocked', 40, 2),
  (4, '2026-05', 'Financial Reporting', 'pending', 0, 0)
on conflict (id) do nothing;

-- Seed KPIs for SAP Analytics module
insert into public.kpis (id, revenue_mtd, revenue_trend, open_pos, po_trend, dso, dso_trend, system_health)
values 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '$3,456,789', '12.4%', 147, -8, '38.5 Days', '1.2%', '99.98%')
on conflict (id) do nothing;

-- Seed Dashboard Metrics for API module
insert into public.dashboard_metrics (id, tenant_id, revenue_mtd, revenue_trend, open_pos, dso, dso_trend, system_health, active_users, api_calls, data_sync)
values 
  ('f1e2d3c4-b5a6-7988-9700-112233445566', 'default', '$2,847,392', '+12.4%', 47, '42.3 days', '-3.2%', '99.98%', 247, 1429, 'Live')
on conflict (id) do nothing;

-- Seed Sample Alert for Alert Node
insert into public.alerts (id, organization_id, alert_type, severity, title, description, sap_module, affected_entities, status)
values
  ('550e8400-e29b-41d4-a716-446655440000', 'e8a3479a-e8d1-4ad9-bf9d-2101dbde04d5', 'Drift Detected', 'high', 'Material Ledger Variance', 'Unusual 12.4% price variance detected in raw material storage.', 'MM', '[{"entity_id": "MAT_10023", "name": "Steel Plate C-45"}]', 'open')
on conflict (id) do nothing;
