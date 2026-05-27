"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Cpu, 
  CheckCircle, 
  Wrench,
  MessageSquare,
  Sparkles,
  Calendar,
  AlertCircle,
  Mic
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [riskData, setRiskData] = useState<any>(null);
  const [shifts, setShifts] = useState<any[]>([]);
  const [interventions, setInterventions] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [riskRes, shiftRes, interRes] = await Promise.all([
          fetch("/api/analytics/risk-center"),
          fetch("/api/shifts"),
          fetch("/api/interventions")
        ]);

        if (riskRes.ok && shiftRes.ok && interRes.ok) {
          const riskVal = await riskRes.json();
          const shiftVal = await shiftRes.json();
          const interVal = await interRes.json();
          setRiskData(riskVal);
          setShifts(shiftVal);
          setInterventions(interVal);
        } else {
          throw new Error("Failed backend response");
        }
      } catch (err) {
        console.log("Using offline mock dashboard data");
        // Fallback mock values matching our seeded backend records
        setRiskData({
          summary: {
            critical_machines: 2,
            warning_machines: 2,
            stable_machines: 1,
            total_machines: 5,
            active_workarounds: 3
          },
          workaround_decay_timeline: [
            { id: 1, title: "Manual Motor Speed De-rate to 60%", machine_name: "Motor M3 (Overhead Intake Fan)", days_active: 14, risk_level: "high" },
            { id: 2, title: "Bypassed Optical Feed Jam Sensor", machine_name: "Conveyor Line 2 (Packaging System)", days_active: 6, risk_level: "medium" },
            { id: 3, title: "External Auxiliary Fan Cooling", machine_name: "Cooling Pump P8 (Coolant Cycle)", days_active: 3, risk_level: "high" }
          ]
        });
        setShifts([
          {
            id: 1,
            shift_name: "Shift A (Morning)",
            timestamp: new Date().toISOString(),
            supervisor: { name: "Marcus Vance" },
            summary: "All lines operational except Centrifuge C5. Winding Shop intake fan M3 capped at 60% RPM. Coolant pump P8 cooled by external fan.",
            critical_actions: "Monitor pump temperature casing. Clean cardboard dust near photo sensor array.",
            handover_notes: "Verify if Tuesday downtime window is approved for M3 bearing replacement."
          }
        ]);
        setInterventions([
          {
            id: 1,
            machine_id: 1,
            title: "Manual Motor Speed De-rate to 60%",
            description: "Motor fan drive reported overheating alarm (bearing temp reached 87°C). Capped RPM to 60% to avoid line shut down.",
            category: "RPM Reduction",
            status: "active",
            risk_level: "high",
            confidence_score: 0.92,
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            machine: { name: "Motor M3 (Overhead Intake Fan)" },
            operator: { name: "Rajesh Patel", role: "operator", avatar_url: "" },
            ai_recommendation: "CRITICAL EXPOSURE: Limiting speed to 60% indicates bearing wear.restricting speed masks heating but strains windings. Restructure bearing replacement within 48h.",
            comments: [
              { id: 1, user: { name: "Marcus Vance" }, text: "Ensure Shift C checks bearing casing temp with IR thermometer during rounds." },
              { id: 2, user: { name: "Elena Rostova" }, text: "Checked. Casing temperature is at 84°C even at 60% load. Loud hum is audible." }
            ]
          },
          {
            id: 2,
            machine_id: 2,
            title: "Bypassed Optical Feed Jam Sensor",
            description: "Optical sensor was triggering false alarms due to cardboard dust. Bypassed sensor logic to maintain conveyor speed.",
            category: "Sensor Override",
            status: "active",
            risk_level: "medium",
            confidence_score: 0.85,
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            machine: { name: "Conveyor Line 2 (Packaging System)" },
            operator: { name: "Elena Rostova", role: "technician", avatar_url: "" },
            ai_recommendation: "WARNING: Safety override active. Cardboard jams will not trigger automatic shut-off. Belts might tear. Clean sensor optics.",
            comments: []
          },
          {
            id: 3,
            machine_id: 5,
            title: "External Auxiliary Fan Cooling",
            description: "Cooling pump casing temp exceeded 92°C. Hooked up auxiliary fan blowing on casing.",
            category: "Air Cooling",
            status: "active",
            risk_level: "high",
            confidence_score: 0.94,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            machine: { name: "Cooling Pump P8 (Coolant Cycle)" },
            operator: { name: "Marcus Vance", role: "supervisor", avatar_url: "" },
            ai_recommendation: "SAFETY ALERT: External fan cooling represents unstable thermal control. Suggest checking hydraulic blockages.",
            comments: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white/5 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/5 animate-pulse rounded-xl" />
          <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  // Active workarounds
  const activeInterventions = interventions.filter(i => i.status === "active" || i.status === "escalated");

  return (
    <div className="space-y-6">
      
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operational Command Center</h1>
          <p className="text-xs text-text-muted mt-1">Live overview of human overrides and machine vulnerabilities</p>
        </div>
        <Link 
          href="/dashboard/voice-capture"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-industrial hover:bg-amber-500 text-bg-dark transition-all duration-300 font-sans shadow-lg shadow-amber-industrial/10 flex items-center gap-2 max-w-max cursor-pointer"
        >
          <Mic className="h-4 w-4 text-bg-dark" />
          Log Temporary Fix
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-white/5 bg-card-dark relative overflow-hidden">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Active Workarounds</span>
          <div className="text-3xl font-extrabold text-white mt-2">
            {riskData?.summary?.active_workarounds || activeInterventions.length}
          </div>
          <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-industrial" />
            Unresolved operator interventions
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark relative overflow-hidden">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Vulnerable Machines</span>
          <div className="text-3xl font-extrabold text-red-500 mt-2">
            {riskData?.summary?.critical_machines || 0}
          </div>
          <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-red-500" />
            High failure risk threshold
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark relative overflow-hidden">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Turnaround Delay</span>
          <div className="text-3xl font-extrabold text-amber-industrial mt-2">7.6 Days</div>
          <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-amber-industrial" />
            Average time to permanent fix
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark relative overflow-hidden">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Shift handovers</span>
          <div className="text-3xl font-extrabold text-green-500 mt-2">100%</div>
          <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Shift A handover documented
          </p>
        </div>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Priority Incidents & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priority Incident Feed */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                <h3 className="text-sm font-bold text-white">Priority Workarounds requiring Attention</h3>
              </div>
              <span className="text-[10px] text-text-muted">Ranked by Failure Probability</span>
            </div>

            <div className="space-y-4">
              {activeInterventions.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border border-white/5 bg-bg-dark/40 hover:border-amber-industrial/25 transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                        item.risk_level === "high" ? "bg-red-500/10 text-red-500" : "bg-amber-industrial/10 text-amber-industrial"
                      }`}>
                        {item.risk_level} Risk
                      </span>
                      <span className="text-xs font-semibold text-white">{item.machine.name}</span>
                    </div>
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Active for {Math.floor((Date.now() - new Date(item.timestamp).getTime()) / (1000 * 60 * 60 * 24)) || 3} days
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed mb-3">{item.description}</p>
                  
                  {item.ai_recommendation && (
                    <div className="p-2.5 rounded bg-amber-industrial/5 border border-amber-industrial/15 text-[11px] text-amber-industrial flex gap-2 mb-3 items-start">
                      <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">AI Diagnostics Recommendation</span>
                        <p className="mt-0.5 leading-normal">{item.ai_recommendation}</p>
                      </div>
                    </div>
                  )}

                  {/* Comments preview */}
                  {item.comments && item.comments.length > 0 && (
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-semibold">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Shift Collaboration Thread ({item.comments.length})</span>
                      </div>
                      <div className="space-y-1.5 pl-5">
                        {item.comments.slice(0, 2).map((c: any, idx: number) => (
                          <div key={idx} className="text-[10px] text-text-muted leading-normal">
                            <span className="font-bold text-white">{c.user.name}:</span> "{c.text}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end gap-2">
                    <Link 
                      href={`/dashboard/machines/${item.machine_id}`}
                      className="px-3 py-1 text-[10px] font-semibold rounded bg-white/5 hover:bg-white/10 text-white border border-white/5 transition-all"
                    >
                      Inspect Memory
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Machine Operational Timeline */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <Clock className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">Live Plant Operational Timeline</h3>
            </div>

            <div className="relative border-l border-white/10 pl-6 space-y-6">
              {interventions.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline point */}
                  <span className={`absolute -left-[30px] top-1 h-4 w-4 rounded-full border-2 border-bg-dark flex items-center justify-center ${
                    item.status === "active" ? "bg-amber-industrial" : "bg-green-500"
                  }`} />

                  <div className="text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-text-muted">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className={`text-[10px] font-bold ${item.status === 'active' ? 'text-amber-industrial' : 'text-green-500'}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                    <p className="text-[11px] text-text-muted mt-1">Applied on <span className="text-white font-semibold">{item.machine.name}</span></p>
                    <p className="text-[11px] text-text-muted mt-1 leading-normal italic">"{item.description}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Attention Center & Shift Feed */}
        <div className="space-y-6">
          
          {/* AI Attention Center */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark glow-amber/5 relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 px-2 py-0.5 rounded bg-amber-industrial/10 border border-amber-industrial/25 text-[9px] font-bold text-amber-industrial flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI ENGAGED
            </div>
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <AlertCircle className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">AI Attention Focus</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded bg-bg-dark border border-white/5">
                <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider block">Critical Risk Decay</span>
                <p className="text-xs font-semibold text-white mt-1">Conveyor M3 speed restriction</p>
                <p className="text-[10px] text-text-muted mt-1">Active for 14 days without resolution. Stator core breakdown probability has increased to 87%.</p>
              </div>

              <div className="p-3 rounded bg-bg-dark border border-white/5">
                <span className="text-[9px] text-amber-industrial font-bold uppercase tracking-wider block">Unresolved Sensor Override</span>
                <p className="text-xs font-semibold text-white mt-1">Line 2 Sorting Jam Bypass</p>
                <p className="text-[10px] text-text-muted mt-1">Active for 6 days. PLC relay contacts bypassed physically. Safety limits compromised.</p>
              </div>

              <div className="p-3 rounded bg-bg-dark border border-white/5">
                <span className="text-[9px] text-green-500 font-bold uppercase tracking-wider block">Telemetry Anomaly</span>
                <p className="text-xs font-semibold text-white mt-1">Centrifuge C5 Balance</p>
                <p className="text-[10px] text-text-muted mt-1">Rotor imbalance logged before critical trip. Checks suggested operators altered dampening coefficients.</p>
              </div>
            </div>
          </div>

          {/* Shift Handover Intelligence */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber-industrial" />
                <h3 className="text-sm font-bold text-white">Shift Intelligence Feed</h3>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/25 font-bold uppercase">VERIFIED</span>
            </div>

            {shifts.map((item, idx) => (
              <div key={idx} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-text-muted block uppercase font-bold">Shift Supervisor</span>
                  <span className="text-white font-semibold">{item.supervisor.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block uppercase font-bold">AI Handover Summary</span>
                  <p className="text-text-muted leading-relaxed mt-1 p-2 bg-bg-dark/50 border border-white/5 rounded italic">"{item.summary}"</p>
                </div>
                <div>
                  <span className="text-[10px] text-text-muted block uppercase font-bold">Shift C Handover Directives</span>
                  <ul className="list-disc pl-4 text-text-muted space-y-1 mt-1 leading-normal">
                    <li>Log temperature casing on Cooling Pump P8 hourly.</li>
                    <li>Clean the photo sensors on Sorting Tray Assembly Hall C.</li>
                    <li>Verify Tuesday's downtime approval with logistics coordinator.</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
