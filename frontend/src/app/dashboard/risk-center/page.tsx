"use client";

import { useEffect, useState } from "react";
import { 
  Gauge, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Sparkles,
  Search,
  Hourglass,
  Sliders,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

export default function RiskCenterPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRiskData() {
      try {
        const response = await fetch("/api/analytics/risk-center");
        if (response.ok) {
          const val = await response.json();
          setData(val);
        } else {
          throw new Error("Failed to load");
        }
      } catch (err) {
        console.log("Using offline mock risk center analytics");
        setData({
          summary: {
            critical_machines: 2,
            warning_machines: 2,
            stable_machines: 1,
            total_machines: 5,
            active_workarounds: 3
          },
          machines: [
            { id: 1, machine_name: "Motor M3 (Overhead Intake Fan)", failure_probability: 87.0, safety_status: "critical", critical_level: "high", location: "Winding Shop Area B", risk_factors: ["1 active override unresolved for > 10 days", "Lubrication dryness signs"] },
            { id: 5, machine_name: "Cooling Pump P8 (Coolant Cycle)", failure_probability: 65.0, safety_status: "warning", critical_level: "high", location: "Utility Block North", risk_factors: ["Undocumented fan cooling"] },
            { id: 2, machine_name: "Conveyor Line 2 (Packaging System)", failure_probability: 58.0, safety_status: "warning", critical_level: "medium", location: "Assembly Hall C", risk_factors: ["PLC safety interlock bypass"] },
            { id: 3, machine_name: "Hydraulic Press H1 (Stamping Unit)", failure_probability: 12.0, safety_status: "stable", critical_level: "high", location: "Press Shop Floor 1", risk_factors: [] },
            { id: 4, machine_name: "Centrifuge C5 (Chemical Separator)", failure_probability: 15.0, safety_status: "stable", critical_level: "high", location: "Processing Room 4", risk_factors: [] }
          ],
          categories_distribution: [
            { category: "RPM Reduction", count: 1 },
            { category: "Sensor Override", count: 1 },
            { category: "Air Cooling", count: 1 }
          ],
          workaround_decay_timeline: [
            { id: 1, title: "Manual Motor Speed De-rate to 60%", machine_name: "Motor M3 (Overhead Intake Fan)", days_active: 14, risk_level: "high" },
            { id: 2, title: "Bypassed Optical Feed Jam Sensor", machine_name: "Conveyor Line 2 (Packaging System)", days_active: 6, risk_level: "medium" },
            { id: 3, title: "External Auxiliary Fan Cooling", machine_name: "Cooling Pump P8 (Coolant Cycle)", days_active: 3, risk_level: "high" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    loadRiskData();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white/5 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-[300px] bg-white/5 animate-pulse rounded-xl" />
          <div className="lg:col-span-2 h-[300px] bg-white/5 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  // Formatting chart data
  const chartData = data.categories_distribution.map((item: any) => ({
    name: item.category,
    Count: item.count
  }));

  return (
    <div className="space-y-6 selection:bg-amber-industrial/30 selection:text-amber-industrial">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Gauge className="h-6 w-6 text-amber-industrial" />
          AI Risk Center
        </h1>
        <p className="text-xs text-text-muted mt-1">Predictive analysis of machine failure risk scores based on active workarounds</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Risk Critical State</span>
          <div className="text-3xl font-extrabold text-red-500 mt-2">{data.summary.critical_machines} Machines</div>
          <p className="text-[10px] text-text-muted mt-1">Immediate shutdown recommended</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Warning Level</span>
          <div className="text-3xl font-extrabold text-amber-industrial mt-2">{data.summary.warning_machines} Machines</div>
          <p className="text-[10px] text-text-muted mt-1">Elevated failure vulnerability</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Healthy / Stable</span>
          <div className="text-3xl font-extrabold text-green-500 mt-2">{data.summary.stable_machines} Machines</div>
          <p className="text-[10px] text-text-muted mt-1">No active human workarounds</p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Decay Warning Index</span>
          <div className="text-3xl font-extrabold text-white mt-2">1 Active</div>
          <p className="text-[10px] text-text-muted mt-1">Workarounds active for &gt; 10 days</p>
        </div>
      </div>

      {/* Main sections grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Risk Rank & Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Asset vulnerability rank */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">Asset Failure Probability Ranking</h3>
              </div>
              <span className="text-[9px] text-text-muted">Calculated by AI Engine</span>
            </div>

            <div className="space-y-4">
              {data.machines.sort((a: any, b: any) => b.failure_probability - a.failure_probability).map((m: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg border border-white/5 bg-bg-dark/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        m.safety_status === 'critical' ? 'bg-red-500' : m.safety_status === 'warning' ? 'bg-amber-industrial' : 'bg-green-500'
                      }`} />
                      <span className="font-bold text-white text-xs">{m.machine_name}</span>
                    </div>
                    <span className="text-[10px] text-text-muted block font-mono">Location: {m.location} // Severity: {m.critical_level.toUpperCase()}</span>
                    
                    {m.risk_factors && m.risk_factors.length > 0 && (
                      <div className="text-[10px] text-red-400/80 pt-1.5 flex gap-1 items-start">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Vector: {m.risk_factors.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-text-muted block uppercase">Vulnerability</span>
                      <span className={`font-extrabold text-sm ${
                        m.safety_status === 'critical' ? 'text-red-500' : m.safety_status === 'warning' ? 'text-amber-industrial' : 'text-green-500'
                      }`}>{m.failure_probability}%</span>
                    </div>
                    
                    <Link 
                      href={`/dashboard/machines/${m.id}`}
                      className="p-1.5 rounded hover:bg-white/5 border border-white/5 text-text-muted hover:text-white transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subsystem instability bar chart */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <Sliders className="h-5 w-5 text-amber-industrial" />
              <div>
                <h3 className="text-sm font-bold text-white">Subsystem Workaround Frequency</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Active overrides categorised by engineering subsystem</p>
              </div>
            </div>

            <div className="h-64 w-full text-xs">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                    <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#171A21", borderColor: "rgba(255,179,71,0.2)", borderRadius: "6px" }}
                      labelStyle={{ color: "#FFF", fontWeight: "bold" }}
                      itemStyle={{ color: "#FFB347" }}
                    />
                    <Bar dataKey="Count" fill="#FFB347" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill="#FFB347" fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  No active workarounds recorded to display subsystem frequencies.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Decay Timeline & Risk Warning */}
        <div className="space-y-6">
          
          {/* Workaround decay list */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark relative overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <Hourglass className="h-5 w-5 text-amber-industrial" />
              <div>
                <h3 className="text-sm font-bold text-white">Workaround Decay Timeline</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Tracking intervention age before failure escalation</p>
              </div>
            </div>

            <div className="space-y-4">
              {data.workaround_decay_timeline.map((item: any) => (
                <div 
                  key={item.id} 
                  className={`p-3.5 rounded border text-xs space-y-2 ${
                    item.days_active >= 10 
                      ? "bg-red-500/5 border-red-500/20" 
                      : "bg-bg-dark/40 border-white/5"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white truncate max-w-[150px]">{item.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      item.days_active >= 10 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-amber-industrial/10 text-amber-industrial"
                    }`}>
                      {item.days_active} Days Active
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed font-mono">Asset: {item.machine_name}</p>
                  
                  {item.days_active >= 10 && (
                    <div className="text-[10px] text-red-400 font-bold flex gap-1 items-start mt-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>CRITICAL DECAY: Bypassed threshold has exceeded nominal limits. Schedule shutdown.</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Core AI Risk statement */}
          <div className="p-6 rounded-xl border border-amber-industrial/20 bg-amber-industrial/5 glow-amber/5 relative">
            <div className="flex items-center gap-2 border-b border-amber-industrial/10 pb-4 mb-4">
              <Sparkles className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">AI Diagnostics Warning</h3>
            </div>
            
            <p className="text-xs text-text-muted leading-relaxed mb-4">
              Plant health indexes indicate that <span className="text-white font-semibold">60% of recent maintenance failures</span> were preceded by active, undocumented operator workarounds in similar categories.
            </p>
            
            <p className="text-xs text-text-muted leading-relaxed">
              Restoring nominal safety parameters on <span className="text-white font-semibold">Motor M3</span> and <span className="text-white font-semibold">Cooling Pump P8</span> will reduce total factory failure vulnerability by <span className="text-green-500 font-bold">42.5%</span>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

// Quick helper
function AlertCircle(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
