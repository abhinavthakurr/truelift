"use client";

import { useState } from "react";
import { calculateBayesianA_B, VariantData, BayesianResult } from "@/lib/bayesian";

export default function Home() {
  const [variantA, setVariantA] = useState<VariantData>({ name: "Control", visitors: 1000, conversions: 50 });
  const [variantB, setVariantB] = useState<VariantData>({ name: "Test Variant", visitors: 1000, conversions: 65 });
  const [result, setResult] = useState<BayesianResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Slight timeout just for a smooth UI loading feel
    setTimeout(() => {
      const calc = calculateBayesianA_B(variantA, variantB);
      setResult(calc);
      setIsCalculating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 px-8 py-5 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
          <span className="text-xl font-bold tracking-wider text-white">TRUELIFT</span>
        </div>
        <div className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">
          Our Methodology
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Hero Copy */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-red-400 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Bayesian Engine Live
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            Stop guessing.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Prove the lift.
            </span>
          </h1>
          
          <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
            Traditional tools stop at flawed p-values. TrueLift runs concurrent randomized 
            holdouts and calculates actual expected loss, so you only roll out features 
            that mathematically guarantee revenue.
          </p>

          <div className="pt-4 border-t border-white/10">
             <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Peeking-safe
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Risk modeled
                </span>
             </div>
          </div>
        </div>

        {/* Right Column: The Calculator */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="mb-8 flex items-center justify-between">
             <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Test Input</h2>
             <span className="text-xs text-red-500 font-mono">100,000 SIMULATIONS</span>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Control Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Control Visitors</label>
                <input 
                  type="number" 
                  value={variantA.visitors}
                  onChange={(e) => setVariantA({...variantA, visitors: parseInt(e.target.value) || 0})}
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Control Conversions</label>
                <input 
                  type="number" 
                  value={variantA.conversions}
                  onChange={(e) => setVariantA({...variantA, conversions: parseInt(e.target.value) || 0})}
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* Test Variant Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Test Visitors</label>
                <input 
                  type="number" 
                  value={variantB.visitors}
                  onChange={(e) => setVariantB({...variantB, visitors: parseInt(e.target.value) || 0})}
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Test Conversions</label>
                <input 
                  type="number" 
                  value={variantB.conversions}
                  onChange={(e) => setVariantB({...variantB, conversions: parseInt(e.target.value) || 0})}
                  className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-lg mt-4 transition-all uppercase tracking-widest text-sm flex justify-center items-center gap-2"
            >
              {isCalculating ? (
                <span className="animate-pulse">Simulating...</span>
              ) : (
                "Run Bayesian Analysis"
              )}
            </button>
          </div>

          {/* Results Block */}
          {result && (
            <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Analysis Output</h3>
              </div>

              <div className="bg-[#0a0a0a] rounded-xl border border-white/5 p-6 mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Probability Test Wins</div>
                <div className="text-5xl font-light font-mono text-white">
                  {(result.probBBeatsA * 100).toFixed(1)}<span className="text-2xl text-red-500">%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5">
                    <div className="text-xs text-gray-500 mb-1">Risk if choose Test</div>
                    <div className="text-xl font-mono text-gray-300">{(result.expectedLossB * 100).toFixed(2)}%</div>
                 </div>
                 <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5">
                    <div className="text-xs text-gray-500 mb-1">Risk if choose Control</div>
                    <div className="text-xl font-mono text-gray-300">{(result.expectedLossA * 100).toFixed(2)}%</div>
                 </div>
              </div>
              
              {/* Intelligent Recommendation */}
              <div className="mt-6 border-l-2 border-red-500 pl-4 py-1">
                <p className="text-sm text-gray-400">
                  <span className="text-white font-bold block mb-1">Verdict:</span>
                  {result.probBBeatsA > 0.95 
                    ? "The test variant is mathematically superior. Deploy with confidence; downside risk is negligible."
                    : result.probBBeatsA < 0.05 
                    ? "The test variant is underperforming. Cease rollout to prevent further revenue leakage."
                    : "Statistical significance not met. Incremental lift is currently unproven. Let the holdout continue."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
             <span className="text-sm font-bold tracking-wider text-white">TRUELIFT</span>
           </div>
           <div className="text-xs text-gray-600">
              Inspired design. Powered by Bayesian Inference. 
           </div>
        </div>
      </footer>
    </div>
  );
}
