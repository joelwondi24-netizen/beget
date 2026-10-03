import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Globe,
  ArrowRight,
  Zap,
  Headphones,
  SlidersHorizontal,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    loginAdmin,
    setActiveTab,
    userProfile,
    adminSession,
  } = useCrypto();

  // User Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('United States');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Admin / Support Staff State
  const [staffRoleType, setStaffRoleType] = useState<'super_admin' | 'support'>('super_admin');
  const [staffEmail, setStaffEmail] = useState('admin@beget.com');
  const [staffKey, setStaffKey] = useState('');
  const [staff2Fa, setStaff2Fa] = useState('');

  if (!isAuthModalOpen) return null;

  const handleQuickDemoTrader = () => {
    setEmail('trader@beget.com');
    setPassword('DemoTrader2026!');
    setName('Alex Vance');
  };

  const handleQuickDemoAdmin = () => {
    setStaffRoleType('super_admin');
    setStaffEmail('admin@beget.com');
    setStaffKey('MasterAdminKey2026!');
    setStaff2Fa('842910');
  };

  const handleQuickDemoSupport = () => {
    setStaffRoleType('support');
    setStaffEmail('support@beget.com');
    setStaffKey('SupportDesk2026!');
    setStaff2Fa('519302');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authModalMode === 'admin') {
      if (!staffEmail.trim() || !staffKey.trim()) {
        setErrorMsg('Please enter both staff email and master security passkey.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        const result = loginAdmin(staffEmail, staffKey, staff2Fa);
        setIsSubmitting(false);
        if (result.success) {
          setIsAuthModalOpen(false);
          setActiveTab('admin');
        } else {
          setErrorMsg(result.message);
        }
      }, 500);
      return;
    }

    if (authModalMode === 'login') {
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please enter both email and password.');
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        loginUser(email, name || undefined);
        setIsSubmitting(false);
        setIsAuthModalOpen(false);
      }, 500);
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Please fill in all required credentials.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please agree to the Terms of Service.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        registerUser(name, email, country);
        setIsSubmitting(false);
        setIsAuthModalOpen(false);
      }, 500);
    }
  };

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setErrorMsg('Please enter your email above to receive a reset link.');
      return;
    }
    setForgotPasswordSent(true);
    setTimeout(() => setForgotPasswordSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-[#0e1420] border rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative transition-all ${
        authModalMode === 'admin' ? 'border-amber-500/50' : 'border-slate-800'
      }`}>
        
        {/* Glow backdrop */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          authModalMode === 'admin' ? 'bg-amber-500/15' : 'bg-emerald-500/10'
        }`} />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-slate-950 text-sm shadow-md ${
              authModalMode === 'admin'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-400'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400'
            }`}>
              {authModalMode === 'admin' ? <Lock className="w-4 h-4 text-slate-950" /> : 'B'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-white text-base">
                  {authModalMode === 'login'
                    ? 'Trader Sign In'
                    : authModalMode === 'register'
                    ? 'Create Free Trading Account'
                    : 'Admin & Support Staff Clearance'}
                </h3>
                {authModalMode === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Restricted
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {authModalMode === 'login'
                  ? 'Access live terminal, AI insights & your demo wallet'
                  : authModalMode === 'register'
                  ? 'Get started with $100,000 USD virtual paper trading margin'
                  : 'Authorized personnel only: Super Administrator & Support Desk'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Sign In vs Register vs Staff/Admin) */}
        <div className="p-2 bg-slate-900/80 border-b border-slate-800 grid grid-cols-3 gap-1 relative z-10">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In / Login
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register / Signup
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalMode('admin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1 ${
              authModalMode === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Staff / Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 relative z-10 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* Quick Demo Credentials Banner */}
          {authModalMode !== 'admin' ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
              <span className="text-slate-400">Quick Test Credentials:</span>
              <button
                type="button"
                onClick={handleQuickDemoTrader}
                className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
              >
                Auto-fill Demo Trader
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px]">
              <span className="text-amber-300 font-medium">Quick Staff Credentials:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleQuickDemoAdmin}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  Super Admin
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={handleQuickDemoSupport}
                  className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                >
                  Support Man
                </button>
              </div>
            </div>
          )}

          {/* ADMIN & SUPPORT STAFF FORM */}
          {authModalMode === 'admin' ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Role Toggle: Super Admin vs Support Representative */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Staff Clearance Level:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStaffRoleType('super_admin');
                      setStaffEmail('admin@beget.com');
                      setStaffKey('MasterAdminKey2026!');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition cursor-pointer ${
                      staffRoleType === 'super_admin'
                        ? 'bg-amber-500/15 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <SlidersHorizontal className={`w-4 h-4 ${staffRoleType === 'super_admin' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold leading-none">Super Administrator</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Vault & Minting, Config, All Broadcasts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStaffRoleType('support');
                      setStaffEmail('support@beget.com');
                      setStaffKey('SupportDesk2026!');
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2.5 transition cursor-pointer ${
                      staffRoleType === 'support'
                        ? 'bg-cyan-500/15 border-cyan-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Headphones className={`w-4 h-4 ${staffRoleType === 'support' ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold leading-none">Support Specialist</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">User Support, KYC & Alert Broadcast</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Staff Email / ID */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Staff Email / Identifier
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="staff@beget.com"
                    value={staffEmail}
                    onChange={e => setStaffEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    required
                  />
                </div>
              </div>

              {/* Master Passkey */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Staff Master Passkey</label>
                  <span className="text-[10px] text-slate-500 font-mono">256-bit encrypted</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter staff security key..."
                    value={staffKey}
                    onChange={e => setStaffKey(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2FA Authenticator Token */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  2FA TOTP Code (Optional Demo)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 842910"
                    value={staff2Fa}
                    onChange={e => setStaff2Fa(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Admin Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 transition cursor-pointer flex items-center justify-center space-x-1.5 mt-2"
              >
                <Zap className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>
                  {isSubmitting
                    ? 'Verifying Staff Credentials...'
                    : `Authenticate as ${staffRoleType === 'support' ? 'Support Specialist' : 'Super Administrator'}`}
                </span>
              </button>
            </form>
          ) : (
            /* REGULAR USER LOGIN & REGISTER FORM */
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Full Name for Registration */}
              {authModalMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Satoshi Nakamoto"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="trader@beget.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    required
                  />
                </div>
              </div>

              {/* Country Selector for Registration */}
              {authModalMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Country / Region
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none transition"
                    >
                      <option value="United States">United States</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Canada">Canada</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Kenya">Kenya</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for Register */}
              {authModalMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition font-mono"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Experience Level for Registration */}
              {authModalMode === 'register' && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Trading Experience
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['beginner', 'intermediate', 'advanced'] as const).map(lvl => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setExperienceLevel(lvl)}
                        className={`p-1.5 rounded-lg border text-[11px] font-semibold capitalize text-center transition cursor-pointer ${
                          experienceLevel === lvl
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms checkbox */}
              {authModalMode === 'register' && (
                <div className="flex items-center space-x-2 pt-1 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer"
                  />
                  <span>I agree to Beget Trading Terms & Risk Disclaimers</span>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Forgot password confirmation message */}
              {forgotPasswordSent && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Password reset instructions dispatched to your email!</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center space-x-1.5 mt-2"
              >
                <Zap className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>
                  {isSubmitting
                    ? 'Authenticating...'
                    : authModalMode === 'login'
                    ? 'Sign In to Account'
                    : 'Complete Registration ($100k Bonus)'}
                </span>
              </button>

              {/* Social Sign-in Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">
                  Or Connect With
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginUser('google.user@gmail.com', 'Google Trader');
                    setIsAuthModalOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition cursor-pointer"
                >
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginUser('apple.user@icloud.com', 'Apple Trader');
                    setIsAuthModalOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition cursor-pointer"
                >
                  <span>Apple ID</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
