"use client";

import { useAccount, useBalance } from "wagmi";
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect, WalletDropdownLink } from "@coinbase/onchainkit/wallet";
import { Avatar, Name, Identity, Address, EthBalance } from "@coinbase/onchainkit/identity";
import { motion } from "motion/react";
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
  Zap
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useState, useEffect } from "react";

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
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            BASE<span className="text-blue-500 underline decoration-2 underline-offset-4">PORT</span>
          </span>
        </div>
        
        <div className="mt-4 flex-1">
          <div className="px-6 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Main Menu</div>
          
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<Gift size={20} />} label="Active Claims" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<Search size={20} />} label="Data Explorer" />
          <NavItem icon={<History size={20} />} label="History" />
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
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              Dashboard / <span className="text-white font-medium">Wallet Analytics</span>
            </div>
            <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-green-500 font-bold uppercase">Base Mainnet</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Wallet>
              <ConnectWallet className="bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl h-10 px-4">
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl">
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address className="text-slate-500" />
                  <EthBalance className="text-blue-400 font-bold" />
                </Identity>
                <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                  Go to Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect className="hover:bg-red-500/10 text-red-400" />
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
            <div className="col-span-12 lg:col-span-8 bg-[#0f172a] rounded-2xl border border-slate-800 flex flex-col p-6 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-white font-bold flex items-center gap-2">
                  <BarChart3 size={18} className="text-blue-500" />
                  Wallet Volume History (30D)
                </h4>
                <div className="flex space-x-2">
                  {["7D", "30D", "ALL"].map((period) => (
                    <button 
                      key={period}
                      className={cn(
                        "px-3 py-1 text-[10px] rounded border transition-all",
                        period === "30D" 
                          ? "bg-blue-600 border-blue-500 text-white font-bold" 
                          : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
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
                    <XAxis 
                      dataKey="name" 
                      stroke="#475569" 
                      fontSize={10} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", fontSize: "12px" }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVolume)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between pt-4 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                <span>May 12</span>
                <span>May 22</span>
                <span>Jun 01</span>
                <span>Jun 11</span>
              </div>
            </div>

            {/* Active Airdrop Feed */}
            <div className="col-span-12 lg:col-span-4 bg-[#0f172a] rounded-2xl border border-slate-800 p-6 flex flex-col">
              <h4 className="text-white font-bold mb-4 flex items-center justify-between">
                Eligible Airdrops
                <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded animate-pulse">NEW</span>
              </h4>
              <div className="space-y-4">
                <AirdropItem name="Aerodrome Finance" description="Incentive Program V2" status="CLAIM" highlight />
                <AirdropItem name="Base Paint NFTs" description="Genesis Contributor" status="INFO" />
                <AirdropItem name="Debridge Finance" description="Cross-chain reward" status="CLAIM" highlight />
                <AirdropItem name="Warpcast Nodes" description="Farcaster Ecosystem" status="INFO" />
              </div>
              <button className="mt-8 w-full py-3 text-xs text-blue-400 font-bold border border-blue-500/20 rounded-xl hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 group">
                View All Rewards <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Quick Actions / Ecosystem */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <footer className="mt-auto border-t border-slate-800 p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
            <div className="flex space-x-6">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-slate-400 uppercase font-bold">Network TPS:</span> 12.8
              </span>
              <span><span className="text-slate-400 uppercase font-bold">Gas Price:</span> 0.005 Gwei</span>
              <span><span className="text-slate-400 uppercase font-bold">Block:</span> 14,028,391</span>
            </div>
            <div className="font-mono uppercase tracking-widest">
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
        "flex items-center space-x-3 px-6 py-3 transition-all",
        active 
          ? "bg-slate-800/50 text-white border-r-4 border-blue-500" 
          : "text-slate-400 hover:bg-slate-800/30 hover:text-slate-200"
      )}
    >
      <span className={cn(active ? "text-blue-500" : "opacity-60")}>{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}

function StatCard({ label, value, subValue, subColor, suffix }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors group"
    >
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
        {value} {suffix && <span className="text-sm font-normal text-slate-500">{suffix}</span>}
      </h3>
      <p className={cn("text-xs mt-2 font-medium", subColor)}>{subValue}</p>
    </motion.div>
  );
}

function AirdropItem({ name, description, status, highlight = false }: any) {
  return (
    <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 flex justify-between items-center hover:bg-slate-800/60 transition-colors">
      <div>
        <p className="text-xs font-bold text-white">{name}</p>
        <p className="text-[10px] text-slate-400">{description}</p>
      </div>
      <button className={cn(
        "px-4 py-1.5 font-bold text-[10px] rounded-lg transition-all",
        highlight 
          ? "bg-white text-black hover:bg-slate-200" 
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      )}>
        {status}
      </button>
    </div>
  );
}

function ActionCard({ title, description, icon }: any) {
  return (
    <div className="p-5 bg-[#0f172a] rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer group">
      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h5 className="text-white font-bold text-sm mb-1">{title}</h5>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
