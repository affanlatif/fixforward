"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  Database, 
  AlertTriangle, 
  Cpu, 
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  History
} from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "intervention" | "incident" | "machine">("all");

  const loadSearchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      } else {
        throw new Error("Failed response");
      }
    } catch (err) {
      console.log("Using offline mock search algorithm");
      // Fallback local matching simulation
      const mockSearchPool = [
        {
          type: "intervention",
          id: 1,
          title: "Manual Motor Speed De-rate to 60%",
          subtitle: "Workaround on Motor M3 (Overhead Intake Fan) (RPM Reduction)",
          description: "Motor fan drive reported overheating alarm (bearing temp reached 87°C). Capped RPM to 60% on VFD to prevent thermal cutoff. Operator Rajesh Patel reported: 'bearing temp was hitting 87, capping to 60 percent to keep line running.'",
          status: "active",
          score: 0.94,
          url: "/dashboard/machines/1",
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: "incident",
          id: 1,
          title: "Intake Fan Motor Bearing Failure",
          subtitle: "Incident Report - Motor M3 (CRITICAL)",
          description: "Motor locked up causing complete winding shop shutdown. Dry bearings led to friction weld. Root Cause: Dry bearings led to friction weld. Verbal shift handovers were lost.",
          status: "closed",
          score: 0.82,
          url: "/dashboard/machines/1",
          timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: "intervention",
          id: 3,
          title: "External Auxiliary Fan Cooling",
          subtitle: "Workaround on Cooling Pump P8 (Coolant Cycle) (Air Cooling)",
          description: "Auxiliary coolant pump casing temp exceeded 92°C. Placed auxiliary fan blowing directly on motor casing. Operator reported: 'floor fan blowing directly on cooling pump P8 to keep casing temperature down.'",
          status: "active",
          score: 0.78,
          url: "/dashboard/machines/5",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: "machine",
          id: 5,
          title: "Cooling Pump P8 (Coolant Cycle)",
          subtitle: "Machine Directory - Utility Block North",
          description: "Serial: PMP-P8-1129. Critical Level: HIGH. Operational Status: WARNING.",
          status: "warning",
          score: 0.68,
          url: "/dashboard/machines/5",
          timestamp: new Date().toISOString()
        }
      ];

      // Simulate a search vector matching
      const q_lower = searchQuery.toLowerCase();
      const filtered = mockSearchPool.filter(item => 
        item.title.toLowerCase().includes(q_lower) ||
        item.description.toLowerCase().includes(q_lower) ||
        item.subtitle.toLowerCase().includes(q_lower)
      );
      
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      loadSearchResults(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
      loadSearchResults(query);
    }
  };

  const filteredResults = results.filter(r => 
    activeFilter === "all" ? true : r.type === activeFilter
  );

  const getResultIcon = (type: string) => {
    switch (type) {
      case "machine":
        return <Database className="h-4.5 w-4.5 text-blue-400" />;
      case "incident":
        return <AlertTriangle className="h-4.5 w-4.5 text-red-400" />;
      default:
        return <Cpu className="h-4.5 w-4.5 text-amber-industrial" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Box */}
      <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </span>
            <input 
              type="text" 
              placeholder="Query past workarounds, notes, or incident roots (e.g., 'motor overheating after night shifts')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm rounded bg-bg-dark border border-white/10 text-white focus:outline-none focus:border-amber-industrial font-sans"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-2.5 rounded bg-amber-industrial hover:bg-amber-500 text-bg-dark font-bold text-sm transition-all shadow-lg shadow-amber-industrial/10 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter chips */}
        {results.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5 text-[11px] font-semibold text-text-muted">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-full border transition-all ${
                activeFilter === "all" ? "bg-amber-industrial/15 text-amber-industrial border-amber-industrial/25" : "border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              All Matches ({results.length})
            </button>
            <button 
              onClick={() => setActiveFilter("intervention")}
              className={`px-3 py-1 rounded-full border transition-all ${
                activeFilter === "intervention" ? "bg-amber-industrial/15 text-amber-industrial border-amber-industrial/25" : "border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              Workarounds ({results.filter(r => r.type === "intervention").length})
            </button>
            <button 
              onClick={() => setActiveFilter("incident")}
              className={`px-3 py-1 rounded-full border transition-all ${
                activeFilter === "incident" ? "bg-amber-industrial/15 text-amber-industrial border-amber-industrial/25" : "border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              Incident Logs ({results.filter(r => r.type === "incident").length})
            </button>
            <button 
              onClick={() => setActiveFilter("machine")}
              className={`px-3 py-1 rounded-full border transition-all ${
                activeFilter === "machine" ? "bg-amber-industrial/15 text-amber-industrial border-amber-industrial/25" : "border-white/5 hover:border-white/10 hover:text-white"
              }`}
            >
              Machinery ({results.filter(r => r.type === "machine").length})
            </button>
          </div>
        )}
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white/5 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          filteredResults.map((res: any, idx: number) => (
            <div key={idx} className="p-5 rounded-xl border border-white/5 bg-card-dark flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-amber-industrial/20 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getResultIcon(res.type)}
                  <span className="text-xs font-bold text-white leading-none">{res.title}</span>
                  <span className="text-[10px] text-text-muted font-mono leading-none">({res.type.toUpperCase()})</span>
                </div>
                
                <span className="text-[10px] text-text-muted block leading-none">{res.subtitle}</span>
                <p className="text-xs text-text-muted leading-relaxed italic">
                  "{res.description}"
                </p>
                
                {res.timestamp && (
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Logged {new Date(res.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 shrink-0 gap-3">
                <div className="text-right">
                  <span className="text-[8px] text-text-muted block uppercase">Match relevance</span>
                  <span className="text-xs font-extrabold text-amber-industrial flex items-center gap-1 justify-end">
                    <Sparkles className="h-3.5 w-3.5" />
                    {Math.round(res.score * 100)}%
                  </span>
                </div>

                <Link 
                  href={res.url}
                  className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white font-semibold text-xs border border-white/5 transition-all flex items-center gap-1"
                >
                  View Context
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : query ? (
          <div className="p-8 rounded-xl border border-white/5 bg-card-dark text-center text-xs">
            <HelpCircle className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <h3 className="font-bold text-white">No matching operational records found</h3>
            <p className="text-text-muted mt-1 max-w-sm mx-auto">Try refining your terms. Search fields cover titles, operator comments, workaround descriptions, and failure causes.</p>
          </div>
        ) : (
          <div className="p-12 rounded-xl border border-white/5 bg-card-dark text-center text-xs">
            <History className="h-12 w-12 text-amber-industrial/40 mx-auto mb-3" />
            <h3 className="font-bold text-white text-sm">Semantic Knowledge Search</h3>
            <p className="text-text-muted mt-1.5 max-w-md mx-auto leading-relaxed">
              Query past machine failures and temporary override logs. E.g. search: "motor overheating after night shifts" or "sorting jam plc bypass".
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default function KnowledgeSearchPage() {
  return (
    <Suspense fallback={<div className="text-xs text-text-muted">Loading search terminal...</div>}>
      <SearchContent />
    </Suspense>
  );
}
