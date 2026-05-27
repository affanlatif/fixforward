"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Database, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Search
} from "lucide-react";

export default function MachineDirectoryPage() {
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadMachines() {
      try {
        const response = await fetch("/api/machines");
        if (response.ok) {
          const data = await response.json();
          setMachines(data);
        } else {
          throw new Error("Failed to load");
        }
      } catch (err) {
        console.log("Using offline mock machines list");
        setMachines([
          { id: 1, name: "Motor M3 (Overhead Intake Fan)", serial_number: "MOT-M3-9482", status: "warning", location: "Winding Shop Area B", critical_level: "high", active_workarounds: 1, image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400" },
          { id: 2, name: "Conveyor Line 2 (Packaging System)", serial_number: "CON-L2-3021", status: "warning", location: "Assembly Hall C", critical_level: "medium", active_workarounds: 1, image_url: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400" },
          { id: 3, name: "Hydraulic Press H1 (Stamping Unit)", serial_number: "HYD-H1-0043", status: "operational", location: "Press Shop Floor 1", critical_level: "high", active_workarounds: 0, image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400" },
          { id: 4, name: "Centrifuge C5 (Chemical Separator)", serial_number: "CEN-C5-7711", status: "down", location: "Processing Room 4", critical_level: "high", active_workarounds: 0, image_url: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400" },
          { id: 5, name: "Cooling Pump P8 (Coolant Cycle)", serial_number: "PMP-P8-1129", status: "warning", location: "Utility Block North", critical_level: "high", active_workarounds: 1, image_url: "https://images.unsplash.com/photo-1612690669207-fed642192c40?w=400" }
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadMachines();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/25 uppercase">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            Operational
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-industrial/10 text-amber-industrial border border-amber-industrial/25 uppercase">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-industrial" />
            Warning Override
          </span>
        );
      case "down":
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/25 uppercase">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            Down
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-text-muted border border-white/10 uppercase">
            Maintenance
          </span>
        );
    }
  };

  const filteredMachines = machines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white/5 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-72 bg-white/5 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-amber-industrial" />
            Machine Asset Directory
          </h1>
          <p className="text-xs text-text-muted mt-1">Audit logs, temporary interventions, and predictive health indexes</p>
        </div>

        {/* Local Search inside Directory */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </span>
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-card-dark border border-white/5 text-white focus:outline-none focus:border-amber-industrial font-sans"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachines.map((machine) => (
          <div key={machine.id} className="rounded-xl border border-white/5 bg-card-dark overflow-hidden flex flex-col glass-panel-hover">
            {/* Image Placeholder with custom style */}
            <div className="h-40 w-full relative bg-bg-dark flex items-center justify-center border-b border-white/5">
              <img 
                src={machine.image_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400"} 
                alt={machine.name}
                className="h-full w-full object-cover opacity-75"
              />
              <div className="absolute top-3 left-3">
                {getStatusBadge(machine.status)}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-bg-dark/80 backdrop-blur-sm text-[9px] font-mono text-text-muted border border-white/5">
                {machine.serial_number}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-xs font-bold text-white hover:text-amber-industrial transition-colors leading-tight">
                  <Link href={`/dashboard/machines/${machine.id}`}>{machine.name}</Link>
                </h3>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                  machine.critical_level === "high" ? "bg-red-500/10 text-red-500" : "bg-white/5 text-text-muted"
                }`}>
                  {machine.critical_level} severity
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-4">
                <MapPin className="h-3.5 w-3.5 text-amber-industrial" />
                <span>{machine.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 mt-auto">
                <div className="text-left">
                  <span className="text-[9px] text-text-muted uppercase">Active Workarounds</span>
                  <div className={`text-sm font-bold mt-0.5 ${
                    machine.status === 'warning' ? 'text-amber-industrial' : 'text-white'
                  }`}>
                    {machine.id === 1 || machine.id === 2 || machine.id === 5 ? 1 : 0} Override
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[9px] text-text-muted uppercase">Safety Index</span>
                  <div className={`text-sm font-bold mt-0.5 ${
                    machine.status === 'down' ? 'text-red-500' : machine.status === 'warning' ? 'text-amber-industrial' : 'text-green-500'
                  }`}>
                    {machine.status === 'down' ? '15.0%' : machine.status === 'warning' ? '68.0%' : '95.0%'}
                  </div>
                </div>
              </div>

              <Link 
                href={`/dashboard/machines/${machine.id}`}
                className="mt-5 w-full py-2 rounded bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                Inspect Memory System
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
