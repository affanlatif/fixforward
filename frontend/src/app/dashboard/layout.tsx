"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Activity, 
  Mic, 
  Gauge, 
  Database, 
  Settings, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  Compass,
  Power,
  ChevronDown
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Active Workaround Decay Alarm",
      desc: "Cooling Pump P8 aux fan running for > 3 days. Risk of stator lock.",
      time: "2h ago",
      read: false
    },
    {
      id: 2,
      title: "Vibration Threshold Warning",
      desc: "Motor M3 casing vibration increased by 14% at 60% RPM.",
      time: "5h ago",
      read: false
    }
  ]);
  const [userName, setUserName] = useState("Marcus Vance");
  const [userRole, setUserRole] = useState("Shift Supervisor");
  const [userAvatar, setUserAvatar] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check auth, load user email
    const token = localStorage.getItem("fixforward_token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    const email = localStorage.getItem("fixforward_user_email");
    if (email === "technician1@factory.com") {
      setUserName("Elena Rostova");
      setUserRole("Maintenance Technician");
      setUserAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face");
    } else if (email === "operator1@factory.com") {
      setUserName("Rajesh Patel");
      setUserRole("Line Operator");
      setUserAvatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("fixforward_token");
    localStorage.removeItem("fixforward_user_email");
    router.push("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Activity },
    { name: "Machine Directory", href: "/dashboard/machines", icon: Database },
    { name: "Voice Capture", href: "/dashboard/voice-capture", icon: Mic },
    { name: "AI Risk Center", href: "/dashboard/risk-center", icon: Gauge },
    { name: "Failure Analytics", href: "/dashboard/analytics", icon: Compass },
    { name: "Knowledge Search", href: "/dashboard/search", icon: Search },
    { name: "Settings & Team", href: "/dashboard/settings", icon: Settings },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex h-screen bg-bg-dark text-text-light overflow-hidden font-sans selection:bg-amber-industrial/30 selection:text-amber-industrial">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-white/5 bg-card-dark/40 backdrop-blur-sm p-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-white/5 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-industrial to-amber-600 flex items-center justify-center glow-amber">
            <ShieldAlert className="h-4.5 w-4.5 text-bg-dark stroke-[2.5]" />
          </div>
          <span className="font-bold tracking-tight text-lg text-white">Fix<span className="text-amber-industrial">Forward</span></span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-amber-industrial/10 text-amber-industrial border-l-2 border-amber-industrial" 
                    : "text-text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-amber-industrial" : "text-text-muted"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <div className="flex items-center gap-3 px-2 py-1 mb-3">
            <img 
              src={userAvatar} 
              alt={userName}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate leading-none mb-1">{userName}</h4>
              <span className="text-[10px] text-text-muted block leading-none">{userRole}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Power className="h-4 w-4" />
            Terminal Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-bg-dark/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          
          {/* Left search */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded hover:bg-white/5 text-text-muted hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>

            <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-muted" />
              </span>
              <input 
                type="text" 
                placeholder="Search past workarounds, machines, and failures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded bg-card-dark border border-white/5 text-white focus:outline-none focus:border-amber-industrial font-sans"
              />
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            
            {/* Shift profile status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-amber-industrial/5 border border-amber-industrial/15 text-[10px] font-bold text-amber-industrial tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-industrial animate-ping" />
              Shift A (Morning) Active
            </div>

            {/* Notifications Trigger */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-bg-dark" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-lg border border-white/5 bg-card-dark shadow-2xl p-4 z-50 glass-panel">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                    <span className="text-xs font-bold text-white">Attention Center</span>
                    <button 
                      onClick={markAllRead}
                      className="text-[10px] text-amber-industrial hover:underline cursor-pointer"
                    >
                      Mark read
                    </button>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-2.5 rounded text-xs border ${
                          notif.read ? "bg-transparent border-white/5" : "bg-amber-industrial/5 border-amber-industrial/10"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`font-semibold ${notif.read ? "text-white" : "text-amber-industrial"}`}>{notif.title}</span>
                          <span className="text-[9px] text-text-muted">{notif.time}</span>
                        </div>
                        <p className="text-[10px] text-text-muted mt-1 leading-normal">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shift User avatar */}
            <div className="flex items-center gap-2 border-l border-white/5 pl-4">
              <img 
                src={userAvatar} 
                alt={userName}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
              />
              <span className="text-xs font-semibold text-white hidden sm:block truncate max-w-[100px]">{userName.split(' ')[0]}</span>
            </div>

          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-bg-dark relative">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-64 bg-card-dark border-r border-white/5 p-4 flex flex-col relative animate-slide-in">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 px-3 py-4 border-b border-white/5 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-industrial to-amber-600 flex items-center justify-center">
                <ShieldAlert className="h-4.5 w-4.5 text-bg-dark stroke-[2.5]" />
              </div>
              <span className="font-bold tracking-tight text-lg text-white">Fix<span className="text-amber-industrial">Forward</span></span>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-amber-industrial/10 text-amber-industrial" 
                        : "text-text-muted hover:text-white"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/5 pt-4">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <Power className="h-4 w-4" />
                Terminal Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
