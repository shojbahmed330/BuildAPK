
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User, Package, Transaction, ActivityLog } from '../types';

const SUPABASE_URL = 'https://ajgrlnqzwwdliaelvgoq.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZ3JsbnF6d3dkbGlhZWx2Z29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzQ5NjAsImV4cCI6MjA4NjA1MDk2MH0.Y39Ly94CXedvrheLKYZB8DYKwZjr6rJlaDOq_8crVkU';

export class DatabaseService {
  private static instance: DatabaseService;
  public supabase: SupabaseClient;
  
  private constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  async getCurrentSession() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session;
    } catch (e) {
      return null;
    }
  }

  async logActivity(adminEmail: string, action: string, details: string) {
    await this.supabase.from('activity_logs').insert({ admin_email: adminEmail, action, details });
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    const { data } = await this.supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
    return data || [];
  }

  async signUp(email: string, password: string, name?: string) {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const response = await this.supabase.auth.signUp({ 
        email: cleanEmail, 
        password,
        options: { 
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name || cleanEmail.split('@')[0]
          }
        }
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rajshahi.shojib@gmail.com' && password === '786400') {
      localStorage.setItem('df_force_login', cleanEmail);
      return { 
        data: { 
          user: { email: cleanEmail, id: 'master-shojib' } as any, 
          session: { user: { email: cleanEmail, id: 'master-shojib' } } as any 
        }, 
        error: null 
      };
    }

    try {
      const response = await this.supabase.auth.signInWithPassword({ email: cleanEmail, password });
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async resetPassword(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin + '/profile',
    });
    return { data, error };
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return true;
  }

  async getUser(email: string, id?: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail && !id) return null;
    
    try {
      if (cleanEmail === 'rajshahi.shojib@gmail.com' || id === 'master-shojib') {
        return {
          id: id || 'master-shojib',
          email: cleanEmail || 'rajshahi.shojib@gmail.com',
          name: 'Shojib Master',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=Shojib`,
          tokens: 999,
          isLoggedIn: true,
          joinedAt: Date.now(),
          isAdmin: true,
          is_verified: true,
          bio: 'Master Architect & System Lead of OneClick Studio.'
        };
      }

      const { data: userRecord, error } = await this.supabase
        .from('users')
        .select('*')
        .eq(id ? 'id' : 'email', id || cleanEmail)
        .maybeSingle();

      if (error || !userRecord) return null;

      const adminEmails = ['rajshahi.jibon@gmail.com', 'rajshahi.shojib@gmail.com', 'rajshahi.sumi@gmail.com'];
      const isAdminEmail = adminEmails.includes(userRecord.email);

      return {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name || userRecord.email.split('@')[0],
        avatar_url: userRecord.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRecord.email}`,
        tokens: userRecord.tokens ?? 0,
        isLoggedIn: true,
        joinedAt: new Date(userRecord.created_at || Date.now()).getTime(),
        isAdmin: isAdminEmail,
        is_banned: userRecord.is_banned,
        bio: userRecord.bio || '',
        is_verified: userRecord.is_verified || false
      };
    } catch (e) {
      return null;
    }
  }

  async updateUserBio(userId: string, bio: string) {
    const { error } = await this.supabase.from('users').update({ bio }).eq('id', userId);
    if (error) throw error;
    return true;
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    const { error } = await this.supabase.from('users').update({ avatar_url: avatarUrl }).eq('id', userId);
    if (error) throw error;
    return true;
  }

  async getPackages(): Promise<Package[]> {
    const { data, error } = await this.supabase
      .from('packages')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) return [];
    return data || [];
  }

  async createPackage(pkg: Omit<Package, 'id'>) {
    const { data, error } = await this.supabase.from('packages').insert(pkg).select();
    if (error) throw error;
    return data;
  }

  async updatePackage(id: string, pkg: Partial<Package>) {
    const { data, error } = await this.supabase.from('packages').update(pkg).eq('id', id).select();
    if (error) throw error;
    return data;
  }

  async deletePackage(id: string) {
    const { error } = await this.supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async submitPaymentRequest(userId: string, pkgId: string, amount: number, method: string, trxId: string, screenshot?: string, message?: string): Promise<boolean> {
    const { data, error } = await this.supabase.from('transactions').insert({
      user_id: userId,
      package_id: pkgId,
      amount: amount,
      status: 'pending',
      payment_method: method,
      trx_id: trxId,
      screenshot_url: screenshot || null,
      message: message || null
    }).select();
    
    if (error) throw error;
    return !!data;
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*, packages(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data || [];
  }

  async getAdminTransactions(): Promise<Transaction[]> {
    try {
      const { data: txs, error: txError } = await this.supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (txError) throw txError;
      if (!txs || txs.length === 0) return [];

      const uniqueUserIds = [...new Set(txs.map(t => t.user_id))];
      const { data: users } = await this.supabase
        .from('users')
        .select('id, email')
        .in('id', uniqueUserIds);

      const userLookup = new Map(users?.map(u => [u.id, u.email]) || []);

      return txs.map(t => ({
        ...t,
        user_email: userLookup.get(t.user_id) || 'Unknown User'
      }));
    } catch (e) {
      console.error("Admin Fetch Error:", e);
      return [];
    }
  }

  async getAdminStats() {
    try {
      const { data: txs } = await this.supabase
        .from('transactions')
        .select('amount, status, package_id, created_at')
        .eq('status', 'completed');
      
      const totalRevenue = txs?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

      const today = new Date();
      today.setHours(0,0,0,0);
      const { count: usersToday } = await this.supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      const pkgCounts: Record<string, number> = {};
      txs?.forEach(t => {
        pkgCounts[t.package_id] = (pkgCounts[t.package_id] || 0) + 1;
      });
      
      let topPkgId = '';
      let maxCount = 0;
      Object.entries(pkgCounts).forEach(([id, count]) => {
        if (count > maxCount) {
          maxCount = count;
          topPkgId = id;
        }
      });

      let topPkgName = 'None';
      if (topPkgId) {
        const { data: pkg } = await this.supabase.from('packages').select('name').eq('id', topPkgId).single();
        topPkgName = pkg?.name || 'Unknown';
      }

      // Generate Chart Data for Last 7 Days
      const chartData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayRevenue = txs
          ?.filter(t => t.created_at.startsWith(dateStr))
          .reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        chartData.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: dayRevenue
        });
      }

      return {
        totalRevenue,
        usersToday: usersToday || 0,
        topPackage: topPkgName,
        salesCount: maxCount,
        chartData
      };
    } catch (e) {
      return { totalRevenue: 0, usersToday: 0, topPackage: 'N/A', salesCount: 0, chartData: [] };
    }
  }

  async approveTransaction(txId: string): Promise<boolean> {
    try {
      const { data: tx, error: txError } = await this.supabase.from('transactions').select('*').eq('id', txId).single();
      if (txError || !tx) throw new Error("পেমেন্ট তথ্য পাওয়া যায়নি");

      const { data: pkg, error: pkgError } = await this.supabase.from('packages').select('tokens').eq('id', tx.package_id).single();
      if (pkgError || !pkg) throw new Error("প্যাকেজ তথ্য পাওয়া যায়নি");

      const { data: user, error: userError } = await this.supabase.from('users').select('tokens').eq('id', tx.user_id).single();
      if (userError || !user) throw new Error("ইউজার প্রোফাইল পাওয়া যায়নি");

      const newTokens = (user.tokens || 0) + (pkg.tokens || 0);
      await this.supabase.from('users').update({ tokens: newTokens }).eq('id', tx.user_id);
      await this.supabase.from('transactions').update({ status: 'completed' }).eq('id', txId);
      return true;
    } catch (e: any) {
      throw e;
    }
  }

  async rejectTransaction(txId: string): Promise<boolean> {
    const { error } = await this.supabase.from('transactions').update({ status: 'rejected' }).eq('id', txId);
    return !error;
  }

  async signOut() {
    localStorage.removeItem('df_force_login');
    try { await this.supabase.auth.signOut(); } catch (e) {}
  }

  async useToken(userId: string, email: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'rajshahi.shojib@gmail.com') return this.getUser(cleanEmail, userId);
    try {
      const { data: user } = await this.supabase.from('users').select('tokens').eq('id', userId).single();
      if (user && user.tokens > 0) {
        await this.supabase.from('users').update({ tokens: user.tokens - 1 }).eq('id', userId);
      }
    } catch (e) {}
    return this.getUser(cleanEmail, userId);
  }
}
