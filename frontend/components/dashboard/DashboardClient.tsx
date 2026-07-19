"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchSampleDashboard } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import type { DashboardSummary } from "@/lib/types";

const SEVERITY_COLORS: Record<string, string> = {
  Low: "#17A673",
  Moderate: "#E6A52D",
  High: "#E8702A",
  Critical: "#D84A4A",
};

const SEVERITY_GRADIENT_ID: Record<string, string> = {
  Low: "gradLow",
  Moderate: "gradModerate",
  High: "gradHigh",
  Critical: "gradCritical",
};

/** Shared SVG gradient/shadow defs, referenced by fill="url(#id)" across the charts below. */
function ChartDefs() {
  return (
    <defs>
      <linearGradient id="gradTeal" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0BA5AE" />
        <stop offset="100%" stopColor="#087F8C" />
      </linearGradient>
      <linearGradient id="gradNavy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#12B8B0" />
        <stop offset="100%" stopColor="#087F8C" />
      </linearGradient>
      <linearGradient id="gradLow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34C795" />
        <stop offset="100%" stopColor="#17A673" />
      </linearGradient>
      <linearGradient id="gradModerate" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0B94E" />
        <stop offset="100%" stopColor="#E6A52D" />
      </linearGradient>
      <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F0894A" />
        <stop offset="100%" stopColor="#E8702A" />
      </linearGradient>
      <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E56E6E" />
        <stop offset="100%" stopColor="#D84A4A" />
      </linearGradient>
    </defs>
  );
}

