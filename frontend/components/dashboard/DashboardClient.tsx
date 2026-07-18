"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  High: "#f97316",
  Critical: "#D84A4A",
};

function toChartData(record: Record<string, number>) {
  return Object.entries(record)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
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
    return <p className="rounded-xl2 border border-redrisk-500/40 bg-redrisk-500/10 p-5 text-sm text-redrisk-500">{error}</p>;
  }

  if (!summary) {
    return <p className="text-sm text-slate-600">Loading synthetic portfolio summary…</p>;
  }

  const typologyData = toChartData(summary.typology_distribution);
  const channelData = toChartData(summary.payment_channel_distribution);
  const severityOrder = ["Low", "Moderate", "High", "Critical"];
  const severityData = severityOrder
    .map((name) => ({ name, value: summary.severity_distribution[name] || 0 }))
    .filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      <div className="rounded-xl2 border border-amber-500/40 bg-amber-500/10 p-4 text-sm font-medium text-navy-900">
        {summary.notice} Results shown here do not represent national prevalence.
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Total cases" value={summary.total_cases.toLocaleString()} />
        <MetricCard label="High-risk cases" value={summary.high_risk_cases.toLocaleString()} />
        <MetricCard label="Avg. fraud risk" value={summary.average_fraud_risk_score.toFixed(1)} />
        <MetricCard label="Avg. dispute friction" value={summary.average_dispute_friction_score.toFixed(1)} />
        <MetricCard label="Avg. consumer harm" value={summary.average_consumer_harm_score.toFixed(1)} />
        <MetricCard label="Avg. recovery urgency" value={summary.average_recovery_urgency_score.toFixed(1)} />
        <MetricCard label="Total reported amount lost" value={`$${summary.total_amount_lost.toLocaleString()}`} wide />
        <a
          href={`${API_BASE_URL}/dashboard/sample-data.csv`}
          className="flex items-center justify-center rounded-xl2 border border-navy-900 bg-navy-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-teal-700"
        >
          Download analyzed CSV
        </a>
      </div>

      <ChartCard title="Typology distribution" description="Count of synthetic cases per fraud/risk typology.">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={typologyData} layout="vertical" margin={{ left: 24, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EA" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={220} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#087F8C" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Payment-channel distribution" description="Count of synthetic cases per payment channel.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={channelData} margin={{ bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EA" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#12B8B0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Consumer-harm and recovery severity" description="Overall severity band across all synthetic cases.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EA" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Cases" radius={[4, 4, 0, 0]}>
                {severityData.map((entry) => (
                  <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="rounded-xl2 border border-slate-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-navy-900">High-risk case queue</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="sr-only">Synthetic high-risk cases sorted by recovery urgency</caption>
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500">
                <th scope="col" className="pb-2">Case ID</th>
                <th scope="col" className="pb-2">State</th>
                <th scope="col" className="pb-2">Typology</th>
                <th scope="col" className="pb-2">Amount</th>
                <th scope="col" className="pb-2">Fraud risk</th>
                <th scope="col" className="pb-2">Harm</th>
                <th scope="col" className="pb-2">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {summary.high_risk_cases_table.map((row, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="py-1.5 font-mono text-xs">{String(row.case_id)}</td>
                  <td className="py-1.5">{String(row.state)}</td>
                  <td className="py-1.5">{String(row.typology)}</td>
                  <td className="py-1.5">${Number(row.amount_lost).toLocaleString()}</td>
                  <td className="py-1.5">{String(row.fraud_risk_score)}</td>
                  <td className="py-1.5">{String(row.consumer_harm_score)}</td>
                  <td className="py-1.5">{String(row.recovery_urgency_score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-xl2 border border-slate-200 bg-white p-4 ${wide ? "col-span-2 lg:col-span-2" : ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-navy-900">{value}</p>
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-5">
      <h2 className="font-heading text-lg font-semibold text-navy-900">{title}</h2>
      <p className="mt-1 text-xs text-slate-600">{description}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
