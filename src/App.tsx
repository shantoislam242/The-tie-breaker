/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  Table as TableIcon, 
  Zap, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { AnalysisType, AnalysisResult } from './types';
import { generateAnalysis } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [decision, setDecision] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.PROS_CONS);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await generateAnalysis(decision, analysisType);
      setResult({ type: analysisType, data } as AnalysisResult);
    } catch (err) {
      console.error(err);
      setError('Failed to generate analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Scale className="text-white w-5 h-5" />
            </div>
            <h1 className="font-serif text-xl font-bold tracking-tight">The Tiebreaker</h1>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <span className="text-slate-900">Decision Engine</span>
            <span>History</span>
            <span>About</span>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-serif font-bold text-slate-900 mb-4"
          >
            Decide with confidence.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Input your dilemma and let AI break down the complexities. 
            Choose your preferred analysis method to see every angle.
          </motion.p>
        </div>

        {/* Input Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-12">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label htmlFor="decision" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Your Dilemma
              </label>
              <textarea
                id="decision"
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-lg resize-none"
                placeholder="Should I move to New York for a new job or stay in my current city?"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: AnalysisType.PROS_CONS, label: 'Pros & Cons', icon: Scale, desc: 'Simple list of advantages and drawbacks' },
                { id: AnalysisType.COMPARISON, label: 'Comparison', icon: TableIcon, desc: 'Side-by-side table of options' },
                { id: AnalysisType.SWOT, label: 'SWOT Analysis', icon: Zap, desc: 'Strategic strengths and weaknesses' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setAnalysisType(type.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left group",
                    analysisType === type.id 
                      ? "border-slate-900 bg-slate-50" 
                      : "border-slate-100 hover:border-slate-200 bg-white"
                  )}
                >
                  <type.icon className={cn(
                    "w-6 h-6 mb-3 transition-colors",
                    analysisType === type.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  <span className="font-bold text-slate-900">{type.label}</span>
                  <span className="text-xs text-slate-500 mt-1 leading-relaxed">{type.desc}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || !decision.trim()}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-slate-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Dilemma...
                </>
              ) : (
                <>
                  Generate Analysis
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-2xl flex items-center gap-3 mb-8"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              key={result.type + decision}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Analysis Results</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {result.type === AnalysisType.PROS_CONS && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                      <h3 className="text-xl font-bold text-slate-900">Pros</h3>
                    </div>
                    <ul className="space-y-4">
                      {result.data.pros.map((pro, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                          <span className="text-slate-300 font-mono text-sm mt-1">0{i + 1}</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <XCircle className="text-rose-500 w-6 h-6" />
                      <h3 className="text-xl font-bold text-slate-900">Cons</h3>
                    </div>
                    <ul className="space-y-4">
                      {result.data.cons.map((con, i) => (
                        <li key={i} className="flex gap-3 text-slate-600 leading-relaxed">
                          <span className="text-slate-300 font-mono text-sm mt-1">0{i + 1}</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {result.type === AnalysisType.COMPARISON && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">Comparison Matrix</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Criteria</th>
                          {result.data.options.map((opt, i) => (
                            <th key={i} className="p-6 text-sm font-bold text-slate-900 border-b border-slate-100">{opt}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.criteria.map((criterion, i) => (
                          <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="p-6 text-sm font-semibold text-slate-700 border-b border-slate-50">{criterion}</td>
                            {result.data.options.map((opt, j) => {
                              const entry = result.data.entries.find(
                                e => e.option.toLowerCase() === opt.toLowerCase() && 
                                     e.criterion.toLowerCase() === criterion.toLowerCase()
                              );
                              return (
                                <td key={j} className="p-6 text-sm text-slate-600 border-b border-slate-50">
                                  {entry?.value || '—'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {result.type === AnalysisType.SWOT && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Strengths', data: result.data.strengths, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50/30' },
                    { label: 'Weaknesses', data: result.data.weaknesses, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50/30' },
                    { label: 'Opportunities', data: result.data.opportunities, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50/30' },
                    { label: 'Threats', data: result.data.threats, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50/30' },
                  ].map((section, i) => (
                    <div key={i} className={cn("rounded-3xl p-8 border border-slate-100 shadow-sm bg-white")}>
                      <div className="flex items-center gap-3 mb-6">
                        <section.icon className={cn("w-6 h-6", section.color)} />
                        <h3 className="text-xl font-bold text-slate-900">{section.label}</h3>
                      </div>
                      <ul className="space-y-3">
                        {section.data.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
                            <ChevronRight className="w-4 h-4 mt-0.5 text-slate-300 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Verdict Section */}
              <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lightbulb className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Final Verdict</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-6 leading-tight">
                    {result.data.verdict}
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => window.print()}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors border border-white/10"
                    >
                      Export Analysis
                    </button>
                    <button 
                      onClick={() => {
                        setResult(null);
                        setDecision('');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-2 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors"
                    >
                      New Decision
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Scale className="w-4 h-4" />
            <span className="text-sm font-serif font-bold">The Tiebreaker</span>
          </div>
          <p className="text-sm text-slate-400">
            Powered by Gemini AI. Helping you choose since 2026.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
