"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchRules } from "@/lib/api";
import type { RuleExplorerEntry } from "@/lib/types";

export function RuleExplorerClient() {
  const [rules, setRules] = useState<RuleExplorerEntry[]>([]);
  const [typologyFilter, setTypologyFilter] = useState("all");
  const [minWeight, setMinWeight] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRules()
      .then(setRules)
      .catch(() => setError("Could not load the rule table. Confirm the backend API is running."));
  }, []);

  const typologies = useMemo(() => Array.from(new Set(rules.map((r) => r.typology))).sort(), [rules]);

  const filtered = rules.filter(
    (rule) => (typologyFilter === "all" || rule.typology === typologyFilter) && rule.weight >= minWeight
  );

  if (error) {
    return <p className="rounded-xl2 border border-redrisk-500/40 bg-redrisk-500/10 p-5 text-sm text-redrisk-500">{error}</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm">
          <span className="font-medium text-slate-800">Typology</span>
          <select
            value={typologyFilter}
            onChange={(e) => setTypologyFilter(e.target.value)}
            className="mt-1 block rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All typologies</option>
            {typologies.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="font-medium text-slate-800">Minimum weight</span>
          <input
            type="number"
            min={0}
            max={10}
            value={minWeight}
            onChange={(e) => setMinWeight(Number(e.target.value) || 0)}
            className="mt-1 block w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <p className="mt-3 text-xs text-slate-500">{filtered.length} of {rules.length} rules shown</p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
          <caption className="sr-only">Public rule table with rule ID, typology, indicator, weight, and rationale</caption>
          <thead>
            <tr className="text-left text-xs uppercase text-slate-500">
              <th scope="col" className="pb-2">Rule ID</th>
              <th scope="col" className="pb-2">Typology</th>
              <th scope="col" className="pb-2">Indicator</th>
              <th scope="col" className="pb-2">Weight</th>
              <th scope="col" className="pb-2">Rationale</th>
              <th scope="col" className="pb-2">Version</th>
              <th scope="col" className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rule) => (
              <tr key={rule.rule_id} className="border-t border-slate-100 align-top">
                <td className="py-1.5 font-mono text-xs text-teal-700">{rule.rule_id}</td>
                <td className="py-1.5">{rule.typology}</td>
                <td className="py-1.5">{rule.indicator}</td>
                <td className="py-1.5">{rule.weight}</td>
                <td className="py-1.5 text-xs text-slate-600">{rule.rationale}</td>
                <td className="py-1.5 font-mono text-xs">{rule.version}</td>
                <td className="py-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${rule.enabled ? "bg-emerald-500/10 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                    {rule.enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
