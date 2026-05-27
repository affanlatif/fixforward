"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Mic, 
  Hourglass, 
  History, 
  TrendingUp, 
  Cpu, 
  AlertTriangle,
  Database,
  ArrowRight,
  Gauge,
  Factory,
  Car,
  Plane,
  Truck,
  Zap
} from "lucide-react";

export default function LandingPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoRequested, setDemoRequested] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoEmail) {
      setDemoRequested(true);
      setTimeout(() => {
        setDemoModalOpen(false);
        setDemoRequested(false);
        setDemoEmail("");
      }, 2500);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-dark text-text-light flex flex-col selection:bg-amber-industrial/30 selection:text-amber-industrial">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-industrial/10 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-industrial to-amber-600 flex items-center justify-center glow-amber">
            <ShieldAlert className="h-5 w-5 text-bg-dark stroke-[2.5]" />
          </div>
          <span className="font-bold tracking-tight text-xl text-white">Fix<span className="text-amber-industrial">Forward</span></span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
          <a href="#solution" className="hover:text-white transition-colors">Our Solution</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#sectors" className="hover:text-white transition-colors">Impact</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold hover:text-white text-text-muted transition-colors">
            Sign In
          </Link>
          <button 
            onClick={() => setDemoModalOpen(true)}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-industrial hover:bg-amber-500 text-bg-dark transition-all duration-300 font-sans shadow-lg shadow-amber-industrial/10 hover:shadow-amber-industrial/25 cursor-pointer"
          >
            Request Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-7xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-industrial/20 bg-amber-industrial/5 text-amber-industrial text-xs font-semibold tracking-wide mb-6 uppercase animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-industrial" />
          Industry 5.0 Operational Memory System
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-6">
          Prevent repeated industrial failures <br />
          <span className="bg-gradient-to-r from-amber-industrial via-amber-400 to-amber-500 bg-clip-text text-transparent">before they happen.</span>
        </h1>
        
        <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          FixForward transforms undocumented temporary fixes, verbal handovers, and physical workarounds into structured, searchable operational memory using AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            onClick={() => setDemoModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-lg bg-amber-industrial hover:bg-amber-500 text-bg-dark transition-all duration-300 shadow-xl shadow-amber-industrial/15 hover:shadow-amber-industrial/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            Request Demo
            <ArrowRight className="h-4 w-4 text-bg-dark" />
          </button>
          
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            View Platform
          </Link>
        </div>

        {/* Command Center Mockup */}
        <div className="relative rounded-xl border border-white/5 bg-card-dark/40 p-4 max-w-5xl mx-auto shadow-2xl overflow-hidden backdrop-blur-sm glow-amber/5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-xs text-text-muted ml-2 font-mono">fixforward-cmd-center // live</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Sidebar Mock */}
            <div className="border-r border-white/5 pr-4 hidden md:block">
              <div className="space-y-2">
                <div className="h-8 rounded bg-amber-industrial/15 border border-amber-industrial/25 flex items-center px-3 gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-industrial" />
                  <span className="text-xs font-semibold text-amber-industrial">Operations Feed</span>
                </div>
                <div className="h-8 rounded hover:bg-white/5 flex items-center px-3 gap-2 text-text-muted">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="text-xs">Machine Directory</span>
                </div>
                <div className="h-8 rounded hover:bg-white/5 flex items-center px-3 gap-2 text-text-muted">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="text-xs">AI Risk Center</span>
                </div>
                <div className="h-8 rounded hover:bg-white/5 flex items-center px-3 gap-2 text-text-muted">
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                  <span className="text-xs">Voice Capture</span>
                </div>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-lg bg-bg-dark/80 border border-red-500/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/10 text-red-500 uppercase tracking-wider">High Risk Intervention</span>
                  <span className="text-[10px] text-text-muted">Active 14 Days</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Manual Motor Speed De-rate to 60%</h4>
                <p className="text-xs text-text-muted mb-3">Conveyor M3 intake fan overheating. Target max RPM capped on VFD.</p>
                <div className="p-2 rounded bg-white/5 border border-white/5 text-[11px] text-amber-industrial flex gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                  <span>AI Recommendation: Operating at low RPM increases motor winding stress. Scheduled shutdown recommended.</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-dark/80 border border-white/5">
                  <span className="text-[10px] text-text-muted uppercase">Instability Score</span>
                  <div className="text-xl font-bold text-amber-industrial mt-1">87%</div>
                  <p className="text-[10px] text-text-muted mt-0.5">Critical risk threshold breached</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-dark/80 border border-white/5">
                  <span className="text-[10px] text-text-muted uppercase">Operational Memory</span>
                  <div className="text-xl font-bold text-white mt-1">4 Active</div>
                  <p className="text-[10px] text-text-muted mt-0.5">Undocumented interventions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 border-t border-white/5 bg-bg-dark/50 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">The Lost Operational Memory</h2>
            <p className="text-text-muted">
              Factories capture millions of machine telemetry data points every second. Yet, they lose the critical human interventions keeping those machines running.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card-dark border border-white/5 glass-panel">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-6">
                <Hourglass className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Undocumented Workarounds</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Technicians turn valve dials, override alarm limits, or reduce motor speeds to sustain production. These quick patches are never officially logged.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card-dark border border-white/5 glass-panel">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-6">
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verbal Handover Gaps</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Critical fixes are communicated verbally in passing or on whiteboard notes, vanishing instantly when shifts rotate. Future shifts inherit invisible risks.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-card-dark border border-white/5 glass-panel">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center mb-6">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Repeated Downtime</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Because the true operational history is missing, subsequent maintenance technicians run diagnostics from scratch, resulting in repeated downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                A structured repository for <br />
                <span className="text-amber-industrial">human operational intelligence.</span>
              </h2>
              <p className="text-text-muted mb-8 leading-relaxed">
                FixForward captures field observations and temporary workarounds via voice or text. Our system instantly parses the data, updates the machine’s operational history, and alerts future operators of pending risks.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded bg-amber-industrial/10 border border-amber-industrial/25 flex items-center justify-center text-amber-industrial font-bold font-mono">1</div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Capture on the Fly</h4>
                    <p className="text-sm text-text-muted mt-1">Technician records a quick voice description of the workaround directly from the shop floor.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded bg-amber-industrial/10 border border-amber-industrial/25 flex items-center justify-center text-amber-industrial font-bold font-mono">2</div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Extract Operational Variables</h4>
                    <p className="text-sm text-text-muted mt-1">AI details the affected machine, the workaround category, the actions taken, and the risk thresholds.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded bg-amber-industrial/10 border border-amber-industrial/25 flex items-center justify-center text-amber-industrial font-bold font-mono">3</div>
                  <div>
                    <h4 className="font-semibold text-white text-base">Predict & Safeguard</h4>
                    <p className="text-sm text-text-muted mt-1">Incoming shifts are automatically alerted before temporary fixes decay into catastrophic failures.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphic illustration */}
            <div className="relative rounded-xl border border-white/5 bg-card-dark p-8 glass-panel overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-industrial/15 flex items-center justify-center">
                    <Mic className="h-4 w-4 text-amber-industrial" />
                  </div>
                  <span className="text-xs text-text-muted font-mono">FIELD INPUT</span>
                </div>
                
                <div className="p-4 rounded-lg bg-bg-dark border border-white/5">
                  <p className="text-sm text-white italic">"Bypassed the cardboard sorting sensor on Conveyor 2 due to heavy dust accumulation..."</p>
                </div>

                <div className="flex justify-center my-4">
                  <div className="h-8 border-l border-dashed border-amber-industrial/30" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-industrial/15 flex items-center justify-center">
                    <Cpu className="h-4 w-4 text-amber-industrial" />
                  </div>
                  <span className="text-xs text-text-muted font-mono">FIXFORWARD COGNITIVE PARSING</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-bg-dark border border-white/5">
                    <span className="text-[10px] text-text-muted">MACHINE</span>
                    <div className="text-xs font-bold text-white mt-0.5">Conveyor Line 2</div>
                  </div>
                  <div className="p-3 rounded bg-bg-dark border border-white/5">
                    <span className="text-[10px] text-text-muted">CATEGORY</span>
                    <div className="text-xs font-bold text-white mt-0.5">Sensor Override</div>
                  </div>
                  <div className="p-3 rounded bg-bg-dark border border-white/5">
                    <span className="text-[10px] text-text-muted">RISK VALUE</span>
                    <div className="text-xs font-bold text-red-500 mt-0.5">Medium Risk</div>
                  </div>
                  <div className="p-3 rounded bg-bg-dark border border-white/5">
                    <span className="text-[10px] text-text-muted">CONFIDENCE</span>
                    <div className="text-xs font-bold text-green-500 mt-0.5">88% Match</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-white/5 bg-bg-dark/50 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Engineered for Operations</h2>
            <p className="text-text-muted">SaaS stability designed specifically for maintenance engineers and plant managers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-white/5 bg-card-dark glass-panel-hover">
              <Cpu className="h-8 w-8 text-amber-industrial mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">AI Operational Memory</h4>
              <p className="text-sm text-text-muted">Converts raw operator transcripts into structured technical variables and stores them under the machine registry.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/5 bg-card-dark glass-panel-hover">
              <ShieldAlert className="h-8 w-8 text-amber-industrial mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Repeat Failure Detection</h4>
              <p className="text-sm text-text-muted">Correlates new temporary fixes with historical failure trends to catch escalating breakdowns before they shut down lines.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/5 bg-card-dark glass-panel-hover">
              <Mic className="h-8 w-8 text-amber-industrial mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Voice-to-Operations Capture</h4>
              <p className="text-sm text-text-muted">Field-ready audio logging with mobile support. Speak for 10 seconds and have workarounds automatically classified.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/5 bg-card-dark glass-panel-hover">
              <Activity className="h-8 w-8 text-amber-industrial mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Shift Intelligence</h4>
              <p className="text-sm text-text-muted">Generates automatic operational handovers and checklist summaries for shift supervisors, eliminating handoff errors.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/5 bg-card-dark glass-panel-hover">
              <History className="h-8 w-8 text-amber-industrial mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Machine History Timeline</h4>
              <p className="text-sm text-text-muted">Interactive unified log tracking incidents, manual interventions, notes, and maintenance schedules over the lifetime of the asset.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/5 bg-card-dark glass-panel-hover">
              <TrendingUp className="h-8 w-8 text-amber-industrial mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Risk Prediction Engine</h4>
              <p className="text-sm text-text-muted">Calculates overall risk decay index based on age, category, and historical vulnerability metrics of each machine.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Impact Section */}
      <section id="sectors" className="py-24 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Heavy Industry</h2>
            <p className="text-text-muted">FixForward operates across multiple industrial verticals to eliminate repeating downtime.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-6 rounded-lg bg-card-dark/30 border border-white/5">
              <Factory className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <span className="text-xs font-semibold text-white">Manufacturing</span>
            </div>
            <div className="p-6 rounded-lg bg-card-dark/30 border border-white/5">
              <Car className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <span className="text-xs font-semibold text-white">Automotive</span>
            </div>
            <div className="p-6 rounded-lg bg-card-dark/30 border border-white/5">
              <Plane className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <span className="text-xs font-semibold text-white">Aerospace</span>
            </div>
            <div className="p-6 rounded-lg bg-card-dark/30 border border-white/5">
              <Truck className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <span className="text-xs font-semibold text-white">Logistics</span>
            </div>
            <div className="p-6 rounded-lg bg-card-dark/30 border border-white/5">
              <Zap className="h-8 w-8 text-text-muted mx-auto mb-3" />
              <span className="text-xs font-semibold text-white">Power Plants</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 border-t border-white/5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-industrial/5 via-transparent to-transparent text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Start capturing operational intelligence.</h2>
          <p className="text-text-muted mb-8 max-w-lg mx-auto">Reduce secondary machine failures by capturing what telemetry data misses.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setDemoModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-amber-industrial hover:bg-amber-500 text-bg-dark font-semibold transition-all cursor-pointer"
            >
              Request Live Demo
            </button>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
            >
              Access Command Center
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 bg-bg-dark py-8 px-6 text-center max-w-7xl mx-auto w-full text-xs text-text-muted flex flex-col md:flex-row items-center justify-between gap-4">
        <span>© 2026 FixForward Inc. All rights reserved. Built for Industry 5.0.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Technical Support</a>
        </div>
      </footer>

      {/* Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-xl bg-card-dark border border-amber-industrial/20 shadow-2xl relative glow-amber">
            <button 
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white text-lg font-bold"
            >
              ×
            </button>
            
            {demoRequested ? (
              <div className="text-center py-8">
                <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Request Received</h3>
                <p className="text-xs text-text-muted">We will reach out within 2 hours with access instructions.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit}>
                <h3 className="text-lg font-bold text-white mb-2">Request Platform Demo</h3>
                <p className="text-xs text-text-muted mb-4">Enter your corporate email to schedule a live command center tour.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-text-muted uppercase font-semibold mb-1">Corporate Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@company.com" 
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded bg-bg-dark border border-white/10 text-white focus:outline-none focus:border-amber-industrial font-sans"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded bg-amber-industrial hover:bg-amber-500 text-bg-dark font-semibold text-sm transition-all cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
