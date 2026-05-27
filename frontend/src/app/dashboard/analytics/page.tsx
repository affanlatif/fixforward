"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from "recharts";
import { 
  Compass, 
  Activity, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  PieChart as PieIcon,
  LineChart as LineIcon,
  Boxes
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFailureData() {
      try {
        const response = await fetch("/api/analytics/failures");
        if (response.ok) {
          const val = await response.json();
          setData(val);
        } else {
          throw new Error("Failed response");
        }
      } catch (err) {
        console.log("Using offline mock failure analytics data");
        setData({
          metrics: {
            total_downtime_hours: 36.0,
            correlation_percentage: 66.7,
            total_failures_logged: 3
          },
          correlated_vs_uncorrelated: [
            { name: "Caused by Repeated Workarounds", value: 2 },
            { name: "Independent Failures", value: 1 }
          ],
          failures_by_machine: [
            { machine: "Motor M3 (Overhead Intake Fan)", failures: 2 },
            { machine: "Centrifuge C5 (Chemical Separator)", failures: 1 }
          ],
          historical_timeline: [
            { month: "Jan", workarounds: 5, failures: 1, downtime: 4.5 },
            { month: "Feb", workarounds: 8, failures: 0, downtime: 0.0 },
            { month: "Mar", workarounds: 12, failures: 2, downtime: 12.0 },
            { month: "Apr", workarounds: 15, failures: 3, downtime: 24.5 },
            { month: "May", workarounds: 3, failures: 1, downtime: 12.0 }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    loadFailureData();
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

  const COLORS = ["#FFB347", "#4B5563"];

  return (
    <div className="space-y-6 selection:bg-amber-industrial/30 selection:text-amber-industrial font-sans">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Compass className="h-6 w-6 text-amber-industrial" />
          Failure & Workaround Analytics
        </h1>
        <p className="text-xs text-text-muted mt-1">Operational correlations between undocumented overrides and physical downtime</p>
      </div>

      {/* KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Total Plant Downtime</span>
          <div className="text-3xl font-extrabold text-white mt-2">{data.metrics.total_downtime_hours} Hours</div>
          <p className="text-[10px] text-text-muted mt-1 flex items-center justify-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-industrial" />
            Accrued over the current fiscal quarter
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Workaround Correlation</span>
          <div className="text-3xl font-extrabold text-amber-industrial mt-2">{data.metrics.correlation_percentage}%</div>
          <p className="text-[10px] text-text-muted mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="h-3.5 w-3.5 text-amber-industrial" />
            Failures preceded by un-logged patches
          </p>
        </div>

        <div className="p-5 rounded-xl border border-white/5 bg-card-dark text-center">
          <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Logged Failures</span>
          <div className="text-3xl font-extrabold text-red-500 mt-2">{data.metrics.total_failures_logged} Events</div>
          <p className="text-[10px] text-text-muted mt-1 flex items-center justify-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            Requires root-cause memory reviews
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Area Chart & Bar Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Timeline trend area chart */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <LineIcon className="h-5 w-5 text-amber-industrial" />
              <div>
                <h3 className="text-sm font-bold text-white">Historical Downtime Correlation Trend</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Tracking workarounds against downtime spikes month-over-month</p>
              </div>
            </div>

            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.historical_timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#9CA3AF" tickLine={false} />
                  <YAxis stroke="#9CA3AF" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#171A21", borderColor: "rgba(255,179,71,0.2)", borderRadius: "6px" }}
                    labelStyle={{ color: "#FFF", fontWeight: "bold" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="workarounds" name="Logged Workarounds" stroke="#FFB347" fillOpacity={0.1} fill="#FFB347" />
                  <Area type="monotone" dataKey="downtime" name="Downtime Hours" stroke="#EF4444" fillOpacity={0.1} fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset incident distribution bar chart */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <Boxes className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">Incident frequency by Machine</h3>
            </div>
            
            <div className="space-y-4">
              {data.failures_by_machine.map((item: any, idx: number) => (
                <div key={idx} className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-text-muted">
                    <span className="font-semibold text-white">{item.machine}</span>
                    <span>{item.failures} Failure Logs</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-industrial rounded-full"
                      style={{ width: `${(item.failures / data.metrics.total_failures_logged) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Correlation Pie Chart & Clusters */}
        <div className="space-y-6">
          
          {/* Correlation Pie chart */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <PieIcon className="h-5 w-5 text-amber-industrial" />
              <div>
                <h3 className="text-sm font-bold text-white">Failure Attribution Share</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Incident breakdown based on override memory links</p>
              </div>
            </div>

            <div className="h-52 w-full flex items-center justify-center text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.correlated_vs_uncorrelated}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.correlated_vs_uncorrelated.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#171A21", borderColor: "rgba(255,179,71,0.2)", borderRadius: "6px" }}
                    itemStyle={{ color: "#FFF" }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issue cluster categorization */}
          <div className="p-6 rounded-xl border border-white/5 bg-card-dark">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-industrial" />
              <h3 className="text-sm font-bold text-white">Recurring Failure Clusters</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded bg-bg-dark border border-white/5">
                <span className="font-bold text-white block">Thermal & Friction Overheats</span>
                <span className="text-[10px] text-text-muted block mt-0.5">Affecting: Motor M3, Cooling Pump P8</span>
                <p className="text-text-muted mt-1 leading-normal">
                  Common workaround vector: Fan cooling, manual RPM speed restriction on controllers.
                </p>
              </div>

              <div className="p-3 rounded bg-bg-dark border border-white/5">
                <span className="font-bold text-white block">Safety Limit / PLC bypasses</span>
                <span className="text-[10px] text-text-muted block mt-0.5">Affecting: Conveyor Line 2</span>
                <p className="text-text-muted mt-1 leading-normal">
                  Common workaround vector: Bridging sensor terminals in electrical cabinets to ignore alarm triggers.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
