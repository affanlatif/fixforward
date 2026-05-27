"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Send,
  PlusCircle,
  HelpCircle,
  Activity,
  History,
  XCircle,
  Wrench
} from "lucide-react";

export default function MachineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [resolutionDetails, setResolutionDetails] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Load details
  async function loadDetails() {
    try {
      const response = await fetch(`/api/machines/${id}`);
      if (response.ok) {
        const resData = await response.json();
        setData(resData);
      } else {
        throw new Error("Failed to load");
      }
    } catch (err) {
      console.log("Using offline mock machine detail data");
      // Setup mock data based on id
      const mockMachines: Record<string, any> = {
        "1": {
          machine: { id: 1, name: "Motor M3 (Overhead Intake Fan)", serial_number: "MOT-M3-9482", status: "warning", location: "Winding Shop Area B", critical_level: "high", image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800", last_updated: new Date().toISOString() },
          interventions: [
            {
              id: 1,
              title: "Manual Motor Speed De-rate to 60%",
              description: "Motor fan drive reported overheating alarm (bearing temp reached 87°C). Capped RPM to 60% on VFD to prevent thermal cutoff and sustain line output.",
              category: "RPM Reduction",
              action_taken: "Modified parameters in VFD enclosure to limit frequency max. Tagged VFD controller.",
              status: "active",
              risk_level: "high",
              timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              ai_recommendation: "CRITICAL ALERT: Speed restriction masks lubrication failure or bearing disintegration. Winding temperatures will rise over time. Schedule bearing replacement and alignment checks within 48h.",
              operator: { name: "Rajesh Patel", role: "operator", avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
              comments: [
                { id: 1, timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), user: { name: "Marcus Vance", avatar_url: "" }, text: "Ensure Shift C checks bearing casing temp with IR thermometer during rounds." },
                { id: 2, timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), user: { name: "Elena Rostova", avatar_url: "" }, text: "Checked. IR casing temp is 84°C even at 60% speed. Loud bearing hum is audible." }
              ]
            }
          ],
          incidents: [
            { id: 1, title: "Intake Fan Motor Bearing Failure", description: "Motor locked up causing complete winding shop shutdown. 12 hours downtime. It was discovered operator knew about squealing noise but never logged a ticket.", severity: "critical", status: "closed", timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), downtime_hours: 12.0, root_cause_analysis: "Dry bearings led to friction weld. Verbal shift handovers were lost." }
          ],
          risk_summary: { machine_name: "Motor M3 (Overhead Intake Fan)", failure_probability: 87.0, safety_status: "critical", risk_factors: ["1 active temporary workaround unresolved for > 10 days", "Recurring speed reductions", "Historical bearing lockups on this drive"], safety_summary: "Critical failure imminent. Reduced RPM masks mechanical bearing disintegration. Schedule motor swap immediately." }
        },
        "2": {
          machine: { id: 2, name: "Conveyor Line 2 (Packaging System)", serial_number: "CON-L2-3021", status: "warning", location: "Assembly Hall C", critical_level: "medium", image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800", last_updated: new Date().toISOString() },
          interventions: [
            {
              id: 2,
              title: "Bypassed Optical Feed Jam Sensor",
              description: "Optical sensor was triggering false alarms every 15 mins due to cardboard dust. Bypassed contacts in PLC rack 2 (IO slot 4, wire 102) to maintain line speed.",
              category: "Sensor Override",
              action_taken: "Jumper cable placed in terminal cabinet to force sensor output high.",
              status: "active",
              risk_level: "medium",
              timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              ai_recommendation: "WARNING: Safety override bypasses automatic jam detection. Conveyor will not stop if cardboard jams, risking mechanical belt ripping and gearbox damage. Clean optical glass with compressed air.",
              operator: { name: "Elena Rostova", role: "technician", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
              comments: [
                { id: 1, timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), user: { name: "Marcus Vance", avatar_url: "" }, text: "Bypassing sensors violates protocol. Remove this jumper once Friday night line cleanup starts." }
              ]
            }
          ],
          incidents: [],
          risk_summary: { machine_name: "Conveyor Line 2", failure_probability: 58.0, safety_status: "warning", risk_factors: ["Active PLC bypass on safety jam sensor"], safety_summary: "Warning risk active. Hardware safety limits are disabled. Cardboard blockage could trigger belt tear." }
        },
        "5": {
          machine: { id: 5, name: "Cooling Pump P8 (Coolant Cycle)", serial_number: "PMP-P8-1129", status: "warning", location: "Utility Block North", critical_level: "high", image_url: "https://images.unsplash.com/photo-1612690669207-fed642192c40?w=800", last_updated: new Date().toISOString() },
          interventions: [
            {
              id: 3,
              title: "External Auxiliary Fan Cooling",
              description: "Pump housing temperature exceeded 92°C under full load. Placed a heavy duty temporary blower fan facing motor housing.",
              category: "Air Cooling",
              action_taken: "Auxiliary desk blower plugged in nearby socket blowing on casing.",
              status: "active",
              risk_level: "high",
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              ai_recommendation: "OPERATIONAL MEMORY: Casing temp at 92°C indicates low coolant fluid, high impeller friction, or winding decay. Blower fan masks core warning and introduces floor safety hazard. Schedule coolant loop inspection.",
              operator: { name: "Marcus Vance", role: "supervisor", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" },
              comments: []
            }
          ],
          incidents: [],
          risk_summary: { machine_name: "Cooling Pump P8", failure_probability: 65.0, safety_status: "warning", risk_factors: ["Undocumented external thermal dissipation (fan)"], safety_summary: "Auxiliary cooling stabilizes temperature temporarily but masks impeller friction. Pump inspection required." }
        }
      };

      // Default mock if ID doesn't match
      setData(mockMachines[id] || {
        machine: { id: parseInt(id), name: "Hydraulic Press H1 (Stamping Unit)", serial_number: "HYD-H1-0043", status: "operational", location: "Press Shop Floor 1", critical_level: "high", last_updated: new Date().toISOString() },
        interventions: [
          {
            id: 4,
            title: "Proportional Valve Pressure Bypass",
            description: "Spiked pressure at return stroke. Turned bypass relief dial by 1.5 turns to bleed off pressure.",
            category: "Valve Bypass",
            action_taken: "Opened manual relief valve to bypass flow.",
            status: "resolved",
            risk_level: "medium",
            timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            resolved_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            resolution_details: "Replaced proportional valve block. Reset relief valve to original calibration.",
            ai_recommendation: "Ensure bypass valve is closed after replacement to prevent pressure drops.",
            operator: { name: "Elena Rostova", role: "technician" },
            comments: []
          }
        ],
        incidents: [],
        risk_summary: { machine_name: "Hydraulic Press H1", failure_probability: 12.0, safety_status: "stable", risk_factors: [], safety_summary: "No active overrides. Operating within normal limits." }
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
  }, [id]);

  // Handle Comment submit
  const handleCommentSubmit = async (e: React.FormEvent, interventionId: number) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentsLoading(true);
    try {
      const response = await fetch(`/api/interventions/${interventionId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment })
      });

      if (response.ok) {
        const commentData = await response.json();
        // Append to local state
        const updatedInterventions = data.interventions.map((inter: any) => {
          if (inter.id === interventionId) {
            return {
              ...inter,
              comments: [...inter.comments, commentData]
            };
          }
          return inter;
        });
        setData({ ...data, interventions: updatedInterventions });
        setNewComment("");
      } else {
        throw new Error("Failed to post comment");
      }
    } catch (err) {
      // Mock append if API fails/offline
      const updatedInterventions = data.interventions.map((inter: any) => {
        if (inter.id === interventionId) {
          const fakeComment = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: { name: "Marcus Vance", role: "supervisor" },
            text: newComment
          };
          return {
            ...inter,
            comments: [...inter.comments, fakeComment]
          };
        }
        return inter;
      });
      setData({ ...data, interventions: updatedInterventions });
      setNewComment("");
    } finally {
      setCommentsLoading(false);
    }
  };

  // Handle Resolve Workaround
  const handleResolveWorkaround = async (interventionId: number) => {
    if (!resolutionDetails.trim()) return;

    try {
      const response = await fetch(`/api/interventions/${interventionId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution_details: resolutionDetails })
      });

      if (response.ok) {
        loadDetails();
        setResolvingId(null);
        setResolutionDetails("");
      } else {
        throw new Error("Failed to resolve");
      }
    } catch (err) {
      // Mock update local state if offline
      const updatedInterventions = data.interventions.map((inter: any) => {
        if (inter.id === interventionId) {
          return {
            ...inter,
            status: "resolved",
            resolved_at: new Date().toISOString(),
            resolution_details: resolutionDetails
          };
        }
        return inter;
      });
      setData({ 
        ...data, 
        interventions: updatedInterventions,
        machine: { ...data.machine, status: "operational" },
        risk_summary: { ...data.risk_summary, safety_status: "stable", failure_probability: 12.0, risk_factors: [], safety_summary: "All overrides resolved. Machine operating normally." }
      });
      setResolvingId(null);
      setResolutionDetails("");
    }
  };

  // Handle Escalate
  const handleEscalateWorkaround = async (interventionId: number) => {
    try {
      const response = await fetch(`/api/interventions/${interventionId}/escalate`, {
        method: "POST"
      });

      if (response.ok) {
        loadDetails();
      } else {
        throw new Error("Failed to escalate");
      }
    } catch (err) {
      const updatedInterventions = data.interventions.map((inter: any) => {
        if (inter.id === interventionId) {
          return {
            ...inter,
            status: "escalated",
            risk_level: "high"
          };
        }
        return inter;
      });
      setData({ 
        ...data, 
        interventions: updatedInterventions,
        machine: { ...data.machine, status: "down" },
        risk_summary: { ...data.risk_summary, safety_status: "critical", failure_probability: 95.0, safety_summary: "High risk override escalated. Machine shutdown in effect." }
      });
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-32 bg-white/5 animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white/5 animate-pulse rounded-xl" />
          <div className="h-96 bg-white/5 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  const { machine, interventions, incidents, risk_summary } = data;
  const activeFixes = interventions.filter((i: any) => i.status === "active" || i.status === "escalated");

  return (
    <div className="space-y-6 selection:bg-amber-industrial/30 selection:text-amber-industrial">
      
      {/* Back link */}
      <div>
        <Link href="/dashboard/machines" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>

      {/* Machine Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-4">
          {machine.image_url && (
            <img 
              src={machine.image_url} 
              alt={machine.name}
              className="h-16 w-16 rounded-lg object-cover border border-white/10 hidden sm:block"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{machine.name}</h1>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                machine.status === 'operational' ? 'bg-green-500/10 text-green-500' : machine.status === 'down' ? 'bg-red-500/10 text-red-500' : 'bg-amber-industrial/10 text-amber-industrial'
              }`}>
                {machine.status}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-1 font-mono">Serial: {machine.serial_number} // Location: {machine.location}</p>
          </div>
        </div>

        {activeFixes.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-industrial animate-ping" />
            <span className="text-xs font-bold text-amber-industrial">{activeFixes.length} Active Override Locked in Memory</span>
          </div>
        )}
      </div>

      {/* Main detail columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Collaborative Chat & Override Description (ChatGPT style) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Workarounds Details */}
          {activeFixes.map((item: any) => (
            <div key={item.id} className="p-6 rounded-xl border border-amber-industrial/15 bg-card-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-amber-industrial/5 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-industrial/10 text-amber-industrial uppercase tracking-wider">
                    Active {item.category} Override
                  </span>
                  <h3 className="text-sm font-bold text-white mt-2">{item.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-text-muted">Confidence: {Math.round(item.confidence_score * 100)}%</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Operator Transcript Note</span>
                  <p className="text-text-muted mt-1 leading-relaxed italic p-3 bg-bg-dark/50 border border-white/5 rounded">
                    "{item.description}"
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-text-muted uppercase font-bold block">Temporary Intervention Action Taken</span>
                  <p className="text-text-muted mt-1 leading-relaxed">
                    {item.action_taken}
                  </p>
                </div>

                <div className="p-3.5 rounded bg-amber-industrial/5 border border-amber-industrial/15 text-amber-industrial flex gap-3 items-start">
                  <Sparkles className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs">AI Operational Safeguard Recommendation</span>
                    <p className="mt-1 leading-relaxed text-[11px]">{item.ai_recommendation}</p>
                  </div>
                </div>

                {/* Supervisor/Technician Resolution Box */}
                {resolvingId === item.id ? (
                  <div className="p-4 rounded-lg bg-bg-dark border border-amber-industrial/20 space-y-3">
                    <span className="text-[10px] text-amber-industrial uppercase font-bold block">Complete Permanent Repair Log</span>
                    <textarea 
                      required
                      placeholder="Specify the replacement parts, calibrations, and verification tests completed to return the machine to nominal state..."
                      value={resolutionDetails}
                      onChange={(e) => setResolutionDetails(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded bg-card-dark border border-white/10 text-xs text-white focus:outline-none focus:border-amber-industrial font-sans"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setResolvingId(null)}
                        className="px-3 py-1.5 text-[10px] font-semibold rounded bg-white/5 text-white hover:bg-white/10"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleResolveWorkaround(item.id)}
                        className="px-3 py-1.5 text-[10px] font-bold rounded bg-green-500 hover:bg-green-600 text-bg-dark flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-bg-dark" />
                        Log Resolution
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-text-muted">Logged by {item.operator.name} ({item.operator.role})</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEscalateWorkaround(item.id)}
                        className="px-3 py-1.5 text-[10px] font-bold rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all cursor-pointer"
                      >
                        Escalate Warning
                      </button>
                      <button 
                        onClick={() => setResolvingId(item.id)}
                        className="px-3 py-1.5 text-[10px] font-bold rounded bg-green-500 hover:bg-green-600 text-bg-dark flex items-center gap-1 cursor-pointer"
                      >
                        <Wrench className="h-3.5 w-3.5 text-bg-dark" />
                        Resolve Workaround
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Collaborative Comments Thread (ChatGPT style) */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4 text-amber-industrial" />
                  <span>Operations Handover Discussion ({item.comments.length})</span>
                </div>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {item.comments.map((c: any) => (
                    <div key={c.id} className="p-3 rounded-lg bg-bg-dark/40 border border-white/5 flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-amber-industrial/10 border border-amber-industrial/25 flex items-center justify-center font-bold text-[9px] text-amber-industrial shrink-0">
                        {c.user.name.charAt(0)}
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.user.name}</span>
                          <span className="text-[9px] text-text-muted">
                            {new Date(c.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-text-muted leading-relaxed">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Posting Input */}
                <form onSubmit={(e) => handleCommentSubmit(e, item.id)} className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
                  <input 
                    type="text" 
                    placeholder="Contribute to this override discussion (e.g. casing temperatures, vibrations)..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={commentsLoading}
                    className="flex-1 px-3 py-2 text-xs rounded bg-bg-dark border border-white/10 text-white focus:outline-none focus:border-amber-industrial font-sans"
                  />
                  <button 
                    type="submit"
                    disabled={commentsLoading}
                    className="p-2 rounded bg-amber-industrial hover:bg-amber-500 text-bg-dark transition-colors cursor-pointer"
                  >
                    <Send className="h-4 w-4 text-bg-dark" />
                  </button>
                </form>
              </div>

            </div>
          ))}

          {/* If no active overrides */}
          {activeFixes.length === 0 && (
            <div className="p-8 rounded-xl border border-white/5 bg-card-dark text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No active temporary overrides</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">This machine is operating within normal telemetry parameters. No human bypass overrides are currently active in operational memory.</p>
              <div className="mt-4">
                <Link 
                  href="/dashboard/voice-capture"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-amber-industrial hover:bg-amber-500 text-bg-dark"
                >
                  <PlusCircle className="h-4 w-4 text-bg-dark" />
                  Log Field Workaround
                </Link>
              </div>
            </div>
          )}

          {/* Historical Resolved Workarounds List */}
          {interventions.filter((i: any) => i.status === "resolved").length > 0 && (
            <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                <History className="h-5 w-5 text-green-500" />
                <h3 className="text-sm font-bold text-white">Operational Memory History</h3>
              </div>

              <div className="space-y-4">
                {interventions.filter((i: any) => i.status === "resolved").map((item: any) => (
                  <div key={item.id} className="p-3.5 rounded-lg border border-white/5 bg-bg-dark/30 text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] text-text-muted">
                        Resolved {new Date(item.resolved_at).toLocaleDateString()}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/25 uppercase font-bold">
                        Resolved
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                    <p className="text-text-muted mt-1 leading-relaxed">"{item.description}"</p>
                    <div className="p-2.5 rounded bg-white/5 border border-white/5 text-[11px] text-text-muted mt-2">
                      <span className="font-bold text-white block">Permanent Technical Resolution:</span>
                      <p className="mt-0.5 leading-relaxed italic">"{item.resolution_details}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI Risk Predictor & Details (Linear style) */}
        <div className="space-y-6">
          
          {/* AI Risk Score Index */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark glow-amber/5 relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 px-2 py-0.5 rounded bg-amber-industrial/10 border border-amber-industrial/25 text-[9px] font-bold text-amber-industrial">
              AI RISK ASSESSMENT
            </div>

            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <Activity className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">Risk Risk Score</h3>
            </div>

            <div className="text-center py-4">
              {/* Failure probability dial */}
              <div className="inline-flex flex-col items-center justify-center p-6 rounded-full border-4 border-dashed border-amber-industrial/20 relative mb-4">
                <span className={`text-3xl font-extrabold ${
                  risk_summary.safety_status === 'critical' ? 'text-red-500' : 'text-amber-industrial'
                }`}>{risk_summary.failure_probability}%</span>
                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider mt-1">Probability of failure</span>
              </div>

              <div className="text-xs text-left space-y-3 mt-2">
                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold">Status Assessment</span>
                  <p className={`font-bold mt-0.5 capitalize ${
                    risk_summary.safety_status === 'critical' ? 'text-red-500 animate-pulse' : 'text-amber-industrial'
                  }`}>{risk_summary.safety_status}</p>
                </div>

                <div>
                  <span className="text-[9px] text-text-muted uppercase font-bold">Safety Summary</span>
                  <p className="text-text-muted mt-1 leading-normal">
                    {risk_summary.safety_summary}
                  </p>
                </div>

                {risk_summary.risk_factors && risk_summary.risk_factors.length > 0 && (
                  <div>
                    <span className="text-[9px] text-text-muted uppercase font-bold block mb-1">Vulnerability Vector Factors</span>
                    <ul className="list-disc pl-4 text-text-muted space-y-1 leading-normal">
                      {risk_summary.risk_factors.map((f: string, idx: number) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Historical Outage Incidents */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <XCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-sm font-bold text-white">Historical Downtime Outages</h3>
            </div>

            <div className="space-y-4">
              {incidents.map((inc: any) => (
                <div key={inc.id} className="p-3 rounded bg-bg-dark border border-white/5 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-xs">{inc.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-red-500/10 text-red-500 uppercase">
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    {inc.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[8px] text-text-muted uppercase block">Downtime</span>
                      <span className="text-white font-bold">{inc.downtime_hours} Hours</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-text-muted uppercase block">Date</span>
                      <span className="text-white">{new Date(inc.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {inc.root_cause_analysis && (
                    <div className="text-[10px] text-text-muted leading-normal bg-white/5 p-2 rounded">
                      <span className="font-bold text-white block">Root Cause Audit:</span>
                      <p className="mt-0.5">{inc.root_cause_analysis}</p>
                    </div>
                  )}
                </div>
              ))}

              {incidents.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No critical failure outages logged in history.</p>
              )}
            </div>
          </div>

          {/* Machinery Metadata details */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark text-xs space-y-4">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block border-b border-white/5 pb-2">Asset Parameters</span>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Location Tag</span>
                <span className="text-white font-semibold">{machine.location}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase block">System Criticality</span>
                <span className="text-white font-semibold capitalize">{machine.critical_level}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Operational State</span>
                <span className="text-white font-semibold capitalize">{machine.status}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Last Audited</span>
                <span className="text-white">{new Date(machine.last_updated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
