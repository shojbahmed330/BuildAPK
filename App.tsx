
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Smartphone, Loader2, Zap, Cpu, LogOut, Check, Rocket, Settings,
  Download, Globe, Activity, Terminal, ShieldAlert, Package as PackageIcon, QrCode, 
  AlertCircle, Key, Mail, ArrowLeft, FileCode, ShoppingCart, User as UserIcon,
  ChevronRight, Github, Save, Trash2, Square, Circle, RefreshCw, Fingerprint,
  User, Lock, Eye, EyeOff, MessageSquare, Monitor, CreditCard, Upload, X, ShieldCheck,
  FileJson, Layout, Users, BarChart3, Clock, Wallet, CheckCircle2, XCircle, Search, TrendingUp,
  Plus, Edit2, Ban, ShieldX, LayoutDashboard, History, Gift, Filter, Bell, ListTodo,
  Trophy, Star, Award, Layers, Target, Code2, Sparkles, BrainCircuit, ShieldEllipsis, 
  Fingerprint as BioIcon, Camera, Laptop, Tablet, Menu, Smartphone as MobileIcon, Eye as ViewIcon, ExternalLink, Calendar, Coins, CheckCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AppMode, ChatMessage, User as UserType, GithubConfig, Package, Transaction, ActivityLog } from './types';
import { GeminiService } from './services/geminiService';
import { DatabaseService } from './services/dbService';
import { GithubService } from './services/githubService';

