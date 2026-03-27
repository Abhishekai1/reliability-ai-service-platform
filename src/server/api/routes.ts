import { Router } from 'express';
import { QueryRequestSchema } from '../models/schema';
import { aiEngine } from '../services/aiEngine';
import { reliabilityService } from '../services/reliability';
import { logger } from '../utils/logger';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.2.0',
    engine: process.env.GEMINI_API_KEY ? 'Gemini Pro' : 'Mock Engine'
  });
});

router.post('/query', async (req, res) => {
  try {
    const validated = QueryRequestSchema.safeParse(req.body);
    if (!validated.success) {
      return res.status(400).json({ error: validated.error.issues[0].message });
    }

    const { question } = validated.data;
    const answer = await aiEngine.generateResponse(question);
    const { confidence, status } = reliabilityService.computeReliability(answer);

    // Add reasoning for the status
    const reasoning = status === 'Reliable' 
      ? "Response meets length requirements and passed confidence threshold."
      : answer.length < 20 
        ? "Response is too short to be considered fully reliable."
        : "Confidence score fell below the 0.5 threshold.";

    logger.log(question, answer, confidence, status);

    res.json({
      question,
      answer,
      confidence,
      status,
      reasoning,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Query Route Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/logs', (req, res) => {
  try {
    const logs = logger.getLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

router.get('/stats', (req, res) => {
  try {
    const logs = logger.getLogs();
    const total = logs.length;
    const avgConfidence = total > 0 
      ? logs.reduce((acc: number, curr: any) => acc + curr.confidence, 0) / total 
      : 0;
    const reliableCount = logs.filter((l: any) => l.status === 'Reliable').length;
    
    res.json({
      totalQueries: total,
      averageConfidence: parseFloat(avgConfidence.toFixed(2)),
      reliabilityRate: total > 0 ? parseFloat(((reliableCount / total) * 100).toFixed(1)) : 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