function toChartData(record: Record<string, number>) {
  return Object.entries(record)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

interface TooltipPayloadEntry {
  value: number;
  payload: { name: string };
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) {
  const entry = payload?.[0];
  if (!active || !entry) return null;
  const { name } = entry.payload;
  const value = entry.value;
  return (
    <div className="rounded-2xl bg-navy-950 px-4 py-3 shadow-xl">
      <p className="text-xs font-medium text-slate-400">{name}</p>
      <p className="mt-0.5 font-heading text-xl font-semibold text-white">
        {value.toLocaleString()} <span className="text-xs font-normal text-slate-400">case{value === 1 ? "" : "s"}</span>
      </p>
    </div>
  );
}

export function DashboardClient() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSampleDashboard()
      .then(setSummary)
      .catch(() => setError("Could not load the synthetic dashboard summary. Confirm the backend API is running."));
  }, []);

  if (error) {
    return <p className="rounded-2xl border border-redrisk-500/30 bg-redrisk-500/5 p-5 text-sm text-redrisk-500">{error}</p>;
  }

  if (!summary) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  const typologyData = toChartData(summary.typology_distribution);
  const channelData = toChartData(summary.payment_channel_distribution);
  const severityOrder = ["Low", "Moderate", "High", "Critical"];
  const severityData = severityOrder
    .map((name) => ({ name, value: summary.severity_distribution[name] || 0 }))
    .filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_20px_-6px_rgba(16,24,40,0.10)]">
        <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">!</span>
        <p className="text-sm leading-relaxed text-slate-700">
          <strong className="font-semibold text-navy-900">{summary.notice}</strong> Results shown here do not represent
          national prevalence.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total cases" value={summary.total_cases.toLocaleString()} accent="teal" />
        <MetricCard label="High-risk cases" value={summary.high_risk_cases.toLocaleString()} accent="red" />
        <MetricCard label="Avg. fraud risk" value={summary.average_fraud_risk_score.toFixed(1)} accent="orange" />
        <MetricCard label="Avg. dispute friction" value={summary.average_dispute_friction_score.toFixed(1)} accent="amber" />
        <MetricCard label="Avg. consumer harm" value={summary.average_consumer_harm_score.toFixed(1)} accent="amber" />
        <MetricCard label="Avg. recovery urgency" value={summary.average_recovery_urgency_score.toFixed(1)} accent="red" />
        <MetricCard
          label="Total reported amount lost"
          value={`$${summary.total_amount_lost.toLocaleString()}`}
          accent="navy"
          wide
        />
        <a
          href={`${API_BASE_URL}/dashboard/sample-data.csv`}
          className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-navy-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Download analyzed CSV
        </a>
      </div>

      <ChartCard title="Typology distribution" description="Count of synthetic cases per fraud/risk typology.">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={typologyData} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }} barCategoryGap={14}>
            <ChartDefs />
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={230} tick={{ fontSize: 12.5, fill: "#334155" }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(8,127,140,0.05)" }} />
            <Bar dataKey="value" fill="url(#gradTeal)" radius={[0, 8, 8, 0]} maxBarSize={20} style={{ filter: "drop-shadow(0 2px 4px rgba(8,127,140,0.25))" }}>
              <LabelList dataKey="value" position="right" style={{ fill: "#0B263D", fontSize: 13, fontWeight: 700 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Payment-channel distribution" description="Count of synthetic cases per payment channel, ranked highest to lowest.">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={channelData} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }} barCategoryGap={10}>
              <ChartDefs />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12.5, fill: "#334155" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(18,184,176,0.06)" }} />
              <Bar dataKey="value" fill="url(#gradTeal)" radius={[0, 8, 8, 0]} maxBarSize={18} style={{ filter: "drop-shadow(0 2px 4px rgba(18,184,176,0.3))" }}>
                <LabelList dataKey="value" position="right" style={{ fill: "#0B263D", fontSize: 13, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Consumer-harm and recovery severity" description="Overall severity band across all synthetic cases.">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={severityData} margin={{ top: 24 }} barCategoryGap={28}>
              <ChartDefs />
              <XAxis dataKey="name" tick={{ fontSize: 12.5, fill: "#334155", fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(23,32,51,0.04)" }} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={64}>
                {severityData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={`url(#${SEVERITY_GRADIENT_ID[entry.name]})`}
                    style={{ filter: `drop-shadow(0 4px 6px ${SEVERITY_COLORS[entry.name]}40)` }}
                  />
                ))}
                <LabelList dataKey="value" position="top" style={{ fill: "#0B263D", fontSize: 14, fontWeight: 700 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap gap-2">
            {severityOrder.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
              >
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: SEVERITY_COLORS[name] }} />
                {name}
              </span>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-4px_rgba(16,24,40,0.08)] sm:p-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-navy-900">High-risk case queue</h2>
        <p className="mt-1 text-xs text-slate-500">Sorted by recovery urgency, then fraud risk, then consumer harm.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">Synthetic high-risk cases sorted by recovery urgency</caption>
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th scope="col" className="pb-2.5">Case ID</th>
                <th scope="col" className="pb-2.5">State</th>
                <th scope="col" className="pb-2.5">Typology</th>
                <th scope="col" className="pb-2.5 text-right">Amount</th>
                <th scope="col" className="pb-2.5 text-right">Fraud risk</th>
                <th scope="col" className="pb-2.5 text-right">Harm</th>
                <th scope="col" className="pb-2.5 text-right">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {summary.high_risk_cases_table.map((row, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-2.5 font-mono text-xs text-slate-500">{String(row.case_id)}</td>
                  <td className="py-2.5 text-slate-700">{String(row.state)}</td>
                  <td className="py-2.5 text-slate-700">{String(row.typology)}</td>
                  <td className="py-2.5 text-right tabular-nums text-slate-900">${Number(row.amount_lost).toLocaleString()}</td>
                  <td className="py-2.5 text-right tabular-nums font-semibold text-orange-600">{String(row.fraud_risk_score)}</td>
                  <td className="py-2.5 text-right tabular-nums font-semibold text-amber-600">{String(row.consumer_harm_score)}</td>
                  <td className="py-2.5 text-right tabular-nums font-semibold text-redrisk-500">{String(row.recovery_urgency_score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const ACCENT_DOT: Record<string, string> = {
  teal: "bg-teal-500",
  red: "bg-redrisk-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  navy: "bg-navy-900",
};

function MetricCard({
  label,
  value,
  accent,
  wide = false,
}: {
  label: string;
  value: string;
  accent: keyof typeof ACCENT_DOT;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_20px_-6px_rgba(16,24,40,0.10)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(16,24,40,0.06),0_12px_28px_-6px_rgba(16,24,40,0.14)] ${wide ? "col-span-2 lg:col-span-2" : ""}`}
    >
      <div className={`inline-flex h-2 w-2 rounded-full ${ACCENT_DOT[accent]}`} aria-hidden />
      <p className="mt-2 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold tracking-tight text-navy-900">{value}</p>
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-4px_rgba(16,24,40,0.08)] sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-500/[0.06] blur-2xl"
      />
      <div className="relative">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-navy-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
