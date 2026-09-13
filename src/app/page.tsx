"use client";

import { useState } from "react";
import { calculateBayesianA_B, VariantData, BayesianResult } from "@/lib/bayesian";

export default function Home() {
  const [variantA, setVariantA] = useState<VariantData>({ name: "Variant A", visitors: 1000, conversions: 50 });
  const [variantB, setVariantB] = useState<VariantData>({ name: "Variant B", visitors: 1000, conversions: 65 });
  const [result, setResult] = useState<BayesianResult | null>(null);

  const handleCalculate = () => {
    // Run the Monte Carlo simulation (100,000 iterations is fast enough for the browser)
    const calc = calculateBayesianA_B(variantA, variantB);
    setResult(calc);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="max-w-4xl w-full">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TrueLift Experiment Engine</h1>
          <p className="text-lg text-gray-600">Peeking-safe Bayesian A/B testing calculator.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Variant A Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Control (A)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Visitors</label>
                <input 
                  type="number" 
                  value={variantA.visitors}
                  onChange={(e) => setVariantA({...variantA, visitors: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Conversions</label>
                <input 
                  type="number" 
                  value={variantA.conversions}
                  onChange={(e) => setVariantA({...variantA, conversions: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
                />
              </div>
              <div className="pt-2 text-sm text-gray-500 font-medium">
                Conversion Rate: {((variantA.conversions / variantA.visitors || 0) * 100).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Variant B Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Variant (B)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Visitors</label>
                <input 
                  type="number" 
                  value={variantB.visitors}
                  onChange={(e) => setVariantB({...variantB, visitors: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Conversions</label>
                <input 
                  type="number" 
                  value={variantB.conversions}
                  onChange={(e) => setVariantB({...variantB, conversions: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
                />
              </div>
              <div className="pt-2 text-sm text-gray-500 font-medium">
                Conversion Rate: {((variantB.conversions / variantB.visitors || 0) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <button 
            onClick={handleCalculate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Run Bayesian Analysis
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Analysis Results</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Probability B is better</div>
                <div className={`text-4xl font-bold ${result.probBBeatsA > 0.95 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {(result.probBBeatsA * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Risk of choosing B</div>
                <div className="text-2xl font-semibold text-red-400">
                  -{(result.expectedLossB * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-2">Conversion drop if wrong</div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="text-sm text-gray-400 mb-1">Risk of choosing A</div>
                <div className="text-2xl font-semibold text-orange-400">
                  -{(result.expectedLossA * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-2">Missed uplift if wrong</div>
              </div>
            </div>
            
            <div className="mt-6 text-gray-300 text-sm bg-gray-800 p-4 rounded-lg">
              <strong>Recommendation: </strong> 
              {result.probBBeatsA > 0.95 
                ? "Variant B is a clear winner. You can confidently deploy this knowing the risk is negligible."
                : result.probBBeatsA < 0.05 
                ? "Variant A is solidly beating Variant B. Do not roll out Variant B."
                : "The results are not yet conclusive. Rolling out B carries statistical risk. Let the test continue running."}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