// --- BIOMETRIC SCAN PAGE ---
const ScanPage: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isScanning, setIsScanning] = useState(false);
  const handleStartAuth = () => {
    setIsScanning(true);
    setTimeout(() => onFinish(), 2000);
  };
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center bg-[#0a0110] text-white relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,45,117,0.15)_0%,_transparent_70%)] opacity-50"></div>
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-12 space-y-2">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-pink-400 to-pink-600 drop-shadow-[0_0_20px_rgba(255,45,117,0.4)]">
            OneClick Studio
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/60">
            Secure Uplink System • AI Core
          </p>
        </div>
        <div onClick={!isScanning ? handleStartAuth : undefined} className={`relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center cursor-pointer transition-transform active:scale-95 group mb-12`}>
          <div className={`absolute inset-0 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all ${!isScanning ? 'animate-pulse' : ''}`}></div>
          <Fingerprint size={isScanning ? 80 : 70} className={`${isScanning ? 'text-pink-400 scale-110' : 'text-pink-600'} transition-all duration-500 relative z-10 drop-shadow-[0_0_25px_rgba(255,45,117,0.6)] ${!isScanning ? 'animate-[float_3s_ease-in-out_infinite]' : 'animate-pulse'}`} />
          {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-pink-400 shadow-[0_0_25px_#ff2d75] rounded-full animate-[scanning_1.5s_infinite] z-20"></div>}
        </div>
        <h2 className={`text-sm md:text-xl font-bold tracking-widest uppercase transition-colors duration-500 ${isScanning ? 'text-pink-400' : 'text-slate-500'}`}>
          {isScanning ? 'Identity Scanning...' : 'Touch sensor to initiate login'}
        </h2>
      </div>
      <style>{`
        @keyframes scanning { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
};

// --- AUTH PAGE ---
const AuthPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isForgot) {
        const { error } = await db.resetPassword(formData.email);
        if (error) throw error;
        setResetSent(true);
      } else {
        const res = isRegister ? await db.signUp(formData.email, formData.password, formData.name) : await db.signIn(formData.email, formData.password);
        if (res.error) throw res.error;
        if (isRegister) {
          alert("Registration Successful! Please check your email.");
          setIsRegister(false);
          return;
        }
        const userData = await db.getUser(formData.email, res.data.user?.id);
        if (userData) {
          if (userData.is_banned) throw new Error("Account has been terminated by system.");
          onLoginSuccess(userData);
        }
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="relative w-full max-w-[420px] h-[550px] [perspective:1200px]">
        <div className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] ${isRegister ? '[transform:rotateY(-180deg)]' : ''}`}>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl">
            {isForgot ? (
              <div className="animate-in fade-in zoom-in duration-500">
                <h2 className="text-3xl font-black mb-4">Reset <span className="text-pink-500">Access</span></h2>
                {resetSent ? (
                  <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                      <Mail size={32} />
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      A <span className="text-pink-400 font-bold">password reset link</span> has been sent to your email address. Please check your inbox (or spam folder) and follow the instructions to reset your password.
                    </p>
                    <button onClick={() => {setIsForgot(false); setResetSent(false);}} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs hover:bg-white/10 transition-all">Back to Login</button>
                  </div>
                ) : (
                  <form onSubmit={handleAuth} className="space-y-6">
                    <p className="text-xs text-slate-400 leading-relaxed">Enter your registered email below, and we will send you a recovery link.</p>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="your-email@example.com" />
                    <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                      {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Send Recovery Link'}
                    </button>
                    <button type="button" onClick={() => setIsForgot(false)} className="w-full text-xs text-slate-500 hover:text-white font-bold transition-all flex items-center justify-center gap-2">
                      <ArrowLeft size={14} /> Back to Login
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-black mb-8">System <span className="text-pink-500">Login</span></h2>
                <form onSubmit={handleAuth} className="space-y-5">
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="developer@studio" />
                  <div className="space-y-2">
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
                    <button type="button" onClick={() => setIsForgot(true)} className="w-full text-right text-[10px] text-pink-500/60 font-black uppercase tracking-widest hover:text-pink-500 transition-all">Forgot Key?</button>
                  </div>
                  <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                    {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Execute Login'}
                  </button>
                </form>
                <button onClick={() => setIsRegister(true)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">New developer? Registry here</button>
              </>
            )}
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] glass-tech rounded-[3rem] p-10 flex flex-col justify-center border-pink-500/20 shadow-2xl [transform:rotateY(180deg)]">
            <h2 className="text-3xl font-black mb-8">New <span className="text-pink-500">Registry</span></h2>
            <form onSubmit={handleAuth} className="space-y-5">
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Full Name" />
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="Email" />
              <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white text-sm outline-none focus:border-pink-500/50" placeholder="••••••••" />
              <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all">
                {isLoading ? <Loader2 className="animate-spin mx-auto"/> : 'Join Studio'}
              </button>
            </form>
            <button onClick={() => setIsRegister(false)} className="mt-6 text-xs text-pink-400 font-bold hover:underline">Already registered? Access terminal</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN LOGIN PAGE ---
const AdminLoginPage: React.FC<{ onLoginSuccess: (user: UserType) => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const db = DatabaseService.getInstance();

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await db.signIn(formData.email, formData.password);
      if (res.error) throw res.error;
      const userData = await db.getUser(formData.email, res.data.user?.id);
      if (userData && userData.isAdmin) {
        onLoginSuccess(userData);
      } else {
        throw new Error("Access Denied: Non-admin terminal access attempt.");
      }
    } catch (error: any) { alert(error.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0110] text-white p-4">
      <div className="glass-tech p-10 rounded-[3rem] w-full max-w-md border-pink-500/20 shadow-2xl">
        <div className="text-center mb-10">
          <ShieldAlert size={48} className="mx-auto text-pink-500 mb-4" />
          <h2 className="text-3xl font-black tracking-tight">Admin <span className="text-pink-500">Terminal</span></h2>
        </div>
        <form onSubmit={handleAdminAuth} className="space-y-6">
          <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm" placeholder="Admin ID" />
          <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm" placeholder="Master Key" />
          <button disabled={isLoading} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95">
            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- ADMIN PANEL COMPONENT ---
const AdminPanel: React.FC<{ user: UserType }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'payments' | 'packages' | 'logs'>('stats');
  const [stats, setStats] = useState({ totalRevenue: 0, usersToday: 0, topPackage: 'N/A', salesCount: 0, chartData: [] });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserType[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Admin States
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [newTokenCount, setNewTokenCount] = useState<number>(0);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [newPackage, setNewPackage] = useState({ name: '', tokens: 0, price: 0 });
  
  // Package Edit States
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showEditPackageModal, setShowEditPackageModal] = useState(false);

  const db = DatabaseService.getInstance();

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') setStats(await db.getAdminStats() as any);
      if (activeTab === 'payments') setTransactions(await db.getAdminTransactions());
      if (activeTab === 'packages') setPackages(await db.getPackages());
      if (activeTab === 'logs') setActivityLogs(await db.getActivityLogs());
      if (activeTab === 'users') {
        const { data } = await db.supabase.from('users').select('*').order('created_at', { ascending: false });
        setAdminUsers(data || []);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [activeTab]);

  const handleApprove = async (txId: string) => {
    if (!confirm("Approve this payment? Tokens will be added instantly.")) return;
    try {
      const success = await db.approveTransaction(txId);
      if (success) {
        // Automatic logging is now handled by DB Triggers, but we keep this for extra context if needed
        await db.logActivity(user.email, 'PAYMENT_APPROVE', `Approved TX: ${txId}`);
        loadData();
      }
    } catch (e: any) { alert(e.message); }
  };

  const handleReject = async (txId: string) => {
    if (!confirm("Reject this payment?")) return;
    try {
      await db.rejectTransaction(txId);
      await db.logActivity(user.email, 'PAYMENT_REJECT', `Rejected TX: ${txId}`);
      loadData();
    } catch (e: any) { alert(e.message); }
  };

  const handleBanToggle = async (uid: string, email: string, currentStatus: boolean) => {
    if (!confirm(`${currentStatus ? 'Unsuspend' : 'Suspend'} user ${email}?`)) return;
    await db.supabase.from('users').update({ is_banned: !currentStatus }).eq('id', uid);
    // Logging is automatic via DB triggers
    loadData();
  };

  const handleUpdateTokens = async () => {
    if (!editingUser) return;
    try {
      await db.supabase.from('users').update({ tokens: newTokenCount }).eq('id', editingUser.id);
      // Logging is automatic via DB triggers
      setEditingUser(null);
      loadData();
    } catch (e: any) { alert(e.message); }
  };

  const handleCreatePackage = async () => {
    if (!newPackage.name || newPackage.price <= 0) return;
    try {
      await db.createPackage({
        name: newPackage.name,
        tokens: newPackage.tokens,
        price: newPackage.price,
        color: 'pink',
        icon: 'Package',
        is_popular: false
      });
      setShowPackageModal(false);
      loadData();
    } catch (e: any) { alert(e.message); }
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage) return;
    try {
      await db.updatePackage(editingPackage.id, {
        name: editingPackage.name,
        tokens: editingPackage.tokens,
        price: editingPackage.price
      });
      setShowEditPackageModal(false);
      loadData();
    } catch (e: any) { alert(e.message); }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      await db.deletePackage(id);
      loadData();
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#050108]">
      {/* --- Image Preview Modal --- */}
      {previewImage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in duration-300">
           <button onClick={() => setPreviewImage(null)} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-pink-600 rounded-full text-white transition-all z-[210]"><X size={24}/></button>
           <img src={previewImage} className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(255,45,117,0.4)]" />
        </div>
      )}

      {/* --- Token Edit Modal --- */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="glass-tech p-10 rounded-[2.5rem] w-full max-w-sm border-pink-500/20 shadow-2xl animate-in zoom-in">
              <h3 className="text-xl font-black mb-6 text-white uppercase tracking-tight">Edit <span className="text-pink-500">Credits</span></h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-4">{editingUser.email}</p>
              <div className="space-y-4">
                 <input type="number" value={newTokenCount} onChange={e => setNewTokenCount(parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xl font-black outline-none focus:border-pink-500/50" />
                 <div className="flex gap-2">
                    <button onClick={handleUpdateTokens} className="flex-1 py-3 bg-pink-600 rounded-xl font-black text-xs uppercase shadow-lg">Save Update</button>
                    <button onClick={() => setEditingUser(null)} className="px-6 py-3 bg-white/5 rounded-xl font-black text-xs uppercase">Cancel</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- Edit Package Modal --- */}
      {showEditPackageModal && editingPackage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="glass-tech p-10 rounded-[2.5rem] w-full max-w-md border-pink-500/20 animate-in zoom-in">
              <h3 className="text-xl font-black mb-6 text-white uppercase">Modify <span className="text-pink-500">Package</span></h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Package Name</label>
                    <input placeholder="Package Name" value={editingPackage.name} onChange={e => setEditingPackage({...editingPackage, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Tokens</label>
                    <input type="number" placeholder="Token Count" value={editingPackage.tokens} onChange={e => setEditingPackage({...editingPackage, tokens: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Price (BDT)</label>
                    <input type="number" placeholder="Price (BDT)" value={editingPackage.price} onChange={e => setEditingPackage({...editingPackage, price: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
                 </div>
                 <div className="flex gap-2 pt-4">
                    <button onClick={handleUpdatePackage} className="flex-1 py-4 bg-pink-600 rounded-xl font-black text-xs uppercase">Save Changes</button>
                    <button onClick={() => setShowEditPackageModal(false)} className="px-6 py-4 bg-white/5 rounded-xl font-black text-xs uppercase">Close</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- New Package Modal --- */}
      {showPackageModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="glass-tech p-10 rounded-[2.5rem] w-full max-w-md border-pink-500/20 animate-in zoom-in">
              <h3 className="text-xl font-black mb-6 text-white uppercase">New <span className="text-pink-500">Package</span></h3>
              <div className="space-y-4">
                 <input placeholder="Package Name" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
                 <input type="number" placeholder="Token Count" value={newPackage.tokens} onChange={e => setNewPackage({...newPackage, tokens: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
                 <input type="number" placeholder="Price (BDT)" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: parseInt(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
                 <div className="flex gap-2 pt-4">
                    <button onClick={handleCreatePackage} className="flex-1 py-4 bg-pink-600 rounded-xl font-black text-xs uppercase">Deploy Package</button>
                    <button onClick={() => setShowPackageModal(false)} className="px-6 py-4 bg-white/5 rounded-xl font-black text-xs uppercase">Close</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <aside className="w-full md:w-64 border-r border-pink-500/10 bg-black/40 p-6 flex flex-col gap-2">
        <div className="mb-8 px-2">
          <h2 className="text-xl font-black tracking-tighter text-pink-500">ADMIN <span className="text-white">HQ</span></h2>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em]">Neural Control Center</p>
        </div>
        {[
          { id: 'stats', icon: BarChart3, label: 'Dashboard' },
          { id: 'users', icon: Users, label: 'Members' },
          { id: 'payments', icon: CreditCard, label: 'Payments' },
          { id: 'packages', icon: PackageIcon, label: 'Packages' },
          { id: 'logs', icon: Terminal, label: 'System Logs' }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-xs font-black uppercase transition-all ${activeTab === tab.id ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto code-scroll relative">
        {loading ? <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" size={40}/></div> : (
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `৳${stats.totalRevenue}`, icon: Wallet, color: 'text-green-400' },
                    { label: 'New Users Today', value: stats.usersToday, icon: UserIcon, color: 'text-blue-400' },
                    { label: 'Top Package', value: stats.topPackage, icon: Trophy, color: 'text-yellow-400' },
                    { label: 'Total Sales', value: stats.salesCount, icon: ShoppingCart, color: 'text-pink-400' }
                  ].map((s, i) => (
                    <div key={i} className="glass-tech p-8 rounded-[2rem] border-white/5">
                      <s.icon className={`${s.color} mb-4`} size={24} />
                      <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{s.label}</div>
                      <div className="text-3xl font-black text-white mt-2 tracking-tighter">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Performance Chart */}
                <div className="glass-tech p-8 rounded-[3rem] border-white/5 relative overflow-hidden">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                         <h3 className="text-xl font-black text-white uppercase tracking-tight">Revenue <span className="text-pink-500">Performance</span></h3>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">System Cashflow (Last 7 Days)</p>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                         <TrendingUp size={14} className="text-green-400"/>
                         <span className="text-[10px] font-black text-green-400 uppercase">Live Stats</span>
                      </div>
                   </div>
                   <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={stats.chartData}>
                            <defs>
                               <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ff2d75" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#ff2d75" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                               dataKey="date" 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700}}
                               dy={10}
                            />
                            <YAxis 
                               axisLine={false} 
                               tickLine={false} 
                               tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700}}
                            />
                            <Tooltip 
                               contentStyle={{backgroundColor: '#1a1020', border: '1px solid rgba(255,45,117,0.2)', borderRadius: '12px'}}
                               itemStyle={{color: '#ff2d75', fontSize: '12px', fontWeight: 900}}
                               labelStyle={{color: '#fff', fontSize: '10px', marginBottom: '4px'}}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#ff2d75" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="glass-tech rounded-2xl p-4 border-white/5 flex items-center gap-4">
                  <Search className="text-slate-500" size={20}/>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter by TrxID or User Email..." className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="glass-tech rounded-[2.5rem] overflow-hidden border-white/5">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-pink-500 font-black uppercase tracking-widest">
                      <tr>
                        <th className="p-6">User/Email</th>
                        <th className="p-6">Amount</th>
                        <th className="p-6">Method/Trx</th>
                        <th className="p-6">Details</th>
                        <th className="p-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {transactions.filter(tx => 
                        tx.trx_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        tx.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map(tx => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-6 font-bold">{tx.user_email}</td>
                          <td className="p-6 font-black text-white">৳{tx.amount}</td>
                          <td className="p-6"><span className="text-pink-400 font-mono">{tx.payment_method}</span><br/><span className="opacity-50">{tx.trx_id}</span></td>
                          <td className="p-6">
                            <div className="flex flex-col gap-3">
                              {tx.message && (
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-slate-300 leading-relaxed italic">"{tx.message}"</div>
                              )}
                              {tx.screenshot_url ? (
                                <div onClick={() => setPreviewImage(tx.screenshot_url!)} className="relative group w-24 h-16 overflow-hidden rounded-xl cursor-pointer border border-white/10 hover:border-pink-500/50 transition-all shadow-xl">
                                   <img src={tx.screenshot_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                   <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                     <ViewIcon size={16} className="text-white drop-shadow-lg"/>
                                   </div>
                                </div>
                              ) : (
                                <div className="text-slate-600 text-[10px] font-black uppercase flex items-center gap-1"><XCircle size={12}/> No Proof</div>
                              )}
                            </div>
                          </td>
                          <td className="p-6">
                            {tx.status === 'pending' ? (
                              <div className="flex gap-2">
                                <button onClick={() => handleApprove(tx.id)} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all"><Check size={16}/></button>
                                <button onClick={() => handleReject(tx.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"><X size={16}/></button>
                              </div>
                            ) : <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{tx.status}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="glass-tech rounded-2xl p-4 border-white/5 flex items-center gap-4">
                  <Search className="text-slate-500" size={20}/>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search member by email or name..." className="flex-1 bg-transparent outline-none text-sm" />
                </div>
                <div className="glass-tech rounded-[2.5rem] overflow-hidden border-white/5">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-pink-500 font-black uppercase">
                      <tr><th className="p-6">Member</th><th className="p-6">Credits</th><th className="p-6">Status</th><th className="p-6">Control</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {adminUsers.filter(u => u.email.includes(searchQuery)).map(u => (
                        <tr key={u.id} className="hover:bg-white/5">
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar_url} className="w-10 h-10 rounded-xl" />
                              <div><div className="font-black text-white">{u.name}</div><div className="opacity-50 text-[10px]">{u.email}</div></div>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                               <span className="font-mono text-pink-400 font-black text-lg">{u.tokens}</span>
                               <button onClick={() => { setEditingUser(u); setNewTokenCount(u.tokens); }} className="p-2 bg-white/5 hover:bg-pink-600/20 rounded-lg text-pink-400 transition-all"><Coins size={14}/></button>
                            </div>
                          </td>
                          <td className="p-6">{u.is_banned ? <span className="text-red-500 font-bold uppercase tracking-widest text-[10px]">Suspended</span> : <span className="text-green-400 font-bold uppercase tracking-widest text-[10px]">Clear</span>}</td>
                          <td className="p-6">
                             <div className="flex gap-2">
                                <button onClick={() => handleBanToggle(u.id, u.email, u.is_banned || false)} className={`px-4 py-2 rounded-xl font-black uppercase text-[10px] transition-all ${u.is_banned ? 'bg-green-600' : 'bg-red-600/20 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white'}`}>
                                  {u.is_banned ? 'Unsuspend' : 'Terminate'}
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

            {activeTab === 'packages' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map(p => (
                  <div key={p.id} className="glass-tech p-10 rounded-[3rem] text-center relative border-white/5 group">
                    <PackageIcon size={48} className="mx-auto text-pink-500 mb-6 group-hover:scale-125 transition-transform"/>
                    <h3 className="text-2xl font-black text-white">{p.name}</h3>
                    <div className="text-5xl font-black text-white my-6 tracking-tighter">{p.tokens} <span className="text-[10px] opacity-30 tracking-[0.4em]">UNITS</span></div>
                    <div className="text-2xl font-black text-pink-500 mb-8">৳{p.price}</div>
                    <div className="flex gap-2">
                       <button onClick={() => { setEditingPackage(p); setShowEditPackageModal(true); }} className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-xs hover:bg-white/10">Modify</button>
                       <button onClick={() => handleDeletePackage(p.id)} className="p-4 bg-red-600/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowPackageModal(true)} className="glass-tech p-10 rounded-[3rem] border-dashed border-2 border-white/10 flex flex-col items-center justify-center gap-4 hover:border-pink-500/50 transition-all group min-h-[400px]">
                   <Plus size={48} className="text-slate-500 group-hover:text-pink-500 group-hover:scale-110 transition-all"/>
                   <span className="text-xs font-black uppercase tracking-widest text-slate-500">Create New Package</span>
                </button>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="glass-tech rounded-[2.5rem] border-white/5 p-8 space-y-4">
                 {activityLogs.map(log => (
                   <div key={log.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 font-mono text-[11px] items-start">
                      <span className="text-pink-500 font-black">[{new Date(log.created_at).toLocaleTimeString()}]</span>
                      <span className="text-blue-400 uppercase">{log.action}:</span>
                      <span className="text-slate-300">{log.details}</span>
                      <span className="ml-auto opacity-30">{log.admin_email}</span>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isScanned, setIsScanned] = useState(false);
  const [path, setPath] = useState(window.location.pathname);
  const [mode, setMode] = useState<AppMode>(AppMode.PREVIEW);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [projectFiles, setProjectFiles] = useState<Record<string, string>>({
    'index.html': '<div style="background:#0a0110; height:100vh; display:flex; align-items:center; justify-content:center; font-family:sans-serif; color:#ff2d75; text-align:center; padding: 20px;"><h1>OneClick Studio</h1></div>'
  });
  const [selectedFile, setSelectedFile] = useState('index.html');
  const [githubConfig, setGithubConfig] = useState<GithubConfig>({ token: '', repo: '', owner: '' });
  const [buildStatus, setBuildStatus] = useState<{ status: 'idle' | 'pushing' | 'building' | 'success' | 'error', message: string, apkUrl?: string, webUrl?: string }>({ status: 'idle', message: '' });
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview'>('preview');
  const [logoClicks, setLogoClicks] = useState(0);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Payment Flow States
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [paymentStep, setPaymentStep] = useState<'methods' | 'form' | 'success' | 'idle'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'Bkash' | 'Nagad' | 'Rocket' | null>(null);
  const [paymentForm, setPaymentForm] = useState({ trxId: '', screenshot: '', message: '' });
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [approvalNotify, setApprovalNotify] = useState<{show: boolean, amount: number} | null>(null);

  // Password Change States
  const [oldPassword, setOldPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passError, setPassError] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const gemini = useRef(new GeminiService());
  const db = DatabaseService.getInstance();
  const github = useRef(new GithubService());

  // Real-time Update Listener for Users and Transactions
  useEffect(() => {
    if (user?.id) {
      // User Update Listener (Tokens)
      const userChannel = db.supabase
        .channel(`user_updates_${user.id}`)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${user.id}` }, 
          (payload) => {
            if (payload.new && (payload.new as any).tokens !== undefined) {
              setUser(prev => prev ? { ...prev, tokens: (payload.new as any).tokens } : null);
            }
          }
        )
        .subscribe();

      // Transaction Status Change Listener for Notifications
      const txChannel = db.supabase
        .channel(`tx_updates_${user.id}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
          (payload) => {
            const newTx = payload.new as Transaction;
            
            // ইফ ইউজার প্রোফাইল পেজে থাকে, ট্রানজেকশন লিস্ট আপডেট করো
            if (mode === AppMode.PROFILE) {
              db.getUserTransactions(user.id).then(setUserTransactions);
            }

            // যদি স্ট্যাটাস পরিবর্তন হয়ে 'completed' হয়, তবে এলার্ট দেখাও
            if (newTx && newTx.status === 'completed') {
              setApprovalNotify({ show: true, amount: newTx.amount });
            }
          }
        )
        .subscribe();

      return () => { 
        db.supabase.removeChannel(userChannel); 
        db.supabase.removeChannel(txChannel);
      };
    }
  }, [user?.id, mode]);

  useEffect(() => {
    db.getCurrentSession().then(async session => {
      if (session?.user) {
        const userData = await db.getUser(session.user.email || '', session.user.id);
        if (userData) { setUser(userData); setIsScanned(true); }
      }
      setAuthLoading(false);
    });
    db.getPackages().then(pkgs => pkgs.length > 0 && setPackages(pkgs));
    const savedGit = localStorage.getItem('github_config');
    if (savedGit) setGithubConfig(JSON.parse(savedGit));
  }, []);

  useEffect(() => {
    if (mode === AppMode.PROFILE && user) {
      db.getUserTransactions(user.id).then(setUserTransactions);
    }
  }, [mode, user]);

  useEffect(() => { if (logoClicks >= 3) { setMode(AppMode.ADMIN); setLogoClicks(0); } }, [logoClicks]);

  const handleLogout = async () => { await db.signOut(); setUser(null); setIsScanned(false); };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPass) { setPassError('অনুগ্রহ করে সব ঘর পূরণ করুন'); return; }
    setIsUpdatingPass(true);
    setPassError('');
    try {
      const { error: verifyError } = await db.supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: oldPassword
      });

      if (verifyError) {
        setPassError('আপনার পুরাতন পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।');
        setIsUpdatingPass(false);
        return;
      }

      await db.updatePassword(newPass);
      alert("পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
      setOldPassword('');
      setNewPass('');
    } catch (e: any) {
      setPassError(e.message || "পাসওয়ার্ড পরিবর্তনে সমস্যা হয়েছে");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const text = input;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() }]);
    setInput('');
    setIsGenerating(true);
    if (window.innerWidth < 768) setMobileTab('preview');
    try {
      const res = await gemini.current.generateWebsite(text, projectFiles, messages);
      if (res.files) { setProjectFiles(prev => ({ ...prev, ...res.files })); setShowCompletion(true); setTimeout(() => setShowCompletion(false), 4000); }
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: res.answer, timestamp: Date.now(), ...res }]);
      if (user) { const updated = await db.useToken(user.id, user.email); if (updated) setUser(updated); }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  const handleBuildAPK = async () => {
    if (!githubConfig.token || !githubConfig.repo) { alert("GitHub কনফিগারেশন ইনভ্যালিড। লোগোতে ৩ বার ক্লিক করে সেটিংস চেক করুন।"); return; }
    setBuildStatus({ status: 'pushing', message: 'Uplinking code to GitHub...' });
    try {
      await github.current.pushToGithub(githubConfig, projectFiles);
      setBuildStatus({ status: 'building', message: 'Cloud Build sequence initiated. Please wait 3-5 mins...' });
      const checkInterval = setInterval(async () => {
        const details = await github.current.getLatestApk(githubConfig);
        if (details) {
          clearInterval(checkInterval);
          setBuildStatus({ status: 'success', message: 'APK Synthesized Successfully!', apkUrl: details.downloadUrl, webUrl: details.webUrl });
          setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) { qrContainer.innerHTML = ''; new (window as any).QRCode(qrContainer, { text: details.webUrl, width: 180, height: 180, colorDark: "#ff2d75", colorLight: "#ffffff" }); }
          }, 500);
        }
      }, 15000);
    } catch (e: any) { setBuildStatus({ status: 'error', message: e.message || 'Build system failure.' }); }
  };

  const handleSecureDownload = async () => {
    if (!buildStatus.apkUrl) return;
    setIsDownloading(true);
    try {
      const blob = await github.current.downloadArtifact(githubConfig, buildStatus.apkUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${githubConfig.repo}-build.zip`;
      document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url);
    } catch (e: any) { alert("Download failed: " + e.message); } finally { setIsDownloading(false); }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAvatarUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file && user) {
        const base64 = await fileToBase64(file);
        await db.updateUserAvatar(user.id, base64);
        setUser({ ...user, avatar_url: base64 });
        alert("প্রোফাইল ফটো আপডেট করা হয়েছে!");
      }
    };
    fileInput.click();
  };

  const handlePaymentScreenshotUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const base64 = await fileToBase64(file);
        setPaymentForm({ ...paymentForm, screenshot: base64 });
      }
    };
    fileInput.click();
  };

  const handlePaymentSubmit = async () => {
    if (!selectedPkg || !paymentMethod || !paymentForm.trxId) {
      alert("অনুগ্রহ করে সব ঘর পূরণ করুন এবং ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }
    setPaymentSubmitting(true);
    try {
      const success = await db.submitPaymentRequest(
        user!.id,
        selectedPkg.id,
        selectedPkg.price,
        paymentMethod,
        paymentForm.trxId,
        paymentForm.screenshot,
        paymentForm.message
      );
      if (success) {
        setPaymentStep('success');
        setPaymentForm({ trxId: '', screenshot: '', message: '' });
      }
    } catch (e: any) {
      alert(e.message || "পেমেন্ট রিকোয়েস্ট সাবমিট করতে সমস্যা হয়েছে।");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  if (authLoading) return <div className="h-screen w-full flex items-center justify-center bg-[#0a0110] text-[#ff2d75]"><Loader2 className="animate-spin" size={40}/></div>;
  if (!user) {
    if (path === '/admin') return <AdminLoginPage onLoginSuccess={setUser} />;
    if (!isScanned) return <ScanPage onFinish={() => setIsScanned(true)} />;
    return <AuthPage onLoginSuccess={setUser} />;
  }

  if (user.isAdmin && (path === '/admin' || mode === AppMode.ADMIN)) {
    return (
      <div className="h-screen flex flex-col text-slate-100 bg-[#0a0110]">
        <header className="h-20 border-b border-pink-500/10 glass-tech flex items-center justify-between px-8 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,117,0.5)]"><ShieldAlert size={20} className="text-white"/></div>
            <span className="font-black text-sm uppercase tracking-tighter">ADMIN <span className="text-pink-400">CONSOLE</span></span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setMode(AppMode.PREVIEW)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Exit Admin</button>
             <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><LogOut size={20}/></button>
          </div>
        </header>
        <AdminPanel user={user} />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col text-slate-100 bg-[#0a0110] overflow-hidden">
      {/* Verification Notice Banner */}
      {user && !user.is_verified && (
        <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border-b border-pink-500/20 p-3 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-500 z-[100]">
           <ShieldAlert size={16} className="text-pink-500 animate-pulse" />
           <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] text-pink-100">ইউজার ভেরিফিকেশন প্রয়োজন: আপনার অ্যাকাউন্টটি এখনো ভেরিফাইড নয়।</span>
           <button onClick={() => alert("Verification Email Sent! Please check your inbox.")} className="px-4 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-lg active:scale-95">ভেরিফাই করুন</button>
        </div>
      )}

      {/* Real-time Approval Notification */}
      {approvalNotify && approvalNotify.show && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className="glass-tech p-12 rounded-[3.5rem] text-center max-w-sm border-pink-500/40 shadow-[0_0_100px_rgba(255,45,117,0.4)] border-2 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-green-500/50 shadow-lg animate-bounce">
                <CheckCircle size={48}/>
              </div>
              <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">Payment Confirmed!</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-10">আপনার পেমেন্ট রিকোয়েস্টটি অ্যাপ্রুভ করা হয়েছে। সফলভাবে <span className="text-pink-400 font-bold">৳{approvalNotify.amount}</span> যোগ করা হয়েছে।</p>
              <button onClick={() => setApprovalNotify(null)} className="w-full py-5 bg-pink-600 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">Great!</button>
           </div>
        </div>
      )}

      {showCompletion && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
           <div className="bg-pink-600 text-white px-8 py-4 rounded-full shadow-[0_0_40px_rgba(255,45,117,0.6)] flex items-center gap-4 border border-white/20">
              <div className="bg-white/20 p-2 rounded-full"><Sparkles className="animate-pulse" size={20}/></div>
              <div className="text-sm font-black uppercase tracking-widest">Project Synced Successfully!</div>
           </div>
        </div>
      )}

      <header className="h-16 md:h-20 border-b border-pink-500/10 glass-tech flex items-center justify-between px-4 md:px-8 z-50 relative cyber-border-pink">
        <div onClick={() => setLogoClicks(c => c + 1)} className="flex items-center gap-3 cursor-pointer select-none group">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,117,0.5)] group-hover:scale-110 transition-transform"><Cpu size={20} className="text-white"/></div>
          <span className="font-black text-sm uppercase tracking-tighter">OneClick <span className="text-pink-400">Studio</span></span>
        </div>
        <nav className="hidden lg:flex bg-black/40 rounded-xl p-1 border border-white/5 shadow-2xl">
          {[AppMode.PREVIEW, AppMode.EDIT, AppMode.SHOP, AppMode.PROFILE].map(m => (
            <button key={m} onClick={() => setMode(m)} className={`px-6 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${mode === m ? 'active-nav-pink' : 'text-slate-400 hover:text-white'}`}>{m}</button>
          ))}
          {user.isAdmin && <button onClick={() => setMode(AppMode.ADMIN)} className="px-6 py-2.5 text-[10px] font-black uppercase text-purple-400 hover:text-purple-300">Admin</button>}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-xs font-bold text-pink-400">{user.tokens} Tokens</div>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg hidden sm:block"><LogOut size={20}/></button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative pb-20 md:pb-0">
        {mode === AppMode.PREVIEW ? (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
            <div className="flex-1 flex flex-col lg:flex-row h-full">
              <section className={`w-full lg:w-[450px] border-r border-pink-500/10 flex flex-col bg-[#01040f]/50 backdrop-blur-xl h-full ${mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
                <div className="flex-1 p-6 overflow-y-auto code-scroll space-y-6 pb-40">
                  {messages.length > 0 ? messages.map(m => (
                    <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                      {m.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2 ml-2">
                          <div className="w-5 h-5 bg-pink-600 rounded-lg flex items-center justify-center shadow-lg"><Sparkles size={10} className="text-white"/></div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Neural Assistant</span>
                        </div>
                      )}
                      <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,45,117,0.3)]' : 'bg-slate-900/90 border border-pink-500/20 text-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group'}`}>
                        {m.role === 'assistant' && <div className="absolute inset-0 shimmer-pink opacity-5 group-hover:opacity-10 pointer-events-none"></div>}
                        {m.content}
                      </div>
                    </div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                       <BrainCircuit size={64} className="mb-6 text-pink-400 animate-pulse"/>
                       <p className="text-xs font-black uppercase tracking-[0.4em]">Neural Core Online</p>
                    </div>
                  )}
                  {isGenerating && (
                    <div className="flex items-center gap-4 text-pink-400 p-4 animate-pulse">
                       <Loader2 className="animate-spin" size={16}/>
                       <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing Core Data...</span>
                    </div>
                  )}
                </div>
                <div className="p-6 absolute bottom-0 w-full lg:w-[450px] bg-gradient-to-t from-[#0a0110] via-[#0a0110]/95 to-transparent z-[80] md:z-10">
                  <div className="relative glass-tech rounded-[2rem] p-2 flex items-center gap-2 border-white/10 mb-20 md:mb-0">
                     <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Describe your dream app..." className="flex-1 bg-transparent p-4 text-xs h-16 outline-none text-white resize-none" />
                     <button onClick={handleSend} disabled={isGenerating} className="p-4 bg-pink-600 rounded-2xl text-white shadow-lg active:scale-90 transition-transform"><Send size={18}/></button>
                  </div>
                </div>
              </section>

              <section className={`flex-1 flex flex-col items-center justify-center p-4 md:p-4 relative h-full ${mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
                <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
                <div className="relative z-10 w-full max-w-[280px] md:max-w-[360px] max-h-[60vh] md:h-[720px] aspect-[9/18] bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-slate-800 shadow-[0_0_60px_-15px_rgba(255,45,117,0.3)] overflow-hidden flex flex-col transition-all duration-500">
                   <div className="h-6 md:h-8 w-full flex items-center justify-center"><div className="w-16 md:w-20 h-3 md:h-4 bg-slate-800 rounded-b-xl"></div></div>
                   <iframe srcDoc={projectFiles['index.html']} className="flex-1 w-full bg-white" title="preview" />
                   <div className="h-6 md:h-10 w-full flex items-center justify-center gap-6 md:gap-8 bg-slate-800/20 backdrop-blur-md">
                      <button className="text-slate-500"><Circle size={10}/></button>
                      <button className="text-slate-500"><Square size={10}/></button>
                   </div>
                </div>
                <button onClick={() => { setMode(AppMode.EDIT); handleBuildAPK(); }} className="absolute bottom-10 right-10 flex items-center gap-3 px-8 py-4 bg-pink-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(255,45,117,0.5)] active:scale-95 transition-all z-30 hidden lg:flex">
                  <Rocket size={18}/> Build Android APK
                </button>
              </section>
            </div>

            <div className="lg:hidden fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-2xl p-1.5 rounded-2xl border border-white/10 flex gap-1 z-[150] shadow-[0_0_40px_rgba(0,0,0,0.8)]">
               <button onClick={() => setMobileTab('chat')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mobileTab === 'chat' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,45,117,0.5)]' : 'text-slate-400'}`}>Chat</button>
               <button onClick={() => setMobileTab('preview')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mobileTab === 'preview' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(255,45,117,0.5)]' : 'text-slate-400'}`}>Visual</button>
            </div>
          </div>
        ) : mode === AppMode.SHOP ? (
          <div className="flex-1 p-6 md:p-20 overflow-y-auto">
             {paymentStep === 'idle' ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {packages.map((p, i) => (
                  <div key={i} className="glass-tech p-10 rounded-[3rem] text-center group hover:border-pink-500/50 transition-all border-white/5">
                     <PackageIcon size={48} className="mx-auto text-pink-500 mb-6 group-hover:scale-125 transition-transform"/>
                     <h3 className="text-2xl font-black mb-2">{p.name}</h3>
                     <div className="text-5xl font-black text-white my-6 tracking-tighter">{p.tokens} <span className="text-[10px] opacity-30 uppercase">Units</span></div>
                     <button onClick={() => { setSelectedPkg(p); setPaymentStep('methods'); }} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-pink-600 transition-all">৳ {p.price}</button>
                  </div>
                ))}
               </div>
             ) : paymentStep === 'methods' ? (
               <div className="max-w-md mx-auto glass-tech p-10 rounded-[3rem] animate-in zoom-in">
                  <h3 className="text-2xl font-black mb-8 text-center">Select <span className="text-pink-500">Method</span></h3>
                  <div className="space-y-4">
                     {[
                       { id: 'Bkash', color: 'bg-[#e2136e]' },
                       { id: 'Nagad', color: 'bg-[#f6921e]' },
                       { id: 'Rocket', color: 'bg-[#8c3494]' }
                     ].map(m => (
                       <button key={m.id} onClick={() => { setPaymentMethod(m.id as any); setPaymentStep('form'); }} className={`w-full p-6 ${m.color} rounded-2xl flex items-center justify-between shadow-xl active:scale-95 transition-transform`}>
                          <span className="font-black uppercase">{m.id}</span>
                          <span className="text-xs opacity-90 font-mono tracking-widest">01721013902</span>
                       </button>
                     ))}
                     <button onClick={() => setPaymentStep('idle')} className="w-full py-4 text-slate-500 text-xs font-black uppercase">Cancel</button>
                  </div>
               </div>
             ) : paymentStep === 'form' ? (
               <div className="max-w-md mx-auto glass-tech p-10 rounded-[3rem] animate-in zoom-in">
                  <h3 className="text-2xl font-black mb-2">{paymentMethod} <span className="text-pink-500">Gateway</span></h3>
                  <div className="bg-pink-500/10 p-4 rounded-2xl border border-pink-500/20 mb-6">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Send Money To (Personal):</p>
                    <p className="text-2xl font-black text-white tracking-widest">01721013902</p>
                    <p className="text-[10px] text-pink-400/80 mt-1">Payable: <span className="font-black">৳{selectedPkg?.price}</span></p>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Transaction ID (TrxID)</label>
                        <input required value={paymentForm.trxId} onChange={e => setPaymentForm({...paymentForm, trxId: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-pink-500/50 outline-none" placeholder="Enter TrxID here" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Upload Screenshot (Proof)</label>
                        <div onClick={handlePaymentScreenshotUpload} className="w-full h-32 bg-black/40 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-black/60 transition-all overflow-hidden relative">
                           {paymentForm.screenshot ? (
                             <>
                                <img src={paymentForm.screenshot} className="w-full h-full object-cover opacity-40" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                   <RefreshCw size={24} className="mb-2"/>
                                   <span className="text-[10px] font-black uppercase">Tap to Change</span>
                                </div>
                             </>
                           ) : (
                             <>
                                <Upload size={24} className="text-slate-500 mb-2" />
                                <span className="text-[10px] font-black uppercase text-slate-500">Select Image File</span>
                             </>
                           )}
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Message (Optional)</label>
                        <textarea value={paymentForm.message} onChange={e => setPaymentForm({...paymentForm, message: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm h-16 resize-none outline-none" placeholder="Notes for admin..." />
                     </div>
                     <button disabled={paymentSubmitting} onClick={handlePaymentSubmit} className="w-full py-5 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50">
                        {paymentSubmitting ? <Loader2 className="animate-spin mx-auto"/> : 'Securely Send Proof'}
                     </button>
                     <button onClick={() => setPaymentStep('methods')} className="w-full py-2 text-slate-500 text-xs font-black uppercase">Back to Methods</button>
                  </div>
               </div>
             ) : (
               <div className="max-w-md mx-auto glass-tech p-16 rounded-[3rem] text-center animate-in zoom-in">
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"><Check size={40}/></div>
                  <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-tighter">Request Sent</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-8">Admin will verify your TrxID. Once confirmed, <span className="text-pink-400 font-bold">{selectedPkg?.tokens} Units</span> will be added to your account instantly.</p>
                  <button onClick={() => setPaymentStep('idle')} className="px-10 py-4 bg-pink-600 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95">Complete Process</button>
               </div>
             )}
          </div>
        ) : mode === AppMode.PROFILE ? (
          <div className="flex-1 p-6 md:p-10 overflow-y-auto scroll-smooth">
             <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 pb-20">
                {/* Profile Header */}
                <div className="glass-tech p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-pink-500/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute inset-0 shimmer-pink opacity-5 pointer-events-none"></div>
                   <div className="relative group cursor-pointer" onClick={handleAvatarUpload}>
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-pink-500/20 p-1.5 shadow-2xl overflow-hidden bg-slate-800">
                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full object-cover rounded-[2rem]" alt="Profile"/>
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <div className="flex flex-col items-center gap-2">
                           <Upload size={24} className="text-white"/>
                           <span className="text-[10px] font-black uppercase text-white tracking-widest">Upload Photo</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-center md:text-left space-y-2 relative z-10">
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{user.name}</h2>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                         <span className="text-pink-400 font-bold text-xs bg-pink-500/5 px-3 py-1 rounded-lg border border-pink-500/10">{user.email}</span>
                         {user.is_verified && <div className="text-blue-400 bg-blue-500/10 p-1.5 rounded-full"><ShieldCheck size={14}/></div>}
                      </div>
                   </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="glass-tech p-6 rounded-3xl border-pink-500/5 flex items-center gap-4 hover:border-pink-500/20 transition-all">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Wallet size={24}/></div>
                      <div><div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Available Units</div><div className="text-2xl font-black text-white">{user.tokens}</div></div>
                   </div>
                   <div className="glass-tech p-6 rounded-3xl border-pink-500/5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Calendar size={24}/></div>
                      <div><div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Joined Terminal</div><div className="text-xl font-bold text-white">{new Date(user.joinedAt).toLocaleDateString()}</div></div>
                   </div>
                   <div className="glass-tech p-6 rounded-3xl border-pink-500/5 flex items-center gap-4">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><ShieldCheck size={24}/></div>
                      <div><div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Role</div><div className="text-xl font-bold text-white">{user.isAdmin ? 'Admin' : 'Developer'}</div></div>
                   </div>
                </div>

                {/* Recent Payments - Only show last 3 */}
                <div className="glass-tech p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-6 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10"><History size={80}/></div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3 relative z-10"><History className="text-pink-500"/> Recent <span className="text-pink-500">Payments</span></h3>
                   <div className="space-y-4 relative z-10">
                      {userTransactions.length > 0 ? (
                        userTransactions.slice(0, 3).map(tx => (
                          <div key={tx.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 gap-4 group hover:bg-white/[0.08] transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                   <CreditCard size={20} />
                                </div>
                                <div>
                                   <div className="font-black text-white text-sm uppercase">৳{tx.amount} • {tx.payment_method}</div>
                                   <div className="text-[10px] text-slate-500 font-mono mt-0.5 tracking-wider">TrxID: {tx.trx_id}</div>
                                </div>
                             </div>
                             <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${tx.status === 'completed' ? 'bg-green-600/20 text-green-400 border border-green-500/20' : tx.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/20' : 'bg-red-600/20 text-red-400 border border-red-500/20'}`}>
                                   {tx.status}
                                </span>
                                <span className="text-[10px] text-slate-600 font-bold">{new Date(tx.created_at).toLocaleDateString()}</span>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-slate-600">
                           <div className="mb-4 flex justify-center"><XCircle size={32} opacity={0.3}/></div>
                           <p className="text-xs font-black uppercase tracking-[0.3em]">No payment records found.</p>
                        </div>
                      )}
                      {userTransactions.length > 3 && (
                        <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-600">Only showing last 3 transactions</p>
                      )}
                   </div>
                </div>

                {/* Security Settings */}
                <div className="glass-tech p-8 md:p-10 rounded-[2.5rem] border-white/5 space-y-8 shadow-xl">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3"><Lock className="text-pink-500"/> Security <span className="text-pink-500">Settings</span></h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-1">পুরাতন পাসওয়ার্ড</label>
                         <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-500/50" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-500 ml-1">নতুন পাসওয়ার্ড</label>
                         <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-pink-500/50" placeholder="••••••••" />
                      </div>
                      {passError && <p className="text-xs text-red-500 font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{passError}</p>}
                      <button disabled={isUpdatingPass} onClick={handlePasswordChange} className="w-full py-4 bg-pink-600 rounded-2xl font-black uppercase text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                         {isUpdatingPass ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} আপডেট করুন
                      </button>
                   </div>
                </div>

                <button onClick={handleLogout} className="w-full py-6 bg-red-600/10 border border-red-600/20 text-red-500 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all">
                   <LogOut size={20}/> টার্মিনাল থেকে প্রস্থান করুন
                </button>
             </div>
          </div>
        ) : mode === AppMode.EDIT ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-500">
            {buildStatus.status === 'idle' ? (
              <>
                <aside className="w-full md:w-64 border-r border-pink-500/10 bg-black/20 p-4 space-y-2 overflow-y-auto">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-4 px-2">Project Files</h3>
                   {Object.keys(projectFiles).map(file => (
                     <button key={file} onClick={() => setSelectedFile(file)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedFile === file ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}>
                        <FileCode size={16} /> {file}
                     </button>
                   ))}
                </aside>
                <main className="flex-1 bg-[#050108] p-4 overflow-hidden flex flex-col">
                   <div className="flex items-center justify-between mb-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                        <span className="text-xs font-mono text-pink-400">{selectedFile}</span>
                      </div>
                      <button onClick={handleBuildAPK} className="px-6 py-2 bg-pink-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2">
                        <Rocket size={14}/> Run Build
                      </button>
                   </div>
                   <textarea value={projectFiles[selectedFile]} onChange={e => setProjectFiles(prev => ({...prev, [selectedFile]: e.target.value}))} className="flex-1 w-full bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-xs text-slate-300 outline-none focus:border-pink-500/20 resize-none code-scroll" />
                </main>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10">
                 <div className="glass-tech w-full max-w-2xl p-16 rounded-[3rem] text-center relative overflow-hidden">
                    {buildStatus.status === 'success' ? (
                      <div className="space-y-8 animate-in zoom-in">
                         <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50 shadow-lg animate-bounce"><CheckCircle2 size={48}/></div>
                         <h2 className="text-4xl font-black text-white">APK Ready</h2>
                         <div id="qrcode" className="p-4 bg-white rounded-3xl inline-block shadow-2xl"></div>
                         <div className="flex gap-4 justify-center">
                            <button onClick={handleSecureDownload} className="flex items-center gap-3 px-10 py-5 bg-pink-600 rounded-2xl font-black uppercase text-sm shadow-xl"><Download size={20}/> Secure Download</button>
                            <button onClick={() => setBuildStatus({status: 'idle', message: ''})} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-sm">Back</button>
                         </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <Terminal size={80} className="text-pink-500 animate-pulse mx-auto"/>
                        <h2 className="text-3xl font-black text-white uppercase">{buildStatus.status === 'pushing' ? 'Syncing...' : 'Compiling...'}</h2>
                        <p className="text-pink-400/70 font-mono text-sm">{buildStatus.message}</p>
                        <button onClick={() => setBuildStatus({status: 'idle', message: ''})} className="text-xs text-slate-500">Cancel</button>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0110]/95 backdrop-blur-3xl border-t border-pink-500/10 flex items-center justify-around p-2 pb-6 z-[100] animate-in slide-in-from-bottom">
          {[
            { id: AppMode.PREVIEW, icon: LayoutDashboard, label: 'Preview' },
            { id: AppMode.EDIT, icon: Code2, label: 'Edit' },
            { id: AppMode.SHOP, icon: ShoppingCart, label: 'Shop' },
            { id: AppMode.PROFILE, icon: UserIcon, label: 'Profile' }
          ].map((item) => (
            <button key={item.id} onClick={() => setMode(item.id)} className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${mode === item.id ? 'text-pink-500' : 'text-slate-500'}`}>
              <item.icon size={18} /><span className="text-[9px] font-black uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
