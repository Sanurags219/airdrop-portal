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
  Info
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
import { useState, useEffect } from "react";
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

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
              value="8" 
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
              <h4 className="text-white font-bold mb-6 flex items-center justify-between">
                Eligible Airdrops
                <span className="text-[10px] bg-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-tight animate-pulse">New Rewards</span>
              </h4>
              <div className="space-y-4">
                <AirdropItem 
                  name="Aerodrome Finance" 
                  description="Incentive Program V2" 
                  status="CLAIM" 
                  highlight 
                  href="https://aerodrome.finance/airdrop"
                  estValue="~$180.00"
                  criteria="Liquidity provision min $500 or active voting in Epoch 32"
                />
                <AirdropItem 
                  name="Base Paint NFTs" 
                  description="Genesis Contributor" 
                  status="INFO" 
                  estValue="~$150.00"
                  criteria="Minted Genesis Day NFT and held for 30+ days"
                />
                <AirdropItem 
                  name="Debridge Finance" 
                  description="Cross-chain reward" 
                  status="CLAIM" 
                  highlight 
                  href="https://debridge.foundation/"
                  estValue="~$350.00"
                  criteria="Accumulated 1000+ points through cross-chain transfers to Base"
                />
                <AirdropItem 
                  name="Warpcast Nodes" 
                  description="Farcaster Ecosystem" 
                  status="INFO" 
                  estValue="~$100.00"
                  criteria="Active Warpcast channel owner or high engagement hub node host"
                />
              </div>
              <button className="mt-8 w-full py-3.5 text-xs text-blue-400 font-bold border border-blue-500/20 rounded-xl hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group">
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

function AirdropItem({ name, description, status, highlight = false, href, estValue, criteria }: any) {
  const [isHovered, setIsHovered] = useState(false);

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
                  <p className="text-lg font-bold text-white text-blue-400">{estValue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Criteria</p>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{criteria}"
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
          isHovered && "bg-slate-800/80 shadow-inner"
        )}
      >
        <div>
          <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
            {name}
          </p>
          <p className="text-[10px] text-slate-400">{description}</p>
        </div>
        
        {href ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "px-4 py-1.5 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1.5",
              highlight 
                ? "bg-white text-black hover:bg-white/90 shadow-lg" 
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            )}
          >
            CLAIM NOW
            <ExternalLink size={10} />
          </a>
        ) : (
          <div className="px-4 py-1.5 bg-slate-700 text-slate-300 font-bold text-[10px] rounded-lg">
            {status}
          </div>
        )}
      </div>
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
