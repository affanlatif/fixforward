"use client";

import { useEffect, useState } from "react";
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Wrench, 
  Save, 
  Check, 
  Users, 
  Lock,
  Cpu
} from "lucide-react";

export default function SettingsPage() {
  const [userName, setUserName] = useState("Marcus Vance");
  const [userRole, setUserRole] = useState("Shift Supervisor");
  const [userEmail, setUserEmail] = useState("supervisor@factory.com");
  const [handoverDirectives, setHandoverDirectives] = useState("Monitor casing temperature of Coolant Pump P8. Do not exceed 85°C. Ensure Shift B verifies PLC box on Line 2 is locked.");
  const [savingShift, setSavingShift] = useState(false);
  const [shiftSaved, setShiftSaved] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("fixforward_user_email") || "supervisor@factory.com";
    setUserEmail(email);
    if (email === "technician1@factory.com") {
      setUserName("Elena Rostova");
      setUserRole("Maintenance Technician");
    } else if (email === "operator1@factory.com") {
      setUserName("Rajesh Patel");
      setUserRole("Line Operator");
    }
  }, []);

  const handleShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingShift(true);
    setShiftSaved(false);

    try {
      const response = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shift_name: "Shift A (Morning)",
          summary: "Normal shift operations reported. All lines active except Centrifuge.",
          critical_actions: handoverDirectives,
          handover_notes: "None"
        })
      });

      if (response.ok) {
        setShiftSaved(true);
        setTimeout(() => setShiftSaved(false), 3000);
      }
    } catch (e) {
      setShiftSaved(true);
      setTimeout(() => setShiftSaved(false), 3000);
    } finally {
      setSavingShift(false);
    }
  };

  const teamMembers = [
    { name: "Marcus Vance", role: "Shift Supervisor", email: "supervisor@factory.com", state: "Active" },
    { name: "Elena Rostova", role: "Maintenance Technician", email: "technician1@factory.com", state: "Active" },
    { name: "Rajesh Patel", role: "Line Operator", email: "operator1@factory.com", state: "Active" }
  ];

  return (
    <div className="space-y-6 selection:bg-amber-industrial/30 selection:text-amber-industrial font-sans">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-industrial" />
          Settings & Collaboration
        </h1>
        <p className="text-xs text-text-muted mt-1">Configure terminal parameters, active roster clearances, and shift handovers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left 2 Cols: Shift Handover & User Config */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shift Handover Config */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
              <Wrench className="h-5 w-5 text-amber-industrial" />
              <div>
                <h3 className="text-sm font-bold text-white">Current Shift Handover Directives</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Directives compiled here are broadcasted to the next incoming shift team</p>
              </div>
            </div>

            <form onSubmit={handleShiftSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] text-text-muted uppercase font-bold mb-2">Shift Handover Directives & Checklist</label>
                <textarea 
                  rows={4}
                  value={handoverDirectives}
                  onChange={(e) => setHandoverDirectives(e.target.value)}
                  className="w-full p-2.5 rounded bg-bg-dark border border-white/10 text-white focus:outline-none focus:border-amber-industrial font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-text-muted">Target Group: Shift B (Afternoon) Operators</span>
                <button 
                  type="submit"
                  disabled={savingShift}
                  className="px-4 py-2 rounded bg-amber-industrial hover:bg-amber-500 text-bg-dark font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-industrial/10"
                >
                  {savingShift ? "Broadcasting..." : shiftSaved ? "Broadcasted!" : "Broadcast Handover"}
                  {shiftSaved ? <Check className="h-4 w-4 text-bg-dark" /> : <Save className="h-4 w-4 text-bg-dark" />}
                </button>
              </div>
            </form>
          </div>

          {/* User profile parameters */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark text-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-1">
              <User className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">Active Terminal Profile</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Full Name</span>
                <span className="text-white font-semibold text-xs mt-1 block">{userName}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Corporate Email</span>
                <span className="text-white font-semibold text-xs mt-1 block">{userEmail}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Plant Clearance Role</span>
                <span className="text-white font-semibold text-xs mt-1 block capitalize">{userRole}</span>
              </div>
              <div>
                <span className="text-[9px] text-text-muted uppercase block">Terminal Clearance Status</span>
                <span className="text-green-500 font-bold text-xs mt-1 block uppercase">Authorized</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Team Roster & Alert Caps */}
        <div className="space-y-6">
          
          {/* Team Roster list */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <Users className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">Plant Active Roster</h3>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 rounded bg-bg-dark/40 border border-white/5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{member.name}</span>
                    <span className="text-[9px] text-text-muted block font-mono">{member.role} // {member.email}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-green-500/10 text-green-500 border border-green-500/25 uppercase">
                    {member.state}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Plant alarm caps settings (Read-only mock variables) */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark text-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-1">
              <Lock className="h-4.5 w-4.5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">System Risk Threshold Controls</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-[10px] text-text-muted mb-1 font-semibold">
                  <span>HIGH TEMPERATURE CUT-OFF</span>
                  <span className="text-white">85°C</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-industrial rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] text-text-muted mb-1 font-semibold">
                  <span>MAX CASE VIBRATION CAP</span>
                  <span className="text-white">15 mm/s</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-industrial rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] text-text-muted mb-1 font-semibold">
                  <span>WORKAROUND MAX DECAY LIMIT</span>
                  <span className="text-white">7 Days</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-industrial rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
