import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Users, CheckCircle, XCircle, Clock, 
  Search, Download, LogOut, ExternalLink, BarChart3, QrCode
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { cn } from '@/src/lib/utils';

const AdminDashboard = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [regsRes, statsRes] = await Promise.all([
        fetch('/api/admin/registrations', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (regsRes.ok && statsRes.ok) {
        setRegistrations(await regsRes.json());
        setStats(await statsRes.json());
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.fullName.toLowerCase().includes(search.toLowerCase()) ||
    reg.id.toLowerCase().includes(search.toLowerCase()) ||
    reg.collegeName.toLowerCase().includes(search.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-3xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-display">Admin <span className="text-cyber-purple">Portal</span></h2>
            <p className="text-white/40 mt-2">Secure access for coordinators</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none"
                placeholder="admin"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-cyber-purple outline-none"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full py-4 bg-cyber-purple rounded-xl font-bold">Login to Dashboard</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const chartData = stats ? Object.entries(stats.eventCounts).map(([name, value]) => ({ name, value })) : [];
  const COLORS = ['#a855f7', '#3b82f6', '#f97316', '#10b981', '#ef4444', '#f59e0b'];

  return (
    <div className="min-h-screen bg-cyber-bg flex">
      {/* Sidebar */}
      <div className="w-64 glass border-r border-white/10 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-12">
          <LayoutDashboard className="text-cyber-purple" />
          <span className="font-bold font-display text-xl">Admin Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              activeTab === 'overview' ? "bg-cyber-purple text-white" : "text-white/60 hover:bg-white/5"
            )}
          >
            <BarChart3 className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('registrations')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              activeTab === 'registrations' ? "bg-cyber-purple text-white" : "text-white/60 hover:bg-white/5"
            )}
          >
            <Users className="w-5 h-5" /> Registrations
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold font-display">Welcome back, Coordinator</h1>
            <p className="text-white/40">Symposium status and analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:border-cyber-purple outline-none w-64"
              />
            </div>
            <button className="p-2 glass rounded-xl text-white/60 hover:text-white">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </header>

        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyber-purple/10 rounded-xl text-cyber-purple"><Users /></div>
                  <span className="text-xs font-bold text-green-400">+12%</span>
                </div>
                <p className="text-4xl font-bold font-display">{stats.total}</p>
                <p className="text-sm text-white/40 uppercase tracking-widest mt-1">Total Registrations</p>
              </div>
              <div className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyber-blue/10 rounded-xl text-cyber-blue"><Clock /></div>
                </div>
                <p className="text-4xl font-bold font-display">{stats.pending}</p>
                <p className="text-sm text-white/40 uppercase tracking-widest mt-1">Pending Approval</p>
              </div>
              <div className="glass p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle /></div>
                </div>
                <p className="text-4xl font-bold font-display">{stats.approved}</p>
                <p className="text-sm text-white/40 uppercase tracking-widest mt-1">Approved Payments</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-8">Event Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#030712', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        itemStyle={{ color: '#a855f7' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-bold mb-8">Approval Status</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Approved', value: stats.approved },
                          { name: 'Pending', value: stats.pending }
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#3b82f6" />
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#030712', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Events</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Payment</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-white/40 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold">{reg.fullName}</p>
                        <p className="text-xs text-white/40">{reg.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">{reg.collegeName}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {reg.selectedEvents.split(',').map((e: string) => (
                            <span key={e} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10">{e.trim()}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-mono text-cyber-purple">{reg.transactionId}</p>
                        <a 
                          href={reg.screenshotPath} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] text-white/40 hover:text-white flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Proof
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                          reg.status === 'approved' ? "bg-green-500/20 text-green-500" : 
                          reg.status === 'rejected' ? "bg-red-500/20 text-red-500" : 
                          "bg-blue-500/20 text-blue-500"
                        )}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateStatus(reg.id, 'approved')}
                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateStatus(reg.id, 'rejected')}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
