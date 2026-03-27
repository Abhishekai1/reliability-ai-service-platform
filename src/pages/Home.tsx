import React, { useState, useEffect } from 'react';
import QueryForm from '../components/QueryForm';
import ResultCard from '../components/ResultCard';
import { queryService } from '../services/api';
import { Shield, Activity, Database as DbIcon, History, BarChart3, Zap, Settings, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchHistory();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await queryService.getStats();
      if (data) setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats");
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await queryService.getLogs();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleQuery = async (question) => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryService.submitQuery(question);
      setResult(data);
      fetchStats();
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to RAASP service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <header className="border-b border-slate-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter block leading-none">RAASP</span>
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Reliability Platform</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-100">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              SYSTEM ACTIVE
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 relative">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Interaction */}
          <div className="flex-1 flex flex-col items-center lg:items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100">
                <Zap className="w-3 h-3" />
                Next-Gen AI Validation
              </div>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[0.9]">
                Intelligence <br />
                <span className="text-indigo-600">You Can Trust.</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
                RAASP bridges the gap between AI generation and human trust. 
                Every response is audited, scored, and verified in real-time.
              </p>
            </motion.div>

            <QueryForm onSubmit={handleQuery} isLoading={loading} />

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-4 shadow-sm"
              >
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <div className="text-sm font-bold">{error}</div>
              </motion.div>
            )}

            <div className="mt-16 w-full">
              <ResultCard result={result} />
            </div>
          </div>

          {/* Right Column: Stats & History */}
          <div className="w-full lg:w-80 flex flex-col gap-8">
            {/* Stats Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40"
            >
              <h3 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                <BarChart3 className="w-4 h-4" />
                Platform Stats
              </h3>
              
              <div className="space-y-8">
                <div>
                  <span className="text-sm font-bold text-slate-500 block mb-1">Total Audits</span>
                  <span className="text-3xl font-black text-slate-900">{stats?.totalQueries || history.length}</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-500 block mb-1">Avg. Confidence</span>
                  <span className="text-3xl font-black text-indigo-600">{stats?.averageConfidence || 0}%</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-500 block mb-1">Reliability Rate</span>
                  <span className="text-3xl font-black text-emerald-500">{stats?.reliabilityRate || 0}%</span>
                </div>
              </div>
            </motion.div>

            {/* Recent History */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex-1"
            >
              <h3 className="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Audits
                </div>
              </h3>
              
              <div className="space-y-4">
                {history.slice(0, 5).map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => setResult(item)}
                    className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
                  >
                    <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {item.question}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[10px] font-black uppercase ${item.status === 'Reliable' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {item.confidence * 100}%
                      </span>
                    </div>
                  </button>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400 font-medium italic">No audits yet</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <Shield className="w-5 h-5" />
            <span className="font-black text-lg tracking-tighter">RAASP</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API Reference</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
          </div>
          <div className="text-xs font-bold text-slate-400">
            &copy; 2026 RAASP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
