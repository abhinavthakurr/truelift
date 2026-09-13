"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { calculateBayesianA_B, VariantData, BayesianResult } from "@/lib/bayesian";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { jStat } from "jstat";

export default function Home() {
  const [variantA, setVariantA] = useState<VariantData>({ name: "Control", visitors: 1000, conversions: 50 });
  const [variantB, setVariantB] = useState<VariantData>({ name: "Test Variant", visitors: 1000, conversions: 65 });
  const [result, setResult] = useState<BayesianResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const calc = calculateBayesianA_B(variantA, variantB);
      setResult(calc);
      setIsCalculating(false);
    }, 400);
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    
    // Calculate distributions for the chart
    const alphaA = 1 + variantA.conversions;
    const betaA = 1 + variantA.visitors - variantA.conversions;
    const alphaB = 1 + variantB.conversions;
    const betaB = 1 + variantB.visitors - variantB.conversions;

    // Find a reasonable range to plot based on the means
    const meanA = alphaA / (alphaA + betaA);
    const meanB = alphaB / (alphaB + betaB);
    const spread = Math.max(
      Math.sqrt((alphaA * betaA) / (Math.pow(alphaA + betaA, 2) * (alphaA + betaA + 1))),
      Math.sqrt((alphaB * betaB) / (Math.pow(alphaB + betaB, 2) * (alphaB + betaB + 1)))
    );

    const minX = Math.max(0, Math.min(meanA, meanB) - spread * 4);
    const maxX = Math.min(1, Math.max(meanA, meanB) + spread * 4);
    const step = (maxX - minX) / 100;

    const data = [];
    for (let x = minX; x <= maxX; x += step) {
      data.push({
        x: (x * 100).toFixed(2) + "%", // Format as percentage
        rawX: x,
        Control: jStat.beta.pdf(x, alphaA, betaA),
        Test: jStat.beta.pdf(x, alphaB, betaB)
      });
    }
    return data;
  }, [result, variantA, variantB]);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-white/5 px-8 py-5 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
          <span className="text-xl font-bold tracking-wider text-white">TRUELIFT</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest text-gray-500 uppercase">
          <a href="#hero" className="hover:text-white transition-colors">Engine</a>
          <a href="#problem" className="hover:text-white transition-colors">The Flaw</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">Methodology</a>
          <a href="#cta" className="text-red-500 hover:text-red-400 transition-colors">Access</a>
        </div>
      </nav>

      {/* 1. Hero & Calculator Section */}
      <section id="hero" className="max-w-6xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Column: Hero Copy */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-3 py-1 rounded-full text-xs font-semibold tracking-widest text-red-500 uppercase">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            Bayesian Engine Live
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight">
            Stop guessing.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
              Prove the lift.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg text-gray-400 leading-relaxed max-w-lg">
            Traditional tools stop at flawed p-values. TrueLift runs concurrent randomized 
            holdouts and calculates actual expected loss, so you only roll out features 
            that mathematically guarantee revenue.
          </motion.p>

          <motion.div variants={fadeUp} className="pt-4 border-t border-white/10">
             <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <span className="text-red-500">✓</span> Peeking-safe
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-red-500">✓</span> Risk modeled
                </span>
             </div>
          </motion.div>
        </motion.div>

        {/* Right Column: The Calculator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#111] border border-white/5 rounded-2xl p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="mb-8 flex items-center justify-between">
             <h2 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Test Input</h2>
             <span className="text-xs text-red-500 font-mono">100,000 SIMULATIONS</span>
          </div>

          <div className="space-y-6 relative z-10">
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
              {isCalculating ? <span className="animate-pulse">Simulating...</span> : "Run Bayesian Analysis"}
            </button>
          </div>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">Analysis Output</h3>
              </div>

              {/* The Graph */}
              <div className="h-48 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTest" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorControl" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#525252" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#525252" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="x" stroke="#333" fontSize={10} tickMargin={8} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ fontSize: '12px' }}
                      labelStyle={{ color: '#888', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="Control" stroke="#525252" fillOpacity={1} fill="url(#colorControl)" />
                    <Area type="monotone" dataKey="Test" stroke="#ef4444" fillOpacity={1} fill="url(#colorTest)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-red-600/50"></div>
                    <div className="text-xs text-gray-500 mb-1 tracking-widest uppercase">Test Win Prob</div>
                    <div className="text-2xl font-mono text-white">{(result.probBBeatsA * 100).toFixed(1)}%</div>
                 </div>
                 <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-1 bg-gray-600/50"></div>
                    <div className="text-xs text-gray-500 mb-1 tracking-widest uppercase">Expected Risk</div>
                    <div className="text-2xl font-mono text-gray-300">{(result.expectedLossB * 100).toFixed(2)}%</div>
                 </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* 2. The Problem Section */}
      <section id="problem" className="bg-[#eae8e1] text-gray-900 py-32 mt-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto px-6"
        >
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="flex-1 space-y-6">
              <motion.h4 variants={fadeUp} className="text-xs font-bold tracking-widest text-red-600 uppercase">The Flaw</motion.h4>
              <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold tracking-tight leading-none text-black">
                Most A/B Tests are lying to you.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Revenue leaks quietly when product managers pause tests exactly when they cross a magical "95% significance" line, creating massive false positives.
              </motion.p>
            </div>
            
            <div className="flex-1 space-y-12 pt-12 lg:pt-0">
              <motion.div variants={fadeUp} className="border-t border-gray-300 pt-6">
                <div className="flex gap-6">
                  <span className="text-2xl font-black text-red-600">01</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">The Peeking Problem</h3>
                    <p className="text-gray-600">Checking a test everyday guarantees you will eventually see a false positive. You end up shipping features that actually lose money.</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUp} className="border-t border-gray-300 pt-6">
                <div className="flex gap-6">
                  <span className="text-2xl font-black text-red-600">02</span>
                  <div>
                    <h3 className="text-xl font-bold mb-2">P-Values are unreadable</h3>
                    <p className="text-gray-600">Your CFO doesn't care about the null hypothesis. They care about expected financial risk if a rollout goes wrong.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Methodology / How we work */}
      <section id="how-it-works" className="py-32 bg-black border-y border-white/5">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto px-6"
        >
          <motion.h4 variants={fadeUp} className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4">Methodology</motion.h4>
          <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-extrabold tracking-tight text-white mb-20">
            Model. Simulate. Rollout.
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={fadeUp} className="border border-white/10 bg-[#111] p-8 rounded-xl hover:border-red-500/50 transition-colors">
              <div className="text-5xl font-black text-white/5 mb-6">01</div>
              <h3 className="text-xl font-bold text-white mb-2">Beta Distribution</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We model your conversions as a Beta Distribution, continuously updating our priors to match reality as new data arrives.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="border border-white/10 bg-[#111] p-8 rounded-xl hover:border-red-500/50 transition-colors">
              <div className="text-5xl font-black text-white/5 mb-6">02</div>
              <h3 className="text-xl font-bold text-white mb-2">Monte Carlo Simulation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                By drawing 100,000 samples from the distributions, we simulate alternate realities to discover how frequently your variant wins.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="border border-white/10 bg-[#111] p-8 rounded-xl hover:border-red-500/50 transition-colors">
              <div className="text-5xl font-black text-white/5 mb-6">03</div>
              <h3 className="text-xl font-bold text-white mb-2">Expected Loss</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We calculate exactly how much money you stand to lose if you force a rollout on a losing variant, giving you financial precision.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 4. CTA Profile */}
      <section id="cta" className="bg-red-600 text-black py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 relative z-10"
        >
          <div>
            <motion.h4 variants={fadeUp} className="text-xs font-bold tracking-widest uppercase mb-4 opacity-80">Enterprise Pilot</motion.h4>
            <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1] mb-6">
              Start scaling with certainty.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg font-medium opacity-90 max-w-sm mb-8">
              Integrate TrueLift via API directly into your growth stack. Free during our exclusive design partner phase.
            </motion.p>
            <motion.button variants={fadeUp} className="bg-black text-white hover:bg-gray-900 px-8 py-4 rounded-none font-bold tracking-widest uppercase text-sm transition-transform hover:-translate-y-1">
              Become a Partner →
            </motion.button>
          </div>
          
          <motion.div variants={fadeUp} className="border-l border-black/20 pl-8 space-y-8">
            <div>
              <h4 className="font-bold text-lg mb-1">What you get</h4>
              <p className="opacity-80">Full API access, dedicated Slack channel, and custom dashboard integrations.</p>
            </div>
            <div className="border-t border-black/10 pt-8">
              <h4 className="font-bold text-lg mb-1">What we ask</h4>
              <p className="opacity-80">Feedback on the API speed, and a case study if we successfully prevent a massive loss.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
             <span className="text-sm font-bold tracking-wider text-white">TRUELIFT</span>
           </div>
           <div className="text-xs text-gray-600">
              © 2026 TrueLift Analytics. All rights reserved. 
           </div>
        </div>
      </footer>
    </div>
  );
}
