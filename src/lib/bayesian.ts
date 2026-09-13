import { jStat } from 'jstat';

export interface VariantData {
  name: string;
  visitors: number;
  conversions: number;
}

export interface BayesianResult {
  probBBeatsA: number;
  expectedLossA: number; // The risk if we confidently choose A, and we're wrong
  expectedLossB: number; // The risk if we confidently choose B, and we're wrong
}

/**
 * Calculates the probability of B beating A and the expected risk (loss)
 * using Monte Carlo simulations.
 */
export function calculateBayesianA_B(
  variantA: VariantData,
  variantB: VariantData,
  simulations: number = 100000
): BayesianResult {
  
  // 1. Define the Alpha and Beta parameters for our prior distributions
  // (We use a Beta(1,1) uniform prior, meaning before seeing data, all conversion rates are equally likely)
  const alphaA = 1 + variantA.conversions;
  const betaA = 1 + variantA.visitors - variantA.conversions;
  
  const alphaB = 1 + variantB.conversions;
  const betaB = 1 + variantB.visitors - variantB.conversions;

  let bWins = 0;
  let totalLossA = 0;
  let totalLossB = 0;

  // 2. Run the Monte Carlo Simulation
  for (let i = 0; i < simulations; i++) {
    // Draw a random simulated conversion rate from each distribution
    const sampleA = jStat.beta.sample(alphaA, betaA);
    const sampleB = jStat.beta.sample(alphaB, betaB);
    
    // Who won this simulation?
    if (sampleB > sampleA) {
      bWins++;
      // If B is better, choosing A results in a loss of (B - A)
      totalLossA += (sampleB - sampleA);
    } else {
      // If A is better, choosing B results in a loss of (A - B)
      totalLossB += (sampleA - sampleB);
    }
  }
  
  // 3. Average out our findings
  return {
    probBBeatsA: bWins / simulations,
    expectedLossA: totalLossA / simulations,
    expectedLossB: totalLossB / simulations,
  };
}
