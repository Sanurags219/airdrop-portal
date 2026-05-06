"use client";

import { useAccount, useBalance } from "wagmi";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect, WalletDropdownLink } from "@coinbase/onchainkit/wallet";
import { Avatar, Name, Identity, Address, EthBalance } from "@coinbase/onchainkit/identity";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  LayoutDashboard, 
  BarChart3, 
  Search, 
  ShieldCheck, 
  Gift, 
  ChevronRight, 
  CircleDot,
  ArrowUpRight,
  Zap,
  ExternalLink,
  Info,
  Filter,
  ArrowUpDown,
  Coins,
  X,
  Lock,
  Calendar,
  AlertCircle,
  Bell,
  BellOff
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

const CHART_DATA = [
  { name: "May 12", volume: 4000 },
  { name: "May 15", volume: 3000 },
  { name: "May 18", volume: 2000 },
  { name: "May 21", volume: 2780 },
  { name: "May 24", volume: 1890 },
  { name: "May 27", volume: 2390 },
  { name: "May 30", volume: 3490 },
  { name: "Jun 02", volume: 4000 },
  { name: "Jun 05", volume: 3800 },
  { name: "Jun 08", volume: 4500 },
  { name: "Jun 11", volume: 5200 },
];

const AIRDROPS_DATA = [
  {
    id: 1,
    name: "Aerodrome Finance",
    description: "Incentive Program V2",
    status: "Claimable",
    highlight: true,
    href: "https://aerodrome.finance/airdrop",
    estValue: 180.00,
    criteria: "Liquidity provision min $500 or active voting in Epoch 32"
  },
  {
    id: 2,
    name: "Base Paint NFTs",
    description: "Genesis Contributor",
    status: "Info",
    highlight: false,
    estValue: 150.00,
    criteria: "Minted Genesis Day NFT and held for 30+ days"
  },
  {
    id: 3,
    name: "Debridge Finance",
    description: "Cross-chain reward",
    status: "Claimable",
    highlight: true,
    href: "https://debridge.foundation/",
    estValue: 350.00,
    criteria: "Accumulated 1000+ points through cross-chain transfers to Base"
  },
  {
    id: 4,
    name: "Warpcast Nodes",
    description: "Farcaster Ecosystem",
    status: "Info",
    highlight: false,
    estValue: 100.00,
    criteria: "Active Warpcast channel owner or high engagement hub node host"
  },
  {
    id: 5,
    name: "Zora Network",
    description: "L2 Creator Rewards",
    status: "Ended",
    highlight: false,
    estValue: 50.00,
    criteria: "Deployed 3+ creator collections on Base-Zora bridge"
  }
];

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);

  // Airdrop filter states
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortByValue, setSortByValue] = useState<"desc" | "asc" | null>("desc");

  // Staking Modal State
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedAirdrop, setSelectedAirdrop] = useState<any>(null);

  // Notifications State
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [activeNotification, setActiveNotification] = useState<any>(null);

  useEffect(() => {
    // Avoid sync state update in effect body to satisfy linter
    const mount = () => setMounted(true);
    mount();
    
    // Simulate a new airdrop notification alert
    const timer = setTimeout(() => {
      if (isNotificationEnabled) {
        setActiveNotification({
          title: "New Airdrop Detected!",
          message: "Base Protocol just announced a new incentive program. Check your eligibility.",
          icon: <Gift className="text-blue-500" />
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isNotificationEnabled]);

  const toggleNotifications = () => {
    setIsNotificationEnabled(!isNotificationEnabled);
    if (!isNotificationEnabled) {
      // Show confirmation
      setActiveNotification({
        title: "Notifications Enabled",
        message: "You will now receive alerts for new claimable airdrops on Base.",
        icon: <Bell className="text-green-500" />
      });
    }
  };

  const filteredAirdrops = useMemo(() => {
    let list = [...AIRDROPS_DATA];
    
    // Filter by status
    if (statusFilter !== "All") {
      list = list.filter(item => item.status === statusFilter);
    }
    
    // Sort by value
    if (sortByValue) {
      list.sort((a, b) => {
        if (sortByValue === "desc") return b.estValue - a.estValue;
        return a.estValue - b.estValue;
      });
    }
    
    return list;
  }, [statusFilter, sortByValue]);

  const handleStakeClick = (airdrop: any) => {
    setSelectedAirdrop(airdrop);
    setIsStakeModalOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
             <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            BASE<span className="text-blue-500 underline decoration-2 underline-offset-4">PORT</span>
          </span>
        </div>
        
        <div className="mt-4 flex-1">
          <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Main Menu</div>
          
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <NavItem icon={<Gift size={18} />} label="Active Claims" />
          <NavItem icon={<BarChart3 size={18} />} label="Analytics" />
          <NavItem icon={<Search size={18} />} label="Data Explorer" />
          <NavItem icon={<History size={18} />} label="History" />
        </div>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/20">
            <p className="text-xs text-blue-400 font-medium mb-1 flex items-center gap-2">
              <ShieldCheck size={14} /> Account Security
            </p>
            <p className="text-[10px] text-slate-400">Wallet verified via Base L2</p>
          </div>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              Dashboard / <span className="text-white font-medium">Wallet Analytics</span>
            </div>
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Base Mainnet</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleNotifications}
              className={cn(
                "p-2.5 rounded-xl border transition-all relative",
                isNotificationEnabled 
                  ? "bg-blue-600/10 border-blue-500/30 text-blue-400" 
                  : "bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300"
              )}
              title={isNotificationEnabled ? "Disable Notifications" : "Enable Notifications"}
            >
              {isNotificationEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              {isNotificationEnabled && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              )}
            </button>

            <Wallet>
              <ConnectWallet className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl h-10 px-4 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-2 min-w-[280px]">
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address className="text-slate-500" />
                  <EthBalance className="text-blue-400 font-bold" />
                </Identity>
                <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                  Go to Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect className="hover:bg-red-500/10 text-red-400 transition-colors" />
              </WalletDropdown>
            </Wallet>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Total Balance" 
              value={`${balance ? parseFloat(balance.formatted).toFixed(4) : "0.0000"} ${balance?.symbol || "ETH"}`} 
              subValue="+$12.4% vs last month"
              subColor="text-green-400"
            />
            <StatCard 
              label="Active Airdrops" 
              value={AIRDROPS_DATA.filter(a => a.status !== 'Ended').length.toString()} 
              subValue="3 ending this week"
              subColor="text-blue-400"
              suffix="Found"
            />
            <StatCard 
              label="Total Gas Used" 
              value="0.42 ETH" 
              subValue="Current Gas: 0.1 Gwei"
              subColor="text-slate-500"
            />
            <StatCard 
              label="Base Trust Score" 
              value="98 / 100" 
              subValue="High Eligibility Rank"
              subColor="text-purple-400"
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Analytics Chart */}
            <div className="col-span-12 lg:col-span-8 bg-[#0f172a] rounded-2xl border border-slate-800 flex flex-col p-6 min-h-[420px] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-500" />
                  Wallet Volume History (30D)
                </h4>
                <div className="flex space-x-2 bg-slate-900/50 p-1 rounded-lg">
                  {["7D", "30D", "ALL"].map((period) => (
                    <button 
                      key={period}
                      className={cn(
                        "px-4 py-1.5 text-[10px] rounded-md transition-all",
                        period === "30D" 
                          ? "bg-blue-600 text-white font-bold shadow-md" 
                          : "text-slate-500 hover:text-slate-200"
                      )}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", fontSize: "12px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between pt-6 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                <span>May 12</span>
                <span>May 22</span>
                <span>Jun 01</span>
                <span>Jun 11</span>
              </div>
            </div>

            {/* Active Airdrop Feed */}
            <div className="col-span-12 lg:col-span-4 bg-[#0f172a] rounded-2xl border border-slate-800 p-6 flex flex-col shadow-sm">
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    Eligible Airdrops
                    <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">New</span>
                  </h4>
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 group">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={12} />
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Claimable">Claimable</option>
                      <option value="Info">Info Only</option>
                      <option value="Ended">Ended</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setSortByValue(prev => prev === "desc" ? "asc" : "desc")}
                    className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] text-slate-300 hover:border-blue-500/50 transition-all"
                  >
                    <ArrowUpDown size={12} className={cn(sortByValue === "asc" ? "text-blue-400" : "text-slate-500")} />
                    Value {sortByValue === "desc" ? "(High)" : "(Low)"}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredAirdrops.length > 0 ? (
                    filteredAirdrops.map((airdrop) => (
                      <motion.div
                        key={airdrop.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AirdropItem 
                          airdrop={airdrop}
                          onStake={handleStakeClick}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-slate-500 text-xs italic">No airdrops found for this filter.</p>
                      <button 
                        onClick={() => { setStatusFilter("All"); setSortByValue("desc"); }}
                        className="mt-2 text-blue-400 text-[10px] font-bold uppercase underline underline-offset-4"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              
              <button className="mt-6 w-full py-3 text-xs text-blue-400 font-bold border border-blue-500/20 rounded-xl hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group">
                View All Rewards <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Actions / Ecosystem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
            <ActionCard 
              title="Bridge to Base" 
              description="Move assets from Mainnet or L2s smoothly."
              icon={<Zap className="text-yellow-500" />}
            />
            <ActionCard 
              title="Mint Basename" 
              description="Claim your identity on the Base ecosystem."
              icon={<CircleDot className="text-blue-500" />}
            />
            <ActionCard 
              title="Onchain Summer" 
              description="Discover the latest drops and events."
              icon={<ArrowUpRight className="text-green-500" />}
            />
          </div>
        </div>

        <StakeModal 
          isOpen={isStakeModalOpen} 
          onClose={() => setIsStakeModalOpen(false)} 
          airdrop={selectedAirdrop}
          balance={balance?.formatted}
          symbol={balance?.symbol}
        />

        <NotificationToast 
          notification={activeNotification} 
          onClose={() => setActiveNotification(null)} 
        />

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-800 bg-[#0f172a]/20 p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500">
            <div className="flex flex-wrap justify-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></span>
                <span className="text-slate-400 uppercase font-bold tracking-widest">Network TPS</span> 12.8
              </span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400 uppercase font-bold tracking-widest">Gas Price</span> 0.005 Gwei
              </span>
              <span className="flex items-center gap-2">
                <span className="text-slate-400 uppercase font-bold tracking-widest">Block</span> 14,028,391
              </span>
            </div>
            <div className="font-mono uppercase tracking-[0.2em]">
              © 2024 BASEPORT EXPLORER • Data Refreshed 2m ago
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={cn(
        "flex items-center space-x-3 px-6 py-3 transition-all relative group",
        active 
          ? "bg-slate-800/50 text-white" 
          : "text-slate-400 hover:bg-slate-800/20 hover:text-slate-200"
      )}
    >
      {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
      <span className={cn("transition-colors", active ? "text-blue-500" : "opacity-60 group-hover:opacity-100")}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

function StatCard({ label, value, subValue, subColor, suffix }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
        {value} {suffix && <span className="text-sm font-normal text-slate-500">{suffix}</span>}
      </h3>
      <p className={cn("text-[10px] mt-2 font-bold uppercase tracking-wide", subColor)}>{subValue}</p>
    </motion.div>
  );
}

function AirdropItem({ airdrop, onStake }: { airdrop: any, onStake?: (a: any) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const { name, description, status, highlight, href, estValue, criteria } = airdrop;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-4 z-[60] pointer-events-none"
          >
            <div className="bg-[#1e293b] border border-slate-700 p-4 rounded-xl shadow-2xl shadow-black/50">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reward Details</span>
                <div className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                  <ExternalLink size={10} /> Verified
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Estimated Value</p>
                  <p className="text-lg font-bold text-white text-blue-400">~${estValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Criteria</p>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &quot;{criteria}&quot;
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center gap-2 text-[10px] text-blue-400 font-bold">
                <Info size={12} /> Click to view source details
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-6 w-3 h-3 bg-[#1e293b] border-r border-b border-slate-700 rotate-45 transform -translate-y-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={cn(
          "p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex justify-between items-center transition-all group cursor-help",
          highlight ? "hover:border-white/50" : "hover:border-blue-500/30",
          isHovered && "bg-slate-800/80 shadow-inner",
          status === "Ended" && "opacity-50 grayscale"
        )}
      >
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5 truncate">
            {name}
          </p>
          <p className="text-[10px] text-slate-400 truncate">{description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {status === "Claimable" && (
            <button 
              onClick={() => onStake?.(airdrop)}
              className="px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold text-[10px] rounded-lg hover:bg-blue-600/40 transition-all flex items-center gap-1"
            >
              <Coins size={10} /> STAKE
            </button>
          )}

          {href && status !== "Ended" ? (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "px-3 py-1.5 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 whitespace-nowrap",
                highlight 
                  ? "bg-white text-black hover:bg-white/90 shadow-lg" 
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              )}
            >
              CLAIM
              <ExternalLink size={10} />
            </a>
          ) : (
            <div className={cn(
              "px-3 py-1.5 font-bold text-[10px] rounded-lg whitespace-nowrap",
              status === "Ended" ? "bg-red-500/10 text-red-400 text-center" : "bg-slate-700 text-slate-300"
            )}>
              {status.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StakeModal({ isOpen, onClose, airdrop, balance, symbol }: any) {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("30");
  const [isStaking, setIsStaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Re-initialize state when modal closes
      const reset = () => {
        setAmount("");
        setDuration("30");
        setIsStaking(false);
        setIsSuccess(false);
      };
      reset();
    }
  }, [isOpen]);

  const handleStake = () => {
    setIsStaking(true);
    // Simulate staking process
    setTimeout(() => {
      setIsStaking(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0f172a] w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative z-10"
      >
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Stake Successful!</h3>
            <p className="text-sm text-slate-400">Your assets are now secured in the Base vault.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins size={20} className="text-blue-500" />
                  Stake Airdrop Rewards
                </h3>
                <p className="text-xs text-slate-400 mt-1">Staking for {airdrop?.name}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Asset Box */}
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Asset to Stake</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase">Base Network</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">ETH</p>
                    <p className="text-xs text-slate-500">Available: {parseFloat(balance || "0").toFixed(4)} {symbol}</p>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2 tracking-widest">Amount to Stake</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#020617] border border-slate-800 rounded-xl px-4 py-3.5 text-white font-bold focus:outline-none focus:border-blue-600/50 text-xl"
                  />
                  <button 
                    onClick={() => setAmount(balance || "0")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-blue-600/10 text-blue-500 text-[10px] font-bold rounded uppercase hover:bg-blue-600/20 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Duration Select */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2 tracking-widest">Lock Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "30 Days", val: "30", yield: "4.2%" },
                    { label: "90 Days", val: "90", yield: "6.8%" },
                    { label: "1 Year", val: "365", yield: "12.5%" }
                  ].map((d) => (
                    <button
                      key={d.val}
                      onClick={() => setDuration(d.val)}
                      className={cn(
                        "p-3 rounded-xl border transition-all text-center group",
                        duration === d.val 
                          ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                          : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
                      )}
                    >
                      <p className="text-[10px] font-bold uppercase">{d.label}</p>
                      <p className={cn("text-[10px] mt-1", duration === d.val ? "text-blue-100" : "text-green-500 font-bold")}>{d.yield} APR</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Warning */}
              <div className="flex gap-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                <AlertCircle className="text-yellow-500 shrink-0" size={16} />
                <p className="text-[10px] text-yellow-500/80 leading-relaxed italic">
                  Assets will be locked for the selected duration. Early withdrawal results in a 15% penalty of earned rewards.
                </p>
              </div>

              {/* Action */}
              <button 
                onClick={handleStake}
                disabled={!amount || isStaking}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                {isStaking ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock size={18} className="group-hover:rotate-12 transition-transform" />
                    CONFIRM STAKING
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function ActionCard({ title, description, icon }: any) {
  return (
    <div className="p-6 bg-[#0f172a] rounded-2xl border border-slate-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group">
      <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 group-hover:border-blue-500/30 transition-all group-hover:bg-blue-500/5">
        {icon}
      </div>
      <h5 className="text-white font-bold text-base mb-2 group-hover:text-blue-400 transition-colors">{title}</h5>
      <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{description}</p>
    </div>
  );
}

function NotificationToast({ notification, onClose }: any) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          className="fixed bottom-8 right-8 z-[150] w-full max-w-sm"
        >
          <div className="bg-[#1e293b] border border-blue-500/30 rounded-2xl p-5 shadow-2xl shadow-blue-900/40 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                {notification.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm">{notification.title}</h4>
                  <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {notification.message}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button 
                    onClick={onClose}
                    className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    VIEW NOW
                  </button>
                  <button 
                    onClick={onClose}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-bold uppercase transition-colors"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
