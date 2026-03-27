export interface ReliabilityResult {
  confidence: number;
  status: 'Reliable' | 'Uncertain';
}

export class ReliabilityService {
  computeReliability(answer: string): ReliabilityResult {
    // Simple reliability logic as requested:
    // If answer length < threshold OR random confidence < 0.5 -> "Uncertain"
    
    const confidence = Math.random();
    const lengthThreshold = 20;
    
    let status: 'Reliable' | 'Uncertain' = 'Reliable';
    
    if (answer.length < lengthThreshold || confidence < 0.5) {
      status = 'Uncertain';
    }
    
    return {
      confidence: parseFloat(confidence.toFixed(2)),
      status
    };
  }
}

export const reliabilityService = new ReliabilityService();
