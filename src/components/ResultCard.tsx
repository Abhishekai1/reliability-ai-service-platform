import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Info, Share2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const isReliable = result.status === 'Reliable';
  const confidencePercent = Math.round(result.confidence * 100);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.answer);
    // Simple feedback could be added here
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={result.timestamp}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${
                  isReliable 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}
              >
                {isReliable ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {result.status}
              </motion.div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={copyToClipboard}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Copy Answer"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question */}
          <div className="mb-10">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">User Query</h3>
            <p className="text-xl text-slate-900 font-semibold leading-tight">{result.question}</p>
          </div>

          {/* Answer */}
          <div className="mb-10 relative">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">RAASP Intelligence</h3>
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
              <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                {result.answer}
              </p>
            </div>
          </div>

          {/* Reliability Breakdown */}
          <div className="mb-10 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900 mb-1">Reliability Reasoning</h4>
                <p className="text-sm text-indigo-700/80 leading-snug">
                  {result.reasoning || "System validation complete. No anomalies detected in response structure."}
                </p>
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Confidence Score</span>
                <span className="text-[10px] text-slate-400 font-medium">Probabilistic Certainty Index</span>
              </div>
              <span className={`text-2xl font-black ${isReliable ? 'text-emerald-500' : 'text-amber-500'}`}>
                {confidencePercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidencePercent}%` }}
                transition={{ duration: 1.5, type: "spring" }}
                className={`h-full rounded-full ${isReliable ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]'}`}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
